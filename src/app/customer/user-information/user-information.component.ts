import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Customer } from 'src/app/Model/customer';
import { NgForm } from '@angular/forms';
import { CustomersService } from 'src/app/admin/services/customers.service';

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

  constructor(
    private dataService: DataServiceService,
    private toastr: ToastrService,
    private router: Router,
    private customerService: CustomersService
  ) {}

  ngOnInit() {
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
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
  
  async deleteCustomer() {
    // Implement logic to handle the delete customer action here
    if (this.user) {
        try {
            await this.customerService.DeleteCustomer(this.customerToDelete).subscribe((result: any) => {
              console.log(result);
              this.toastr.success("Success", "Deleted Customer Account");

              this.dataService.LogOut();
              this.router.navigate(['/clienthome']);
              localStorage.removeItem('Token');
              this.dataService.userValue!.email = "";
              this.dataService.userValue!.username = "";
              this.dataService.userValue!.token = "";
              this.dataService.userValue!.roles = [];
              this.dataService.getUserFromToken();
            });

        } catch (error) {
            console.error(error);
            this.toastr.error('An error occurred while deleting the customer.', 'Delete Customer');
        }
        this.closeDeleteCustomerModal();
    }
}
}
