import { Component } from '@angular/core';
import { Login } from 'src/app/Model/login';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TwoFactorAuth } from 'src/app/Model/twofactorauth';
import { Register } from 'src/app/Model/register';
import { UserViewModel } from 'src/app/Model/userviewmodel';
import { ForgotPasswordViewModel } from 'src/app/Model/forgotPasswordViewModel';
import { ScrollServiceService } from '../services/scroll-service.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userName = '';

  //! This is for Login
  email = '';
  password = '';
  passwordTouched = false;
  show2FACodeInput = false;
  twoFactorCode: string[] = ['', '', '', '', '', ''];
  is2FACorrect: boolean = false;
  showLoginModal = false;
//! This is for Login


//View password entered
showPassword: boolean = false;


//? This is for Register
  showRegisterModal = false;
  title: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  idNumber: string = '';
  gender: string = '';
  displayName: string = '';
  remail: string = '';
  rpassword: string = '';
  enableTwoFactorAuth: boolean = true;
//? this is for Register

//TODO This is for ForgotPassword
  showForgotPasswordModal: boolean = false;
  forgotPasswordEmail: string = '';
//TODO This is for ForgotPassword

titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
genders = ['Male', 'Female', 'Other'];
confirmPassword: string | undefined;

passwordsMatch(): boolean {
  return this.confirmPassword === this.rpassword;
}

DateValid(): boolean{
  let idMonth = parseInt(this.idNumber.toString().substring(2,4));
let idDay = parseInt(this.idNumber.toString().substring(4,6));

if(idDay >31 || idMonth >12){
  return false
}
return true;
}

isOlderThan18(): boolean{
let idYear = parseInt(this.idNumber.toString().substring(0,2));
let idMonth = parseInt(this.idNumber.toString().substring(2,4));
let idDay = parseInt(this.idNumber.toString().substring(4,6));
let currentDate = new Date();
let year = parseInt(currentDate.getFullYear().toString().slice(-2));
let month = parseInt((currentDate.getMonth() + 1).toString().padStart(2, '0'));
let day = parseInt(currentDate.getDate().toString().padStart(2, '0'));

//    x   > 23
if (idYear > year) {
  idYear = +1900;
  year = +2000;
  if (year - idYear > 18) {
    return true;
  }
}


//  x     <  23
if(idYear < year){
  //   23 - x     >18
  if((year-idYear) >18){
    return true
    //          23 - x     =18
    }else if((year-idYear) ==18){
      //     8 - x      >0
      if((month-idMonth) >0){
        return true;        
      }else
      //  8 - x     ==0
      if((month-idMonth) ==0){
        // 17 - x     >=0
        if((day-idDay) >=0){
          return true
        }  
      }  
    }
}
return false;
} 

  constructor(public dataService: DataServiceService, private toastr: ToastrService, private router: Router, private scrollService: ScrollServiceService){ }

  ngOnInit() {
    this.dataService.getUserFromToken();
    console.log(this.dataService.getUserFromToken());
    console.log(this.isAdmin());
  }

  isPasswordInvalid(): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,100}$/;
    return !passwordRegex.test(this.password);
  }

  validatePassword(): void {
    this.passwordTouched = true;
  }

  clearPasswordError(): void {
    this.passwordTouched = false;
  }

  clearFields(): void {
    this.email = '';
    this.password = '';
    this.passwordTouched = false;
    this.twoFactorCode = ['', '', '', '', '', ''];
    this.show2FACodeInput = false;
    this.showLoginModal = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.showLoginModal = true;
    const loginCredentials = new Login();
    loginCredentials.email = this.email;
    loginCredentials.password = this.password;
    console.log(loginCredentials);

    this.dataService.Login(loginCredentials).subscribe(
      (result: any) => {
        var sent = result.message;

        if (sent === "Two-factor authentication code has been sent to your email.") {
          this.show2FACodeInput = true;
          this.toastr.success('Successfully Sent','Two-Factor Authentication Email')
        } else {
          console.log(result);
          this.handleSuccessfulLogin(result);
          
        }
      },
      (error) => {
        if (error.status === 400) {
          // Login was not successful, show error toastr
          this.toastr.error('Invalid username or email address');
        } else {
          // Another error occurred, you can add handling for that here
          this.toastr.error('Invalid username or address');
        }
      }
    );
  }

  focusNext(event: any, nextInput?: any) {
    if (event.target.value.length === 1 && nextInput) {
        nextInput.focus();
    }
}


