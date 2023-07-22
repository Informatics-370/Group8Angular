import { Component } from '@angular/core';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { SystemprivilegeService } from '../services/systemprivilege.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-systemprivileges',
  templateUrl: './systemprivileges.component.html',
  styleUrls: ['./systemprivileges.component.css']
})
export class SystemprivilegesComponent {
  systemPrivileges: SystemPrivilege[] = [];
  currentSystemPrivilege: SystemPrivilege = new SystemPrivilege();
  showSystemPrivilegeModal: boolean = false;
  editingSystemPrivilege: boolean = false;
  showDeleteSystemPrivilegeModal = false;
  systemPrivilegeToDeleteDetails: any;
  systemPrivilegeToDelete: any = null;

  constructor(private privilegeService: SystemprivilegeService, private toastr: ToastrService){}

  ngOnInit(): void { 
    this.getSystemPrivileges();
  }

  getSystemPrivileges(){
    this.privilegeService.GetSystemPrivileges().subscribe(
      (result: any) => {
        console.log(result);
        this.systemPrivileges = result;
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
          await this.privilegeService.UpdateSystemPrivilege(this.currentSystemPrivilege.id!, this.currentSystemPrivilege);
          const index = this.systemPrivileges.findIndex(systemPrivilege => systemPrivilege.id === this.currentSystemPrivilege.id);
          if (index !== -1) {
            // Update the original SystemPrivilege object with the changes made to the clone
            this.systemPrivileges[index] = this.currentSystemPrivilege;
            this.toastr.success("System privilege has been updated successfully", "System privilege update");
          }
        } else {
          this.privilegeService.AddSystemPrivilege(this.currentSystemPrivilege).subscribe(data => {
            this.systemPrivileges.push(data);
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
            
          });
          this.systemPrivileges = this.systemPrivileges.filter(SystemPrivilege => SystemPrivilege.id !== this.systemPrivilegeToDelete);
          this.toastr.success("The system privilege has been deleted successfully", "System privilege deleted");
          this.closeDeleteSystemPrivilegeModal();
      } catch (error) {
          console.error(error);
          this.toastr.error("Deleting system privilege failed, please try again later.", "System privilege delete failed");
      }
  }
  this.closeSystemPrivilegeModal();
}
}
