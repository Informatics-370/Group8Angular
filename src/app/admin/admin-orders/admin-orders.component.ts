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
  public showPastOrders: boolean = false;

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit() {
    this.fetchAllOrders();
    this.filterOrders();
  }

  fetchAllOrders() {
    this.orderService.getAllOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders.map(order => ({
          ...order,
          statusUpdated: 0 // Set statusUpdated as false initially
        }));
        this.filterOrders();
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  searchWineRef: string = '';

  get filteredOrders(): Order[] {
    return this.orders.filter(order => 
      order.orderRefNum.toLowerCase().includes(this.searchWineRef.toLowerCase())
    );
  }

  updateOrderStatus(orderId: number, newStatus: number) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(
      response => {
        const order = this.orders.find(order => order.wineOrderId === orderId);
        if (order) {
          order.orderStatusId = newStatus;
          this.toastr.success('Status updated', 'Success');
          this.filterOrders();
        }
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }

  togglePastOrders() {
    this.showPastOrders = !this.showPastOrders;
    this.filterOrders();
  }

  filterOrders() {
    if (this.showPastOrders) {
      this.wineOrdersDisplay = this.filteredOrders;
    } else {
      this.wineOrdersDisplay = this.filteredOrders.filter(order => order.orderStatusId !== 4);
    }
  }

  onSearchChange() {
    this.filterOrders();
  }
}