submitTwoFactorCode() {
  const finalCode = this.twoFactorCode.join('');

  this.dataService.GetUserIdByEmail(this.email).subscribe(
    (response: any) => {
      console.log(response);
      const userId = response;
      const authUser = new TwoFactorAuth();
      authUser.UserId = userId;
      authUser.Code = finalCode;

      console.log(authUser);

      this.dataService.VerifyCode(authUser).subscribe(
        (result: any) => {
          this.is2FACorrect = true;
          console.log("Just before handling logins");
          this.handleSuccessfulLogin(result);
        },
        (error: any) => {
          console.error(error);
          console.error(error.error);
          this.toastr.error("The code you provided is invalid, please check the email again and ensure you typed it in correctly");
          this.is2FACorrect = false;
          // Clear the code input for the user to enter again
          this.twoFactorCode = ['', '', '', '', '', ''];
          
          // You might need to add this line to set the focus back to the first input box.
          setTimeout(() => {
            const firstInput = document.querySelector<HTMLInputElement>(".two-factor-input");
            if (firstInput) {
              firstInput.focus();
            }
          }, 0);
        }
      );
    },
    (error: any) => {
      console.error(error);
      console.error(error.error);
    }
  );
}


  handleSuccessfulLogin(result: any) {
    var accessToken = result.tokenValue;
    
    localStorage.setItem('Token', JSON.stringify(accessToken));

    let auth = localStorage.getItem('Token');
    console.log(auth);

    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      if (parsedAuth !== null) {

        let uvw: UserViewModel = {
          username: result.userNameValue, // Adjust these property names as necessary
          email: result.email, // Adjust these property names as necessary
          token: parsedAuth,
          roles: result.roles// Handle single role
        };
        this.is2FACorrect = true;
        this.dataService.login(uvw);  // use the DataServiceService to set user details
        this.clearFields();
        this.toastr.success('Successfully', 'Logged in');

        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } else {
      console.log('Token not found in localStorage');
    }
  }

  isAdmin(): boolean {
    const roles = this.dataService.userValue?.roles;
    if (!roles || !Array.isArray(roles)) {
      return false;
    }
    return roles.some(role => ['Admin', 'Superuser', 'Employee'].includes(role));
  }

  //! Register
  openRegisterModal(){
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  clearRegisterFields() {
    this.title = '';
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.idNumber = '';
    this.gender = '';
    this.displayName = '';
    this.remail = '';
    this.rpassword = '';
    this.enableTwoFactorAuth = true;
  }

  register() {
    this.showRegisterModal = true;
    const registerCredentials = new Register();

    registerCredentials.Title = this.title;
    registerCredentials.FirstName = this.firstName;
    registerCredentials.LastName = this.lastName;
    registerCredentials.PhoneNumber = this.phoneNumber;
    registerCredentials.IDNumber = this.idNumber;
    registerCredentials.Gender = this.gender;
    registerCredentials.DisplayName = this.displayName;
    registerCredentials.Email = this.remail;
    registerCredentials.Password = this.rpassword;
    registerCredentials.EnableTwoFactorAuth = this.enableTwoFactorAuth;

    const autoLoginCredentials = new Login();
    autoLoginCredentials.email = this.remail;
    autoLoginCredentials.password = this.rpassword;


    this.dataService.Register(registerCredentials).subscribe(
      (result: string) => {
        console.log(result);

        if (result === "Your account has been created!") {
          if(registerCredentials.EnableTwoFactorAuth == true){
            this.toastr.success('Registration successful');
            this.showRegisterModal = false;
            this.showLoginModal = true;
            this.toastr.info("Please log into the account you just created to authorize it via 2 Factor Authentication");
          }else{
          this.toastr.success('Registration successful');

          this.showRegisterModal = false;

          this.dataService.Login(autoLoginCredentials).subscribe((result: any) => {
            this.toastr.success('Login successful');
            var accessToken = result.tokenValue;
            localStorage.setItem('Token', JSON.stringify(accessToken));
            this.dataService.getUserFromToken();
            this.router.navigate(['/clienthome']);
            location.reload();
          });
          }
        } else {
          this.toastr.error('Registration failed');
        }
      },
      (error: any) => {
        console.error(error.message);
        this.toastr.error('Registration failed');
      }
    );
  }


  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
    this.showLoginModal = false;
  }

  // Method to close the forgotPasswordModal
  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }

//////////////////////////////////////////////////////////////////Default Default Default Default Default Default Default Default Default
  //Method to send the password reset link
sendPasswordResetLink() {
  if (this.forgotPasswordEmail) {
    var frgPs = new ForgotPasswordViewModel();
    frgPs.email = this.forgotPasswordEmail;
    this.dataService.forgotPassword(frgPs).subscribe(
      (result: any) => {
        console.log('Sending password reset link to: ', this.forgotPasswordEmail);
        this.showForgotPasswordModal = false;
        this.showLoginModal = true;
        this.handleSuccessfulLogin(result);
        console.log('Success');
      },
      (error: any) => {
        console.error(error);
        if (error.status === 404) {
          this.toastr.error("The email you provided does not exist within our system. \nPlease try again");
          this.showForgotPasswordModal = true;
        } else if (error.status === 400) {
          this.toastr.error("The system failed to send the email. \nPlease try again");
          this.showForgotPasswordModal = true;
        } else if(error.status === 500){
          console.error("Ohhh no... our server.... it's broken!");
        }
      }
    );
    this.closeForgotPasswordModal();
  } else {
    console.log('Please enter a valid email address.');
  }
}

  clearForgotPasswordFields() {
    this.forgotPasswordEmail = ''; // Clear the email field
  }

  scrollToContact() {
    this.scrollService.changeTarget('contact');
  }
}
