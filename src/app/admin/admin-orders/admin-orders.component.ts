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
  wineOrdersDisplay: Order[] = [];

 

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
        this.orders = orders;
        this.wineOrdersDisplay = [...orders]; // Initialize with all orders
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

  updateOrderStatus(orderId: number, newStatus: number) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      response => {
        console.log(response);
  
        // Find the order and update its status
        const order = this.orders.find(order => order.wineOrderId === orderId);
        const displayOrder = this.wineOrdersDisplay.find(order => order.wineOrderId === orderId);
        if (order && displayOrder) {
          order.orderStatusId = newStatus;
          displayOrder.orderStatusId = newStatus; // update the status in the display array as well
          this.toastr.success('Status updated', 'Success');
  
          // Remove from wineOrdersDisplay if status is 'Collected'
          if (newStatus === 4) {
            this.wineOrdersDisplay = this.wineOrdersDisplay.filter(order => order.wineOrderId !== orderId);
          }
        }
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }
  
}
