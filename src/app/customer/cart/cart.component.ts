import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../services/data-service.service';
import { Cart, CartItem } from 'src/app/Model/Cart';
import { Wine } from 'src/app/Model/wine';  // Import Wine model
import { WineService } from 'src/app/admin/services/wine.service';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../services/data-service.service';
import { WinePurchase } from 'src/app/Model/WinePurchase';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../services/payment.service';
import { DiscountService } from 'src/app/admin/services/discount.service';
import { Discount } from 'src/app/Model/discount';
import { OrderService } from '../services/order.service';
import { switchMap } from 'rxjs/operators';
import { VatService } from 'src/app/admin/services/vat.service';
import { VAT } from 'src/app/Model/vat';




@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Cart | undefined;
  cartItems: CartItem[] = [];
  currentVat: VAT | undefined = undefined;
  wines: Wine[] = [];  // This will hold wines details
  cartTotal = 0;

  discountCode: string = '';

  isDiscountApplied: boolean = false;

  constructor(private cartService: CartService, private wineService: WineService, private toastr: ToastrService, private loginService: DataServiceService, private paymentService: PaymentService, private discountService: DiscountService, private orderService: OrderService, private vatService: VatService) { }  // Inject WineService

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    await this.loadWines();
    await this.loadCart(email);
    await this.loadCartTotal(email); // Call the new method to load the cart total

    console.log(email);
    console.log(this.cart)

    this.loadCurrentVat();

  }


  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.log(error);
    }
  }

  loadCart(email: string): void {
    this.cartService.getCart(email).subscribe(
      (cart: Cart) => {
        this.cart = cart;
        this.cartTotal = cart.cartTotal;

        // After loading the cart, update the cartItemCount BehaviorSubject
        const totalCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.cartService.updateCartItemCount(totalCount); // Assuming you have a method to update cartItemCount
      },
      error => {
        console.error('Error:', error);
      }
    );
  }


  loadCartTotal(email: string): void {
    this.cartService.getCartTotal(email).subscribe(
      (total: number) => {
        this.cartTotal = total; // Update the cart total
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  

  latestVatPercentage: number = 0; 

  loadCurrentVat() {
    this.vatService.getLatestVAT().subscribe(
      (vatPercentage: number) => {
        this.latestVatPercentage = vatPercentage;
        console.log(this.latestVatPercentage);
      },
      (error: any) => {
        console.error('Error loading VAT:', error);
        // handle the error appropriately
      }
    );
  }

  calculateVatAmount(): number {
    // Directly use the latestVatPercentage
    return (this.cartTotal * this.latestVatPercentage) / (100 + this.latestVatPercentage);
  }

  calculateTotalBeforeVat(): number {
    return this.cartTotal - this.calculateVatAmount();
  }



  async incrementQuantity(cartItemId: number): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;

    if (!email) return;

    try {
      await this.cartService.incrementCartItemQuantity(email, cartItemId).toPromise();
      await this.loadCart(email);
    } catch (error) {
      console.log(error);
    }
  }

  async decrementQuantity(cartItemId: number): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;



    if (!email) return;

    try {
      await this.cartService.decrementCartItemQuantity(email, cartItemId).toPromise();
      await this.loadCart(email);

    } catch (error) {
      console.log(error);
    }
  }


  getWineDetails(wineID: number): Wine | undefined {
    const foundWine = this.wines.find(wine => wine.wineID === wineID);
    return foundWine;
  }
  //////////////////////////////////////////////////DISCOUNT CALCULATION///////////////////////////////////////////////////////////////////////////
  showApplyDiscountModal: boolean = false;

  openApplyDiscountModal(): void {
    this.showApplyDiscountModal = true;
  }

  closeApplyDiscountModal(): void {
    this.showApplyDiscountModal = false;
  }

  onApplyDiscountCode() {
    if (this.isDiscountApplied) {
      return;
    }

    this.openApplyDiscountModal();
  }

  discount: Discount | undefined;

  async confirmApplyDiscount(): Promise<void> {
    console.log('Sending discount code:', this.discountCode);
    try {
      let discount: Discount = await this.discountService.validateDiscountCode(this.discountCode);
      this.discount = discount; // assign the validated discount to the component property

      if (discount && discount.discountAmount && discount.discountID != null) {

        // Calculate the new cart total after applying the discount
        const newCartTotal = this.cartTotal - discount.discountAmount;

        // Check if the new cart total is less than R20
        if (newCartTotal < 20) {
          // Inform the user and return from the method
          this.toastr.warning('Cart total cannot be less than R20 after applying discount.', 'Warning');
          // Keep the discount modal open and do not apply the discount
          return;
        }

        this.discountService.deleteDiscount(discount.discountID);
        // If newCartTotal is valid, update the cartTotal, mark the discount as applied, and proceed
        this.cartTotal = newCartTotal;
        console.log('New cart total:', this.cartTotal);
        this.isDiscountApplied = true;

        let token = localStorage.getItem('Token') || '';
        let decodedToken = jwt_decode(token) as DecodedToken;
        let email = decodedToken.sub;

        this.cartService.applyDiscount(email, this.cartTotal).subscribe(
          async () => {
            this.toastr.success('Discount code applied successfully!', 'Discount Code');
            this.closeApplyDiscountModal();
            // Trigger the payment function after the discount has been applied successfully
            await this.onProceedToPayment();
          },
          error => {
            console.error('Error updating discounted total:', error);
            this.toastr.error('An error occurred while applying the discount', 'Discount Code');
          }
        );
      }
    } catch (error) {
      console.error('Error applying discount code:', error);
      this.toastr.error('Discount code already used or does not exist', 'Discount Code');
    }
  }





  //////////////////////////////////////////////////PAYFAST PAYMENTS///////////////////////////////////////////////////////////////////////////

  async onProceedToPayment(): Promise<void> {
    if (!this.cart || !this.loginService.userValue) {
      this.toastr.warning('Please log in and add items to your cart.', 'Warning');
      return;
    }

    const winePurchase: WinePurchase = {
      userEmail: this.loginService.userValue.email,
      purchaseDate: new Date(),
      ticketPrice: this.cartTotal,
      productName: "The Promenade Wine",
    };

    this.paymentService.initiateWinePayment(winePurchase).subscribe(
      (payfastRequest: any) => {
        // Create and submit the payment form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payfast.co.za/eng/process';
        form.target = '_self';

        for (const key in payfastRequest) {
          if (payfastRequest.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = payfastRequest[key];
            form.appendChild(hiddenField);
          }
        }

        document.body.appendChild(form);
        form.submit();

        // Chain the next calls
        this.orderService.createOrder(winePurchase.userEmail).pipe(
          // After order is created, then clear the cart
          switchMap(() => this.cartService.clearCart(winePurchase.userEmail))
        ).subscribe(
          () => {
            console.log('Order created and cart cleared successfully.');
            this.toastr.info('Order created', 'Success');
            this.cartTotal = 0; // Reset the cart total
            this.loadCart(winePurchase.userEmail);
            // Reset the cart counter

          },
          error => {
            console.error('Error:', error);
            this.toastr.error('An error occurred.', 'Error');
          }
        );
      },
      (error: HttpErrorResponse) => {
        if (error.error === 'User is not logged in') {
          this.toastr.warning('Please log in to purchase.', 'Warning');
          console.error('User is not logged in');
        } else {
          console.error(error);
        }
      }
    );
  }
}
