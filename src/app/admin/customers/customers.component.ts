import { Component } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { Customer } from 'src/app/Model/customer';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/Model/employee';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  customers: Customer[] = [];
  currentCustomer: Customer = new Customer();
  showDeleteCustomerModal = false;
  customerToDeleteDetails: any;
  customerToDelete: any = null;
  maxDate!: string;

  constructor(private customerService: CustomersService, private toastr : ToastrService){ }

  ngOnInit(): void { 
    this.getCustomers();
    const today = new Date();
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCustomers(){
    this.customerService.GetCustomers().subscribe(
      (result: Customer[]) => {
        this.customers = result;
        console.log(this.customers);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Unable to load customer data");
      }
    );
  }

  openDeleteCustomerModal(customer: any): void {
    this.customerToDelete = customer.id;
    console.log("Customer ID to delete: ", this.customerToDelete)
    this.customerToDeleteDetails = customer;
    this.showDeleteCustomerModal = true;
  }

  closeDeleteCustomerModal(): void {
    this.showDeleteCustomerModal = false;
  }

  async deleteCustomer(): Promise<void> {
    if (this.customerToDelete != null) {
      try {
        this.customerService.DeleteCustomer(this.customerToDelete).subscribe((result: any) => {

        });
        console.log(this.customerToDelete);
        this.customers = this.customers.filter(customer => customer.id !== this.customerToDelete);
        this.toastr.success("The customer has been deleted.", "Delete Customer");
      } catch (error) {
        console.error('Error deleting customer:', error);
        this.toastr.error("Deleting the selected customer account failed, please try again later.", "Delete Customer");
      }
      this.closeDeleteCustomerModal();
    }
  }
}
