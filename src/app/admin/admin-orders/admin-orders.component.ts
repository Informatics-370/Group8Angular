import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/customer/services/order.service';
import { Order } from 'src/app/Model/order';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  wineOrdersDisplay: Order[] = [];
  public showPastOrders: boolean = false;

  constructor(private orderService: OrderService, private toastr: ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) { }

  ngOnInit() {
    this.fetchAllOrders();
    this.filterOrders();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
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
    this.toastr.info("Please be patient, attempting to update order status", "Order status");
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

  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;

  loadUserData() {
    const userEmail = this.userDetails?.email;

    if (userEmail != null) {
      this.customerService.GetCustomer(userEmail).subscribe(
        (result: any) => {
          console.log(result);
          // Access the user object within the result
          this.user = result.user; // Assign the user data to the variable
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load user data.');
        }
      );
    }
  }

  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
  }
  
}
