import { Component, ViewChild } from '@angular/core';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { SystemprivilegeService } from '../services/systemprivilege.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-systemprivileges',
  templateUrl: './systemprivileges.component.html',
  styleUrls: ['./systemprivileges.component.css']
})
export class SystemprivilegesComponent {

  @ViewChild('systemPrivilegeForm') systemPrivilegeForm!: NgForm;
  
  systemPrivileges: SystemPrivilege[] = [];
  currentSystemPrivilege: SystemPrivilege = new SystemPrivilege();
  showSystemPrivilegeModal: boolean = false;
  editingSystemPrivilege: boolean = false;
  showDeleteSystemPrivilegeModal = false;
  systemPrivilegeToDeleteDetails: any;
  systemPrivilegeToDelete: any = null;
  deleteConfirmationText: string = '';
  searchTerm: string = '';
  filteredSystemPrivileges: SystemPrivilege[] = [];

  constructor(private privilegeService: SystemprivilegeService, private toastr: ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService){}

  ngOnInit(): void { 
    this.getSystemPrivileges();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  getSystemPrivileges(){
    this.privilegeService.GetSystemPrivileges().subscribe(
      (result: any) => {
        console.log(result);
        this.systemPrivileges = result;
        this.filteredSystemPrivileges = result;
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Failed to retrieve system privilege info", "System Privilege");
      }
    );
  }

  openAddSystemPrivilegeModal() {
    this.editingSystemPrivilege = false;
    this.currentSystemPrivilege = new SystemPrivilege();
    this.showSystemPrivilegeModal = true;
  }

  openEditSystemPrivilegeModal(id: string) {
    console.log('Opening edit early bird modal for ID:', id);
    this.editingSystemPrivilege = true;
    // Find the original SystemPrivilege object
    const originalSystemPrivilege = this.systemPrivileges.find(systemPrivilege => systemPrivilege.id === id);
    if (originalSystemPrivilege) {
      // Clone the original SystemPrivilege object and assign it to currentSystemPrivilege
      this.currentSystemPrivilege = {...originalSystemPrivilege};
    }
    this.showSystemPrivilegeModal = true;
}

  closeSystemPrivilegeModal() {
    this.showSystemPrivilegeModal = false;
    Object.keys(this.systemPrivilegeForm.controls).forEach(key => {
      const control = this.systemPrivilegeForm.controls[key];
      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  openDeleteSystemPrivilegeModal(systemPrivilege: any): void {
    this.systemPrivilegeToDelete = systemPrivilege.id;
    console.log("System privilege : ", this.systemPrivilegeToDelete)
    this.systemPrivilegeToDeleteDetails = systemPrivilege;
    this.showDeleteSystemPrivilegeModal = true;
  }

  closeDeleteSystemPrivilegeModal(): void {
    this.showDeleteSystemPrivilegeModal = false;
  }

  async submitSystemPrivilegeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingSystemPrivilege flag:', this.editingSystemPrivilege);
    console.log(this.currentSystemPrivilege);
    if (form.valid) {
      try {
        if (this.editingSystemPrivilege) {
          this.privilegeService.UpdateSystemPrivilege(this.currentSystemPrivilege.id!, this.currentSystemPrivilege).subscribe((result: any) => {
          });
          const index = this.systemPrivileges.findIndex(systemPrivilege => systemPrivilege.id === this.currentSystemPrivilege.id);
          if (index !== -1) {
            // Update the original SystemPrivilege object with the changes made to the clone
            this.systemPrivileges[index] = this.currentSystemPrivilege;
            this.toastr.success("System privilege has been updated successfully", "System privilege update");
          }
        } else {
          this.privilegeService.AddSystemPrivilege(this.currentSystemPrivilege).subscribe(data => {
            this.filteredSystemPrivileges.push(data);
            // this.systemPrivileges.push(data);
            this.toastr.success("A new system privilege has been added to the system", "System Privilege added");
            this.closeSystemPrivilegeModal();
            form.resetForm();
          }, error => {
            console.error(error);
            this.toastr.error("Adding a new system privilege failed, please try again later.", "System privilege add failed");
          });
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Adding or updating a system privilege failed, please try again later.", "System privilege action failed");
      }
    }
    this.closeSystemPrivilegeModal();
}


async deleteSystemPrivilege(): Promise<void> {
  if (this.systemPrivilegeToDelete != null) {
      try {
          this.privilegeService.DeleteSystemPrivilege(this.systemPrivilegeToDelete).subscribe((result: any) => {
            this.systemPrivileges = this.systemPrivileges.filter(sys => sys.id !== this.systemPrivilegeToDelete);
            this.toastr.success("The system privilege has been deleted successfully", "System privilege deleted");
            this.getSystemPrivileges();
            this.closeDeleteSystemPrivilegeModal();
          }, (error) => {
            console.error('Error deleting system privilege:', error);
            console.log('Error Response Body:', error.error);
            this.toastr.error("Deleting the selected system privilege failed, please try again later.", "Delete System Privilege");
          });
      } catch (error) {
          console.error(error);
          this.toastr.error("Deleting system privilege failed, please try again later.", "System privilege delete failed");
      }
  }
  this.closeSystemPrivilegeModal();
}

clearConfirmationInput(): void {
  this.deleteConfirmationText = ''; // Clear the input field
}

searchSystemPrivileges() {
  if (!this.searchTerm) {
    this.filteredSystemPrivileges = this.systemPrivileges; // If no search term, show all superusers
    return;
  }

  const lowercasedTerm = this.searchTerm.toLowerCase();

  this.filteredSystemPrivileges = this.systemPrivileges.filter(sup => 
    (sup.description && sup.description.toLowerCase().includes(lowercasedTerm)) ||
    (sup.name && sup.name.toLowerCase().includes(lowercasedTerm)));
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

onSubmitClick() {
  const auditLogMessage =
    'System Privilege: ' + (this.editingSystemPrivilege ? 'Updated' : 'Added');
  this.AddAuditLog(auditLogMessage);
}
}
