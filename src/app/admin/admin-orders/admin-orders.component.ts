import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/customer/services/order.service';
import { Order } from 'src/app/Model/order';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        console.log(orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  updateOrderStatus(orderId: number) {
    this.orderService.updateOrderStatus(orderId).subscribe(
      response => {
        console.log(response);
        this.fetchAllOrders();  // Refresh the orders to reflect the updated status
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }
}


