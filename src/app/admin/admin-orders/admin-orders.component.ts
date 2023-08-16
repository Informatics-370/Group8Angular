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
  
  searchWineRef: string = '';

  get filteredOrders(): Order[] {
    return this.orders.filter(order =>
      order.orderRefNum.toLowerCase().includes(this.searchWineRef.toLowerCase())
    );
  }

  fetchAllOrders() {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders.map(order => ({
          ...order,
          statusUpdated: 0 // Set statusUpdated as false initially
        }));
        console.log(this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  updateOrderStatus(orderId: number, status: number) {
    this.orderService.updateOrderStatus(orderId).subscribe(
      response => {
        console.log(response);

        // Find the order and update its status
        const order = this.orders.find(order => order.wineOrderId === orderId);
        if (order) {
          order.orderStatus = status;
          this.toastr.success('Status updated', 'Success');
        }
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
}
}
