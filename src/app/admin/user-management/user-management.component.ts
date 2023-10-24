import { Component } from '@angular/core';
import { UserRolesViewModel } from 'src/app/Model/userRolesViewModel';
import { UserManagementService } from '../services/user-management.service';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  public roles: string[] = [];
  public users: UserRolesViewModel[] = [];
  private editableUsers = new Set<UserRolesViewModel>();

  constructor(private userManagementService: UserManagementService, private toastr: ToastrService, private dataService: DataServiceService
    , private customerService: CustomersService,private auditLogService: AuditlogService) { }

  searchTerm: string = '';
  filteredUsers: UserRolesViewModel[] = [];

  ngOnInit(){
    this.getAllUsers();
    this.getAllRoles();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  getAllUsers(){
    this.userManagementService.GetAllUsers().subscribe(
      (users: UserRolesViewModel[]) => {
        this.users = users;
        this.filteredUsers = [...this.users];
        console.log(this.users);
      },
      error => {
        this.toastr.error('Failed to load user data', 'User data')
        console.error('Error:', error);
      }
    );
  }

  getAllRoles(){
    this.userManagementService.GetAllRoles().subscribe(
      (roles: string[]) => {
        this.roles = roles;
        console.log(this.roles);
      },
      error => {
        this.toastr.error('Failed to load roles data', 'Roles data')
        console.error('Error:', error);
      }
    );
  }

  onRoleChange(event: any, user: UserRolesViewModel, role: string): void {
    if (event.target.checked) {
      // If checked, add the role to the user's privileges
      user.privileges.push(role);
    } else {
      // If unchecked, remove the role from the user's privileges
      const index = user.privileges.indexOf(role);
      if (index > -1) {
        user.privileges.splice(index, 1);
      }
    }
  }

  isEditable(user: UserRolesViewModel): boolean {
    return this.editableUsers.has(user);
  }

  saveChanges(user: UserRolesViewModel): void {
    this.userManagementService.UpdateUserRoles(user)
      .subscribe(
        (result : any) => {
          this.toastr.success('Successfully Updated', 'User Roles');
          this.searchTerm = '';
          this.getAllUsers();
          this.getAllRoles();
          this.AddAuditLog('User Access: Updated');
        },
        (error: any) => {
          console.log(error);
          const errorMessage = error?.error?.error;
          if (errorMessage && errorMessage === "There must be at least one Superuser in the system. Cannot remove the last Superuser.") {
            this.toastr.error('You cannot remove the last Superuser.', 'User Roles');
          } else {
            this.toastr.error('Error, failed to update', 'User Roles');
          }
          this.getAllUsers();
          this.getAllRoles();
        } 
      );
}

  toggleEditMode(user: UserRolesViewModel): void {
    if (this.editableUsers.has(user)) {
      this.editableUsers.delete(user);
      this.saveChanges(user); // Save changes here
    } else {
      this.editableUsers.add(user);
    }
  }


  searchUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users; // If no search term, show all users
      return;
    }
  
    const lowercasedTerm = this.searchTerm.toLowerCase();
  
    this.filteredUsers = this.users.filter(sup => 
      (sup.userEmail && sup.userEmail.toLowerCase().includes(lowercasedTerm)));
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
