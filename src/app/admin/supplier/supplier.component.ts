import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/Model/supplier';
import { SupplierService } from '../services/supplier.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})

export class SupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  showModal: boolean = false;
  editingSupplier: boolean = false;
  currentSupplier: Supplier = new Supplier();
  searchQuery: string = '';
  filteredSuppliers: Supplier[] = [];
  pageSize: number = 5;
  currentPage: number = 1;

    supplierToDelete: any = null;
    supplierToDeleteDetails: any;
    showDeleteSupplierModal = false;
  
  constructor(private supplierService: SupplierService, private router: Router, private toastr: ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) {}

  //When the page is called these methods are automatically called
  ngOnInit(): void {
    this.loadSuppliers();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
    // this.filteredSuppliers = [...this.suppliers];
  }

// ****************** Methods to display the list of Suppliers. *****************************************************************************************************************
  
loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => this.filteredSuppliers = data,
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error, failed to connect to the database', 'Supplier Table');
      }
    });
  }

// ****************** Methods to display the list of Suppliers. *****************************************************************************************************************

  isDuplicateSupplier(supplier: Supplier): boolean {
    return this.suppliers.some(item => item.name === supplier.name && item.phoneNumber === supplier.phoneNumber && item.email === supplier.email);
  }

  // The openAddSupplierModal() function is called when the "Add Supplier" button is clicked, 
  //which opens a modal window for adding a new Supplier record.
  openAddSupplierModal() {
    this.editingSupplier = false;
    this.currentSupplier = new Supplier();
    this.showModal = true;
  }

  //The openEditSupplierModal() function is called when the user clicks the "Edit" button in the table. 
  //This function opens the modal window with the selected Supplier record's details and allows the user to edit the record.
  openEditSupplierModal(id: number) {
    this.editingSupplier = true;

    const originalSupplier = this.suppliers.find(x => x.supplierID === id);
    if (originalSupplier) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentSupplier = {...originalSupplier};
    }
    this.showModal = true;
  }
//The closeSupplierModal() function is called when the user clicks the "Close" button in the modal window. 
//This function simply closes the modal window.
  closeSupplierModal() {
    this.showModal = false;
  }

  //The submitSupplierForm() function is called when the user submits the form in the modal window. This function saves the 
  //new or edited Supplier record to an array of Supplier records and closes the modal window.
  submitSupplierForm(form: NgForm): void {
    if (form.valid) {
      if (this.editingSupplier) {
        // Update Supplier
        this.supplierService.updateSupplier(this.currentSupplier.supplierID!, this.currentSupplier).subscribe({
          next: () => {
            const index = this.suppliers.findIndex(supplier => supplier.supplierID === this.currentSupplier.supplierID);
            if (index !== -1) {
              this.suppliers[index] = this.currentSupplier;
            }
            this.closeSupplierModal();
            this.toastr.success('Successfully updated', 'Update');
            this.loadSuppliers(); // Refresh the supplier list
          },
          error: (error: any) => {
            console.error(error);
            this.toastr.error('Error, please try again', 'Update');
          }
        });
      } else {
        // Check for duplicate Supplier entries before adding
        if (this.isDuplicateSupplier(this.currentSupplier)) {
          alert('Supplier with the same name, phone number, or email already exists!');
        } else {
          this.supplierService.addSupplier(this.currentSupplier).subscribe({
            next: (data: Supplier) => {
              this.suppliers.push(data);
              this.closeSupplierModal();
              form.resetForm();
              this.toastr.success('Successfully added', 'Add');
              this.loadSuppliers(); // Refresh the supplier list
            },
            error: (error: any) => {
              console.error(error)
              this.toastr.error('Error, please try again', 'Add');
              this.closeSupplierModal();
            }
          });
        }
      }
    }
  }
  
  
//******************* Delete Modal-related methods *********************************************************************************************************************************

  openDeleteSupplierModal(selectedSuppllier: any): void {
    this.supplierToDelete = selectedSuppllier.supplierid;
    console.log("Supplier : ", this.supplierToDelete)
    this.supplierToDeleteDetails = selectedSuppllier;
    this.showDeleteSupplierModal = true;
  }
  
  closeDeleteSupplierModal(): void {
    this.showDeleteSupplierModal = false;
  }
  
  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(x => x.supplierID !== id)
        this.toastr.success('Successfully deleted', 'Supplier');
        this.showDeleteSupplierModal = false;
        this.loadSuppliers(); // Refresh the supplier list
      },
      error: (error: any) => {
        console.error(error)
        this.toastr.error('Deletion failed, please try again', 'Error');
        this.showDeleteSupplierModal = false;
      }
    });
  }

//******************* Delete Modal-related methods *********************************************************************************************************************************


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

onSubmitClick() {
  const auditLogMessage =
    'Supplier: ' + (this.editingSupplier ? 'Updated' : 'Added');
  this.AddAuditLog(auditLogMessage);
}

filterSuppliers() {
  if (this.searchQuery.trim() === '') {
    this.filteredSuppliers = [...this.suppliers]; // If the search query is empty, show all wines
  } else {
    const searchTerm = this.searchQuery.toLowerCase().trim();
    this.filteredSuppliers = this.suppliers.filter(supplier =>
      supplier.name?.toLowerCase().includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm) ||
      supplier.phoneNumber?.toString().includes(searchTerm)
    );
  }
}

get paginatedSuppliers(): Supplier[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.filteredSuppliers.slice(startIndex, endIndex);
}

changePage(page: number) {
  this.currentPage = page;
}

previousPage() {
  if (this.currentPage > 1) {
    this.changePage(this.currentPage - 1);
  }
}

nextPage() {
  const totalPages = Math.ceil(this.filteredSuppliers.length / this.pageSize);
  if (this.currentPage < totalPages) {
    this.changePage(this.currentPage + 1);
  }
}

get totalPages(): number {
  return Math.ceil(this.filteredSuppliers.length / this.pageSize);
}
}
