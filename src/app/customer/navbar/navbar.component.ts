import { Component } from '@angular/core';
import { Login } from 'src/app/Model/login';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TwoFactorAuth } from 'src/app/Model/twofactorauth';
import { Register } from 'src/app/Model/register';

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
  twoFactorCode = '';
  showLoginModal = false;
//! This is for Login 

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

  constructor(private dataService: DataServiceService, private toastr: ToastrService, private router: Router){ }

  ngOnInit() {
    console.log('Initial value of twoFactorCode:', this.twoFactorCode); // Add this line
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
    this.twoFactorCode = '';
    this.show2FACodeInput = false;
    this.showLoginModal = false;
  }

  login() {
    this.showLoginModal = true;
    const loginCredentials = new Login();
    loginCredentials.email = this.email;
    loginCredentials.password = this.password;
    console.log(loginCredentials);
  
    this.dataService.Login(loginCredentials).subscribe((result: any) => {
      var sent = result.message;
  
      if (sent === "Two-factor authentication code has been sent to your email.") {
        this.show2FACodeInput = true;
      } else {
        console.log(result);
        this.handleSuccessfulLogin(result);
      }
    });
  }
  

  submitTwoFactorCode() {
    console.log(this.twoFactorCode);
    console.log('Submit Two-Factor Code function called');
    this.dataService.GetUserIdByEmail(this.email).subscribe(
      (response: any) => {
        console.log(response);
        const userId = response;
        const authUser = new TwoFactorAuth();
        authUser.UserId = userId;
        authUser.Code = this.twoFactorCode;
  
        console.log(authUser);
  
        this.dataService.VerifyCode(authUser).subscribe(
          (result: any) => {
            console.log("Just before handling logins");
            this.handleSuccessfulLogin(result);
          },
          (error: any) => {
            console.error(error);
            console.error(error.error);
            // Clear the code input for the user to enter again
            this.twoFactorCode = '';
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
        this.toastr.success('Yay');
  
        this.router.navigate(['/clienthome']);
        this.userName = result.userNameValue;
      }
    } else {
      console.log('Token not found in localStorage');
    }
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
          if(this.enableTwoFactorAuth == true){
            this.toastr.success('Registration successful');
            this.showRegisterModal = false;
            this.showLoginModal = true;
            this.toastr.info("Please log into the account you just created to authorize it via 2 Factor Authentication");
          }else{
          this.toastr.success('Registration successful');
          
          this.showRegisterModal = false;
          this.router.navigate(['/clienthome']);

          this.dataService.Login(autoLoginCredentials).subscribe((result: any) => {
            this.toastr.success('Login successful');
            var accessToken = result.tokenValue;
            localStorage.setItem('Token', JSON.stringify(accessToken));
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
}
