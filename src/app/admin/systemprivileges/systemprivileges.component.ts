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
import { MethodPrivilegeMapping } from 'src/app/Model/methodPrivilegeMapping';

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
    this.loadMethodData();
    this.getSystemPrivilegeByMethod();
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
    console.log('Opening edit modal for ID:', id);
    this.editingSystemPrivilege = true;

    // Find the original SystemPrivilege object
    const originalSystemPrivilege = this.systemPrivileges.find(systemPrivilege => systemPrivilege.id === id);
    
    if (originalSystemPrivilege) {
        // Filter methods based on the provided ID
        let assignedMethods = [];
        
        for (let method in this.methodsWithPrivileges) {
            if (this.methodsWithPrivileges[method].includes(id)) {
                // Find the correct controller for the method
                const matchingController = this.allMethodMappings.find(mapping => mapping.methodNames.includes(method));
                if (matchingController) {
                    assignedMethods.push({
                        controllerName: matchingController.controllerName, // Retrieve the controller name from allMethodMappings
                        methodNames: [method]
                    });
                }
            }
        }

        // Deep clone the original SystemPrivilege object and assign it to currentSystemPrivilege
        this.currentSystemPrivilege = {
            ...originalSystemPrivilege,
            controllerMethods: assignedMethods
        };
        console.log("CurrentSystemPrivilege:", this.currentSystemPrivilege);
    }

    this.showSystemPrivilegeModal = true;
}







//   openEditSystemPrivilegeModal(id: string) {
//     console.log('Opening edit early bird modal for ID:', id);
//     this.editingSystemPrivilege = true;
//     // Find the original SystemPrivilege object
//     const originalSystemPrivilege = this.systemPrivileges.find(systemPrivilege => systemPrivilege.id === id);
//     if (originalSystemPrivilege) {
//       // Clone the original SystemPrivilege object and assign it to currentSystemPrivilege
//       this.currentSystemPrivilege = {...originalSystemPrivilege};
//     }
//     this.showSystemPrivilegeModal = true;
// }

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

  handleMethodSelectionChange(event: any, controllerName: string, methodName: string) {
    const isChecked = event.target.checked;
    
    // Check if controller already exists in currentSystemPrivilege.controllerMethods
    let controllerMethod = this.currentSystemPrivilege.controllerMethods.find(
      cm => cm.controllerName === controllerName
    );
  
    // If controller does not exist and method is checked, create a new one
    if (!controllerMethod && isChecked) {
      controllerMethod = {
        controllerName: controllerName,
        methodNames: [methodName]
      };
      this.currentSystemPrivilege.controllerMethods.push(controllerMethod);
    } else if (controllerMethod) {
      if (isChecked && !controllerMethod.methodNames.includes(methodName)) {
        // If the method was checked and doesn't exist, add it
        controllerMethod.methodNames.push(methodName);
      } else if (!isChecked && controllerMethod.methodNames.includes(methodName)) {
        // If the method was unchecked and exists, remove it
        const index = controllerMethod.methodNames.indexOf(methodName);
        controllerMethod.methodNames.splice(index, 1);
  
        // If no methods left for this controller, remove the controllerMethod object
        if (controllerMethod.methodNames.length === 0) {
          const controllerIndex = this.currentSystemPrivilege.controllerMethods.indexOf(controllerMethod);
          this.currentSystemPrivilege.controllerMethods.splice(controllerIndex, 1);
        }
      }
    }
  }
  



async submitSystemPrivilegeForm(form: NgForm): Promise<void> {  
if (form.valid) {
      try {
          if (this.editingSystemPrivilege) {
              this.privilegeService.UpdateSystemPrivilege(this.currentSystemPrivilege.id!, this.currentSystemPrivilege).subscribe((result: any) => {
                this.getSystemPrivilegeByMethod();
                this.loadMethodData();
              });
              const index = this.systemPrivileges.findIndex(systemPrivilege => systemPrivilege.id === this.currentSystemPrivilege.id);
              if (index !== -1) {
                  // Update the original SystemPrivilege object with the changes made to the clone
                  this.systemPrivileges[index] = this.currentSystemPrivilege;

                  this.getSystemPrivilegeByMethod();
                  this.loadMethodData();
                  this.toastr.success("System privilege has been updated successfully", "System privilege update");
                  this.closeSystemPrivilegeModal();
              }
          } else {
              this.privilegeService.AddSystemPrivilege(this.currentSystemPrivilege).subscribe(data => {
                  this.filteredSystemPrivileges.push(data);

                  this.closeSystemPrivilegeModal();
                  this.getSystemPrivilegeByMethod();
                  this.loadMethodData();

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


//////////// METHOD MAPPING

allMethodMappings: MethodPrivilegeMapping[] = [];
selectedMethods: { [key: string]: boolean } = {};
// This would contain a mapping from method names to their associated systemPrivilegeIds
methodsWithPrivileges: { [methodName: string]: string[] } = {};
currentMethod: any;
userRoles: string[] = [];

loadMethodData() {
  this.privilegeService.GetDistinctMethodPrivileges().subscribe((result: any) => {
    this.allMethodMappings = result;
    console.log("MethodNames:", this.allMethodMappings); 
  });
}

getSystemPrivilegeByMethod() {
  this.privilegeService.GetMethodPrivilegeIDs().subscribe((result: any) => {
    console.log(result);
    result.forEach((item:any) => {
      //console.log("Item:", item);
      if(!this.methodsWithPrivileges[item.methodName]) {
          this.methodsWithPrivileges[item.methodName] = [];
      }
      this.methodsWithPrivileges[item.methodName].push(item.privilegeID);
    });
  })
}



isMethodAssignedToSystemPrivilege(controllerName: string, methodName: string): boolean {
  // Filter all controller objects in currentSystemPrivilege with the given controllerName
  const matchingControllers = this.currentSystemPrivilege.controllerMethods.filter(m => m.controllerName === controllerName);

  // If any of the matching controllers have the method name in its methodNames array, return true
  for (const controller of matchingControllers) {
    if (controller.methodNames.includes(methodName)) {
      return true;
    }
  }

  return false;
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
