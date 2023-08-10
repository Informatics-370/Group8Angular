import { Component } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loginUpdateViewModel } from 'src/app/Model/loginUpdateViewModel';
import { CustomerSidenavComponent } from '../customer-sidenav/customer-sidenav.component';

@Component({
  selector: 'app-username-and-password',
  templateUrl: './username-and-password.component.html',
  styleUrls: ['./username-and-password.component.css']
})
export class UsernameAndPasswordComponent {
  userEmail: string = '';
  updatedUser = new loginUpdateViewModel();
  userID: string = '';
  confirmPassword: string | undefined;
  newPassword: string ='';
  showPassword: boolean = false;
  currentPassword: string = '';

  

  constructor(private dataService: DataServiceService, private router: Router, private toastr: ToastrService) {}


  passwordsMatch(): boolean {
    return this.confirmPassword === this.newPassword;
  }

  cpasswordsMatch(): boolean {
    return this.newPassword === this.currentPassword;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    var user = this.dataService.getUserFromToken();

    if (user !== null) {
      this.userEmail = user.email!;
      this.dataService.getUser(this.userEmail).subscribe((result:any) => {
        this.userID = result.user.userID;
        console.log(this.userID);
      });
    }
  }

  isUsernameValid(): boolean {
    // Check if the username is not empty and matches the pattern
    return this.updatedUser.userName !== '' && /^[a-zA-Z0-9_]+$/.test(this.updatedUser.userName);
  }

  isNewEmailValid(): boolean {
    // Check if the email is not empty and is a valid email address
    return this.updatedUser.newEmail !== '' && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.updatedUser.newEmail);
  }

  isCurrentPasswordValid(): boolean {
    // Check if the current password is not empty and has a minimum length of 6 characters
    return this.updatedUser.currentPassword !== '' && this.updatedUser.currentPassword.length >= 6;
  }

  isNewPasswordValid(): boolean {
    // Check if the new password is not empty and matches the pattern
    return this.updatedUser.newPassword !== '' && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,100}$/.test(this.updatedUser.newPassword);
  }

  arePasswordsMatching(): boolean {
    // Check if the new password and confirm password match
    return this.updatedUser.newPassword === this.updatedUser.confirmPassword;
  }

  updateLoginDetails() {
    // Check if all the validations are met before proceeding
    if (
      this.isUsernameValid() &&
      this.isNewEmailValid() &&
      this.isCurrentPasswordValid() &&
      this.isNewPasswordValid() &&
      this.arePasswordsMatching()
    ) {
      console.log('Username:', this.updatedUser.userName);
      console.log('New Email:', this.updatedUser.newEmail);
      console.log('Current Password:', this.updatedUser.currentPassword);
      console.log('New Password:', this.updatedUser.newPassword);
      console.log('Confirm Password:', this.updatedUser.confirmPassword);
  
      // Now you can use these values as needed, for example, to update login details
      console.log(this.userID);
      console.log(this.updatedUser);
      this.dataService.updateLoginDetails(this.userID, this.updatedUser).subscribe(
        (result: any) => {
          console.log(result);
          this.dataService.userValue!.email = this.updatedUser.newEmail;
          this.dataService.userValue!.username = this.updatedUser.userName;
          this.dataService.userValue!.token = this.dataService.userValue!.token;
          this.dataService.userValue!.roles = this.dataService.userValue!.roles;

          this.router.navigate(['/clienthome']);
          var cs = new CustomerSidenavComponent(this.router, this.dataService, this.toastr);
          cs.logOut();
          this.toastr.info("Because you updated your login details, we require you to log into your account once again. Thank you for understanding :)")
        },
        (error: any) => {
          console.error('Error occurred:', error.message);
        }
      );
      
      // Perform a null check before assigning to the 'userValue' property
      if (this.dataService.userValue) {
        //this.dataService.userValue.username = this.updatedUser.UserName;
      }
    } else {
      // Show an error message if any validation fails
      if (this.arePasswordsMatching() == false) {
        this.toastr.error('Please ensure that the password provided in the confirm password textbox and the password provided in the new password textbox match.')
      } else {
        this.toastr.error('Please fill in all required fields and ensure the values are valid.', 'Form Error');
      }
    }
  }  
}
