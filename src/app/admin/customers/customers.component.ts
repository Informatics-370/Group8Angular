import { Component } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { Customer } from 'src/app/Model/customer';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/Model/employee';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';

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
  searchTerm: string = '';
  filteredCustomers: Customer[] = [];

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private customerService: CustomersService, private toastr : ToastrService
    , private auditLogService: AuditlogService, private dataService: DataServiceService){ }

  ngOnInit(): void { 
    this.getCustomers();
    const today = new Date();
    this.maxDate = this.formatDate(today);
    this.userDetails = this.dataService.getUserFromToken();
      this.loadUserData();
      this.filterCustomers(); // call this once to initialize

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

  filterCustomers() {
    this.filteredCustomers = this.customers.filter(customer => {
      return Object.values(customer).some(value => 
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.pageSize);
    this.currentPage = 1; // reset to first page
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
