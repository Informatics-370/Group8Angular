import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/customer/services/order.service';
import { Order } from 'src/app/Model/order';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
 

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders.map(order => ({
          ...order,
          statusUpdated: false // Set statusUpdated as false initially
        }));
        console.log(this.orders);
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

        // Find the order and set statusUpdated as true
        const order = this.orders.find(order => order.wineOrderId === orderId);
        if (order) {
          order.received = true;
          this.toastr.success('Status updated','Success');
        }

        // Alternatively, if you want the latest data from the server, uncomment the line below.
        // this.fetchAllOrders();  // Refresh the orders to reflect the updated status
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }
}
