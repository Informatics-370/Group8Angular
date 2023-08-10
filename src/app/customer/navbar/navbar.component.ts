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
  twoFactorCode = '';
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
    this.twoFactorCode = '';
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


  submitTwoFactorCode() {
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

        let uvw: UserViewModel = {
          username: result.userNameValue, // Adjust these property names as necessary
          email: result.email, // Adjust these property names as necessary
          token: parsedAuth,
          roles: result.roles// Handle single role
        };

        this.dataService.login(uvw);  // use the DataServiceService to set user details
        this.clearFields();
        location.reload();
        this.toastr.success('Successfully', 'Logged in');
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
      this.toastr.success("An email containing your new details has been sent to your inbox, please follow the instructions to log into your account");
      console.log('Sending password reset link to: ', this.forgotPasswordEmail);
      var frgPs = new ForgotPasswordViewModel();
      frgPs.email = this.forgotPasswordEmail;
      this.dataService.forgotPassword(frgPs).subscribe((result: any) => {
        this.showForgotPasswordModal = false;
        this.showLoginModal = true;
        this.handleSuccessfulLogin(result);
      },
      (error: any) => {
        console.error(error);
        console.error(error.error);
      }
    );
      this.closeForgotPasswordModal();
    } else {
      console.log('Please enter a valid email address.');
    }
  }


///////////////////////////////////////////////////////////Test
    // Method to send the password reset link
  // sendPasswordResetLink() {
  //   if (this.forgotPasswordEmail) {

  //     var frgPs = new ForgotPasswordViewModel();
  //     frgPs.email = this.forgotPasswordEmail;
  //     try{
  //     this.dataService.forgotPassword(frgPs).subscribe((result: any) => {
  //       console.log(result)
  //       this.showForgotPasswordModal = false;
  //       this.showLoginModal = true;
  //       this.handleSuccessfulLogin(result);
  //       this.toastr.success("An email containing your new details has been sent to your inbox, please follow the instructions to log into your account");
  //     console.log('Sending password reset link to: ', this.forgotPasswordEmail);
  //     });
  //   }catch(erro: any){
  //     console.log(erro)
  //     console.error('Error sending password reset link:');
  //              this.toastr.error('An error occurred while sending the password reset link.');
  //              this.showForgotPasswordModal = true;
  //   }
  //     this.closeForgotPasswordModal();
  //   } else {
  //     console.log('Please enter a valid email address.');
  //   }
  // }


/////////////////////////////////////////////////////////////////////Luan
  // sendPasswordResetLink() {
  //   if (this.forgotPasswordEmail) {


  //     var frgPs = new ForgotPasswordViewModel();
  //     frgPs.email = this.forgotPasswordEmail;
  //     this.dataService.forgotPassword(frgPs).pipe(
  //       catchError((error: any) => {
  //         console.error('Error sending password reset link:', error);
  //         this.toastr.error('An error occurred while sending the password reset link.');
  //         this.showForgotPasswordModal = true;
  //         return of(null);
  //       })
  //     ).subscribe((result: any) => {
  //       if (result) {
  //         this.toastr.success("An email containing your new details has been sent to your inbox, please follow the instructions to log into your account");
  //     console.log('Sending password reset link to: ', this.forgotPasswordEmail);
  //         this.showForgotPasswordModal = false;
  //         this.showLoginModal = true;
  //         this.handleSuccessfulLogin(result);
  //       }
  //     });

  //     this.closeForgotPasswordModal();
  //   } else {
  //     console.log('Please enter a valid email address.');
  //   }
  // }


  clearForgotPasswordFields() {
    this.forgotPasswordEmail = ''; // Clear the email field
  }

  scrollToContact() {
    this.scrollService.changeTarget('contact');
  }
}
