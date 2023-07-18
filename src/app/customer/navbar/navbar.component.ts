import { Component } from '@angular/core';
import { Login } from 'src/app/Model/login';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TwoFactorAuth } from 'src/app/Model/twofactorauth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  email = '';
  password = '';
  passwordTouched = false;
  show2FACodeInput = false;
  twoFactorCode = '';
  showLoginModal = false;

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
        console.log("nah");
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
    var accessToken = result.value.token;

    localStorage.setItem('Token', JSON.stringify(accessToken));

    let auth = localStorage.getItem('Token');
    console.log(auth);

    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      if(parsedAuth !== null){
        this.toastr.success('Yay');
        this.showLoginModal = false;
        this.router.navigate(['/clienthome']);
      }
      }else{
      console.log('Token not found in localStorage');
    }
  }
}
