import { Component } from '@angular/core';
import { UserRolesViewModel } from 'src/app/Model/userRolesViewModel';
import { UserManagementService } from '../services/user-management.service';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from 'src/app/customer/services/data-service.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  public roles: string[] = [];
  public users: UserRolesViewModel[] = [];
  private editableUsers = new Set<UserRolesViewModel>();

  constructor(private userManagementService: UserManagementService, private toastr: ToastrService, private dataService: DataServiceService) { }

  ngOnInit(){
    this.getAllUsers();
    this.getAllRoles();
  }

  getAllUsers(){
    this.userManagementService.GetAllUsers().subscribe(
      (users: UserRolesViewModel[]) => {
        this.users = users;
        console.log(this.users);
      },
      error => {
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
          this.toastr.success('Successfully Updated', 'User Roles')
        },
        error => this.toastr.error('Error, failed to update', 'User Roles')
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
}
