import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/Model/order';
import jwt_decode from 'jwt-decode';
import { DataServiceService, DecodedToken } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { WineService } from 'src/app/admin/services/wine.service';
import { Wine } from 'src/app/Model/wine';
import { RefundService } from '../../admin/services/refund.service';
import { NgForm } from '@angular/forms';
import { RefundItem } from 'src/app/Model/RefundRequest';

@Component({
  selector: 'app-order-history',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  wines: Wine[] = [];
  currentOrderId: number | null = null;
  currentWineId: number | null = null;
  phoneNumber: string = '';

  //Refunds
  showRefundModal: boolean = false;
  currentRefundDescription: string = '';
  referenceNumber: string = '';
  currentOrderItems: any[] = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private wineService: WineService,
    private refundService: RefundService,
    private dataService: DataServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    this.phoneNumber = decodedToken.phoneNumber;
    console.log('Phone Number:', this.phoneNumber);
    await this.loadOrders(email);
    await this.loadWines();
  }

  async loadOrders(email: string): Promise<void> {
    try {
      this.orders =
        (await this.orderService.getOrdersForUser(email).toPromise()) || [];
      console.log(this.orders);
    } catch (error) {
      console.error('Error:', error);
      // this.toastr.error('Could not load order history.', 'Error');
    }
  }

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error('Error:', error);
      // this.toastr.error('Could not load wines.', 'Error');
    }
  }

  getWineName(wineId: number): string {
    const wine = this.wines.find((w) => w.wineID === wineId);
    //console.log('WineId and Found wine:', wineId, wine);  // Add this line
    return wine ? wine.name : 'Unknown';
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Request a refund
  // async requestRefund(orderId: number, wineId: number, description: string, refNum: string): Promise<void> {
  //   let token = localStorage.getItem('Token') || '';
  //   let decodedToken = jwt_decode(token) as DecodedToken;
  //   let email = decodedToken.sub;

  //   // Find the corresponding order
  //   let order = this.orders.find(o => o.wineOrderId === orderId);
  //   if (!order) {
  //     console.error('Order not found.');
  //     this.toastr.error('Order not found.', 'Error');
  //     return;
  //   }
  //   refNum = order.orderRefNum;
  //   // Use the cost from the order
  //   let cost = order.orderTotal;
  //   //console.log('Order Total:', order.orderTotal);

  //   try {
  //     await this.refundService.requestRefund(wineId, email, cost, description, refNum, this.phoneNumber).toPromise(); // pass the description
  //     this.toastr.success('Refund request has been sent.', 'Success');
  //     order.isRefunded = true;
  //     //console.log('Order Total:', order.orderTotal);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     if (error && typeof error === 'string') {
  //       this.toastr.error(error); // Display the error message from the API
  //     } else {
  //       this.toastr.error('Could not send refund request.', 'Error');
  //     }
  //   }
  //   console.log('Phone Number:', this.phoneNumber);
  // }

  openRefundModal(order: Order): void {
    this.currentOrderItems = order.orderItems.map(item => ({
      wineId: item.wineId,
      wine: item.wine,
      quantity: item.quantity,
      refundQuantity: 0,
      refundReason: ''
    }));
    this.currentOrderId = order.wineOrderId;
    this.showRefundModal = true;
  }

  closeRefundModal(): void {
    this.showRefundModal = false;
    this.currentRefundDescription = ''; // Clear the description
    this.currentOrderItems = [];
  }

  async submitRefundForm(form: NgForm): Promise<void> {
    if (form.invalid) return;

    let refundItems: RefundItem[] = [];
    let userOrders: any[] = [];

    if (this.currentOrderItems.length === 1) {
        refundItems = this.currentOrderItems
            .filter(item => item.refundReason && +item.refundQuantity > 0)
            .map(item => ({
                wineOrderItemId: item.wineId || item.wineID,
                quantity: +item.refundQuantity,
                reason: item.refundReason
            }));
        this.sendRefundRequest(refundItems);
    } else {
        var email = this.dataService.getUserFromToken()!.email;
       
      
        this.orderService.getOrdersForUser(email).subscribe((result: any) => {
          userOrders = result;
          
          // Get the specific order based on the currentOrderId
          let currentOrder = userOrders.find(order => order.wineOrderId === this.currentOrderId);
          console.log("Current Order:", currentOrder);

          if (!currentOrder) {
              console.error('Current order not found in user orders.');
              return;
          }
      
          refundItems = this.currentOrderItems
    .filter(item => item.refundReason && +item.refundQuantity > 0)
    .flatMap(item => {  
        
        let matchingOrderItem = currentOrder.orderItems.find((oi: any) => oi.wineId === item.wineId);


        if (!matchingOrderItem) {
            console.error(`No matching order item found for wineId: ${item.wineId || item.wineID}`);
            return [];  // Return an empty array instead of null
        }else{
          console.log(`Matched wineOrderItemId: ${matchingOrderItem.wineOrderItemId}`);
        }


        return [{
            wineOrderItemId: matchingOrderItem.wineOrderItemId,
            quantity: +item.refundQuantity,
            reason: item.refundReason
        }];
    });
          this.sendRefundRequest(refundItems);
      });
    }
}

async sendRefundRequest(refundItems: RefundItem[]): Promise<void> {
    if (this.currentOrderId === null) {
        console.error('currentOrderId is null.');
        this.toastr.error('An error occurred. Please try again.', 'Error');
        return;
    }
    console.log('Here', this.currentOrderId);
    try {
        await this.refundService.requestRefund(this.currentOrderId, "", refundItems).toPromise();
        this.toastr.success('Refund request has been sent.', 'Success');
        this.closeRefundModal();
    } catch (error) {
        console.error('Error:', error);
        this.toastr.error('Could not send refund request.', 'Error');
    }
}




  checkRefundAvailability(order: Order): boolean {
    const orderDate = new Date(order.collectedDate);
    const currentTime = new Date();
    const timeDifferenceInMilliseconds =
      currentTime.getTime() - orderDate.getTime();
    let sevenDaysInMillisecond = 7 * 24 * 60 * 60 * 1000;

    if (timeDifferenceInMilliseconds <= sevenDaysInMillisecond) {
      return true;
    } else {
      return false;
    }
  }
}