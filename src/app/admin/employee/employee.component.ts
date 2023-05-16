import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { SystemprivilegeService } from '../services/systemprivilege.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  systemPrivileges: SystemPrivilege[] = [];
  currentSystemPrivilege: SystemPrivilege = new SystemPrivilege();
  showSystemPrivilegeModal: boolean = false;
  editingSystemPrivilege: boolean = false;
  showDeleteSystemPrivilegeModal = false;
  systemPrivilegeToDeleteDetails: any;
  systemPrivilegeToDelete: any = null;

  constructor(private privilegeService: SystemprivilegeService){ }

//   ngOnInit(): void {
//     this.privilegeService.GetSystemPrivileges()
//       .then(systemPrivileges => {
//         this.systemPrivileges = systemPrivileges;
//       })
//       .catch(error => {
//         console.error('Error retrieving system privileges:', error);
//       });
//   }
  

//   openAddSystemPrivilegeModal() {
//     this.editingSystemPrivilege = false;
//     this.currentSystemPrivilege = new SystemPrivilege();
//     this.showSystemPrivilegeModal = true;
//   }

//   openEditSystemPrivilegeModal(id: number) {
//     console.log('Opening edit early bird modal for ID:', id);
//     this.editingSystemPrivilege = true;
//     // Find the original SystemPrivilege object
//     const originalSystemPrivilege = this.systemPrivileges.find(systemPrivilege => systemPrivilege.systemPrivilegeID === id);
//     if (originalSystemPrivilege) {
//       // Clone the original SystemPrivilege object and assign it to currentSystemPrivilege
//       this.currentSystemPrivilege = {...originalSystemPrivilege};
//     }
//     this.showSystemPrivilegeModal = true;
// }

//   closeSystemPrivilegeModal() {
//     this.showSystemPrivilegeModal = false;
//   }

//   openDeleteSystemPrivilegeModal(systemPrivilege: any): void {
//     this.systemPrivilegeToDelete = systemPrivilege.SystemPrivilegeID;
//     console.log("Early Bird : ", this.systemPrivilegeToDelete)
//     this.systemPrivilegeToDeleteDetails = systemPrivilege;
//     this.showDeleteSystemPrivilegeModal = true;
//   }

//   closeDeleteModal(): void {
//     this.showDeleteSystemPrivilegeModal = false;
//   }

//   async submitSystemPrivilegeForm(form: NgForm): Promise<void> {
//     console.log('Submitting form with editingSystemPrivilege flag:', this.editingSystemPrivilege);
//     if (form.valid) {
//       try {
//         if (this.editingSystemPrivilege) {
//           await this.privilegeService.UpdateSystemPrivilege(this.currentSystemPrivilege.systemPrivilegeID!, this.currentSystemPrivilege);
//           const index = this.systemPrivileges.findIndex(systemPrivilege => systemPrivilege.systemPrivilegeID === this.currentSystemPrivilege.systemPrivilegeID);
//           if (index !== -1) {
//             // Update the original SystemPrivilege object with the changes made to the clone
//             this.systemPrivileges[index] = this.currentSystemPrivilege;
//           }
//         } else {
//           const data = await this.privilegeService.AddSystemPrivilege(this.currentSystemPrivilege);
//           this.systemPrivileges.push(data);
//         }
//         this.closeSystemPrivilegeModal();
//         if (!this.editingSystemPrivilege) {
//           form.resetForm();
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
// }

//   async deleteSystemPrivilege(): Promise<void> {
//     if (this.systemPrivilegeToDelete !== null) {
//       try {
//         await this.privilegeService.DeleteSystemPrivilege(this.systemPrivilegeToDelete);
//         console.log(this.systemPrivilegeToDelete);
//         this.systemPrivileges = this.systemPrivileges.filter(SystemPrivilege => SystemPrivilege.systemPrivilegeID !== this.systemPrivilegeToDelete);
//       } catch (error) {
//         console.error('Error deleting SystemPrivilege:', error);
//       }
//       this.closeDeleteModal();
//     }
//   }
}
