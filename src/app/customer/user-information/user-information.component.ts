import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Customer } from 'src/app/Model/customer';
import { NgForm } from '@angular/forms';
import { CustomersService } from 'src/app/admin/services/customers.service';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/Model/order';
import { OrderStatusEnum } from 'src/app/Model/OrderStatusEnum';
import { SuperuserService } from 'src/app/admin/services/superuser.service';
import { PaymentService } from '../services/payment.service';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
  user: Customer | undefined; // Define a variable to hold the user data
  userDetails: any;
  showEditCustomerModal = false;
  showDeleteCustomerModal = false;
  customerToDelete: any = null;
  customerToDeleteDetails: any = null;
  confirmationText: string = 'Confirm'
  order: Order[] | undefined;

  constructor(
    private dataService: DataServiceService,
    private toastr: ToastrService,
    private router: Router,
    private customerService: CustomersService,
    private orderService: OrderService,
    private superuserService: SuperuserService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
    this.clearConfirmationInput();
  }

  clearConfirmationInput(): void {
    this.confirmationText = ''; // Clear the input field
  } 


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
          this.router.navigate(['/clienthome']); // Redirect to home or login page if an error occurs
        }
      );
    }
  }

  getFirstSixDigitsOfIDNumber(): string {
    if (this.user && this.user.iD_Number) {
      return this.user.iD_Number.substring(0, 6) + '*******';
    }
    return '';
  }

  openEditCustomerModal() {
    // Implement logic to open the edit customer modal here
    this.showEditCustomerModal = true;
  }

  closeEditCustomerModal() {
    // Implement logic to close the edit customer modal here
    this.showEditCustomerModal = false;
  }

  openDeleteCustomerModal(customer: any) {
    // Implement logic to open the delete customer modal here
    this.customerToDelete = customer.id;
    console.log("Customer ID to delete: ", this.customerToDelete)
    this.customerToDeleteDetails = customer;
    this.showDeleteCustomerModal = true;
  }

  closeDeleteCustomerModal() {
    // Implement logic to close the delete customer modal here
    this.showDeleteCustomerModal = false;
  }

  submitEditCustomerForm(form: NgForm) {
    if (form.valid && this.user) { // Add a null check for this.user
      // Update the customer data using the customerService
      this.customerService.UpdateCustomer(this.user.id!, this.user).subscribe(
        (result: Customer) => {
          this.user = result;
          this.toastr.success('Customer information updated successfully.', 'Update Customer');
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Failed to update customer information.', 'Update Customer');
        }
      );
      this.closeEditCustomerModal();
    }
  }
  

  loadOrders(userEmail: string): void {
    this.orderService.getOrdersForUser(userEmail).subscribe(
      (data: Order[]) => {
        this.order = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  async deleteCustomer() {
    if (this.user) {
      try {
    // Load orders and check for undelivered ones
    const orders = await this.orderService.getOrdersForUser(this.user.email).toPromise();
    let hasUndeliveredOrders = false;

    if (orders) {
     hasUndeliveredOrders = orders.some((order: Order) => order.orderStatusId !== OrderStatusEnum.Collected);
    }

        if (hasUndeliveredOrders) {
          this.toastr.error("Cannot delete account with pending orders", "Delete Customer");
          return;
        }

// Role checks before deletion
if (this.dataService.userValue!.roles.some(r => ['superuser', 'admin', 'employee'].includes(r.toLowerCase()))) {
  this.toastr.error("Super Users, Admins and Employees can't delete accounts from the client side. Go to the admin side for deletion.", "Delete Customer");
  return;
}

console.log(`User roles: ${this.dataService.userValue!.roles.join(", ")}`);

//Check if the user still has any tickets that havent passed the event date
// Load purchased tickets and check for events that haven't occurred
const purchasedTickets = await this.paymentService.getPurchasedTickets().toPromise();
let hasFutureEvents = false;

if (purchasedTickets) {
  hasFutureEvents = purchasedTickets.some((ticket: TicketPurchase) => new Date(ticket.eventDate) > new Date());
}

if (hasFutureEvents) {
  this.toastr.error("Cannot delete account with upcoming events", "Delete Customer");
  return;
}
        // Proceed to delete customer
        await this.customerService.DeleteCustomer(this.customerToDelete).toPromise();
  
        this.toastr.success("Success", "Deleted Customer Account");
        this.dataService.LogOut();
        this.router.navigate(['/clienthome']);
        localStorage.removeItem('Token');
        this.dataService.userValue!.email = "";
        this.dataService.userValue!.username = "";
        this.dataService.userValue!.token = "";
        this.dataService.userValue!.roles = [];
        this.dataService.getUserFromToken();
        
      } catch (error) {
        console.error(error);
        this.toastr.error('An error occurred while deleting the customer.', 'Delete Customer');
      }
    } else {
      this.toastr.error('No user data found.', 'Delete Customer');
    }
}
}
 