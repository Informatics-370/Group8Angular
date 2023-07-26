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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Cart | undefined;
  cartItems: CartItem[] = [];

  wines: Wine[] = [];  // This will hold wines details
  cartTotal = 0;

  discountCode: string = '';

  

  constructor(private cartService: CartService, private wineService: WineService, private toastr: ToastrService, private loginService: DataServiceService,private paymentService: PaymentService, private discountService: DiscountService   ) { }  // Inject WineService

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    await this.loadWines();
    await this.loadCart(email);
    console.log(email);
    console.log(this.cart)
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
      },
      error => {
        console.error('Error:', error);
      }
    );
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


onApplyDiscountCode() {
  console.log('Sending discount code:', this.discountCode); 
  this.discountService.validateDiscountCode(this.discountCode)

  .then((discount: Discount) => {
    if (discount && discount.discountPercentage) {
      // If the discount code is valid, the server will return the discount object
      // Calculate the new total
      this.cartTotal = this.cartTotal - (this.cartTotal * discount.discountPercentage / 100);
      console.log('New cart total:', this.cartTotal);
    }
  })
  .catch(error => {
    // If the discount code is not valid, the server will return an error
    // Display the error message to the user
    console.error('Error applying discount code:', error);
  });
}



//////////////////////////////////////////////////PAYFAST PAYMENTS///////////////////////////////////////////////////////////////////////////

async onProceedToPayment(): Promise<void> {
  // Ensure there's a cart and a logged in user
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
      // Create a form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payfast.co.za/eng/process';
      form.target = '_self';
  
      // Add the form fields
      for (const key in payfastRequest) {
        if (payfastRequest.hasOwnProperty(key)) {
          const hiddenField = document.createElement('input');
          hiddenField.type = 'hidden';
          hiddenField.name = key;
          hiddenField.value = payfastRequest[key];
          form.appendChild(hiddenField);
        }
      }
  
      // Add the form to the page and submit it
      document.body.appendChild(form);
      form.submit();
    },
    (error: HttpErrorResponse) => {
      if (error.error === 'User is not logged in') {
        this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
        console.error('User is not logged in');
      } else {
        console.error(error);
      }
    }
  );
}

}
