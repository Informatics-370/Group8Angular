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

export interface DecodedToken {
  unique_name: string; // this will contain the username
  sub: string; // this will contain the email
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataServiceService {

  //Decode JWT Token
  private userSubject: BehaviorSubject<UserViewModel | null>;

  public user;

  private apiUrl = `${environment.baseApiUrl}api/User`
  token = '';
  private headers: HttpHeaders;
  paramMap: any;

  constructor(private httpClient: HttpClient) { 
    const token = localStorage.getItem('Token');
    if (token !== null) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  
    this.userSubject = new BehaviorSubject<UserViewModel | null>(this.getUserFromToken());
    this.user = this.userSubject.asObservable();
  }

  Login(loginCredentials: Login): Observable<any> {
    console.log("You have reached this point");
    return this.httpClient.post<any>(`${this.apiUrl}/Login`, loginCredentials);
  }

  VerifyCode(TFACredentials : TwoFactorAuth): Observable<any>{
    console.log("Code");
    return this.httpClient.post<any>(`${this.apiUrl}/VerifyCode`, TFACredentials);
  }

  GetUserIdByEmail(email: string): Observable<string> {
    return this.httpClient.get<string>(`${this.apiUrl}/GetUserByEmail/${email}`)
      .pipe(
        map((response: any) => response.userId) // Extract the userId from the response
      );
  }

  Register(registerCredentials: Register): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/Register`, registerCredentials, { responseType: 'text' as 'json' });
  }
    
  //Retrieve the JWT token information
  public get userValue(): UserViewModel | null {
    return this.userSubject.value;
}

getUserFromToken(): UserViewModel | null {
  let token = localStorage.getItem('Token');
  if (!token) {
    return null;
  }
  let decodedToken: DecodedToken = jwt_decode(token);
  return { 
    username: decodedToken.unique_name, 
    email: decodedToken.sub,
    token: token ,
    role: decodedToken.role
  };
}

login(user: UserViewModel) {
  this.userSubject.next(user);
}
}
