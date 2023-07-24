import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from 'src/app/Model/login';
import { TwoFactorAuth } from 'src/app/Model/twofactorauth';
import { environment } from 'src/app/environment';
import { map } from 'rxjs/operators';
import { Register } from 'src/app/Model/register';
import jwt_decode from "jwt-decode";
import { UserViewModel } from 'src/app/Model/userviewmodel';
import { loginUpdateViewModel } from 'src/app/Model/loginUpdateViewModel';
import { ForgotPasswordViewModel } from 'src/app/Model/forgotPasswordViewModel';

export interface DecodedToken {
  unique_name: string; // this will contain the username
  sub: string; // this will contain the email
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
}

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private headers: HttpHeaders;
  // Decode JWT Token
  private userSubject: BehaviorSubject<UserViewModel | null>;
  public user: Observable<UserViewModel | null>;

  private userUrl = `${environment.baseApiUrl}api/User`;
  private custUrl = `${environment.baseApiUrl}api/Customers`;

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Retrieve the token from localStorage
    const token = localStorage.getItem('Token');

    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
      console.log(this.headers);
    }
    this.userSubject = new BehaviorSubject<UserViewModel | null>(this.getUserFromToken());
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): UserViewModel | null {
    return this.userSubject.value;
  }

  Login(loginCredentials: Login): Observable<any> {
    console.log("You have reached this point");
    return this.httpClient.post<any>(`${this.userUrl}/Login`, loginCredentials);
  }

  VerifyCode(TFACredentials: TwoFactorAuth): Observable<any> {
    console.log("Code");
    return this.httpClient.post<any>(`${this.userUrl}/VerifyCode`, TFACredentials);
  }

  GetUserIdByEmail(email: string): Observable<string> {
    return this.httpClient.get<string>(`${this.userUrl}/GetUserByEmail/${email}`)
      .pipe(
        map((response: any) => response.userId) // Extract the userId from the response
      );
  }

  Register(registerCredentials: Register): Observable<any> {
    return this.httpClient.post<any>(`${this.userUrl}/Register`, registerCredentials, { responseType: 'text' as 'json' });
  }

  getUserFromToken(): UserViewModel | null {
    const token = localStorage.getItem('Token');
    if (!token) {
      return null;
    }
    const decodedToken: DecodedToken = jwt_decode(token);
    const roles: string[] = Array.isArray(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : [decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]]; // Handle single role
    return {
      username: decodedToken.unique_name,
      email: decodedToken.sub,
      token: token,
      roles: roles
    };
  }


  login(user: UserViewModel) {
    this.userSubject.next(user);
  }

  LogOut(): Observable<any> {
    console.log(this.headers);
    return this.httpClient.post(`${this.userUrl}/Logout`, null, { headers: this.headers });
  }

  getUser(email: string){
    return this.httpClient.get(`${this.custUrl}/GetUser/${email}`, { headers: this.headers });
  }

  updateLoginDetails(id: string, loginCredentials: loginUpdateViewModel){
    return this.httpClient.put<any>(`${this.userUrl}/UpdateLoginDetails/${id}`, loginCredentials, { headers: this.headers });
  }


  forgotPassword(forgotPasswordViewModel: ForgotPasswordViewModel){
    return this.httpClient.post(`${this.userUrl}/ForgotPassword`, forgotPasswordViewModel);
  }



  isAdmin(): boolean {
    const roles = this.userValue?.roles;
    if (!roles) {
      return false;
    }
    if (roles.includes("Admin")) {
      return true;
    }
    return roles.some(role => ['Superuser', 'Employee'].includes(role));
  }

  isEmployee(): boolean {
    const roles = this.userValue?.roles;
    if (!roles) {
      return false;
    }
    if (roles.includes("Employee")) {
      return true;
    }
    return false;
  }

  isCustomer(): boolean {
    const roles = this.userValue?.roles;
    if (!roles) {
      return false;
    }
    if (roles.includes("Customer")) {
      return true;
    }
    return false;
  }

  isSuperuser(): boolean {
    const roles = this.userValue?.roles;
    if (!roles) {
      return false;
    }
    if (roles.includes("Superuser")) {
      return true;
    }
    return false;
  }

  isUserLoggedIn(): boolean {
    const token = localStorage.getItem('Token');
    return token !== null;
  }
}
