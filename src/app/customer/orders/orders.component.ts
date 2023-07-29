import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/Model/order';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { WineService } from 'src/app/admin/services/wine.service';
import { Wine } from 'src/app/Model/wine';
import { RefundService } from '../services/refund.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  wines: Wine[] = [];
  currentOrderId: number | null = null;
  currentWineId: number | null = null;

  //Refunds
  showRefundModal: boolean = false;
  currentRefundDescription: string = '';

  constructor(private orderService: OrderService, private toastr: ToastrService, private wineService : WineService, private refundService: RefundService) { }

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    await this.loadOrders(email);
    await this.loadWines();
  }

  async loadOrders(email: string): Promise<void> {
    try {
      this.orders = await this.orderService.getOrdersForUser(email).toPromise() || [];
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
    const wine = this.wines.find(w => w.wineID === wineId);
    console.log('WineId and Found wine:', wineId, wine);  // Add this line
    return wine ? wine.name : 'Unknown';
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Request a refund
async requestRefund(orderId: number, wineId: number, description: string): Promise<void> {
  let token = localStorage.getItem('Token') || '';
  let decodedToken = jwt_decode(token) as DecodedToken;
  let email = decodedToken.sub;

  // Find the corresponding order
  let order = this.orders.find(o => o.wineOrderId === orderId);
  
  if (!order) {
    console.error('Order not found.');
    this.toastr.error('Order not found.', 'Error');
    return;
  }

  // Use the cost from the order
  let cost = order.orderTotal;
  console.log('Order Total:', order.orderTotal);

  try {
    await this.refundService.requestRefund(wineId, email, cost, description).toPromise(); // pass the description
    this.toastr.success('Refund request has been sent.');
    console.log('Order Total:', order.orderTotal);
  } catch (error) {
    console.error('Error:', error);
    this.toastr.error('Could not send refund request.', 'Error');
  }
}


openRefundModal(orderId: number, wineId: number): void {
  this.currentOrderId = orderId; // Store the current order ID
  this.showRefundModal = true;
  this.currentWineId = wineId;  // Assign the parameter to currentWineId
}


closeRefundModal(): void {
  this.showRefundModal = false;
  this.currentRefundDescription = ''; // Clear the description
}

async submitRefundForm(form: NgForm): Promise<void> {
  if (form.valid) {
    if (this.currentOrderId !== null && this.currentWineId !== null) {
      await this.requestRefund(this.currentOrderId, this.currentWineId, this.currentRefundDescription); 
      // Added this.currentWineId here and use the stored order ID, wine ID and entered description
      this.closeRefundModal();
    } else {
      console.error('No order selected for refund.');
      // Display error to user, e.g., using toastr
    }
  }
}

  
}