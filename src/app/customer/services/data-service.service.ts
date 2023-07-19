import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/app/Model/login';
import { TwoFactorAuth } from 'src/app/Model/twofactorauth';
import { environment } from 'src/app/environment';
import { map, tap } from 'rxjs/operators';
import { Register } from 'src/app/Model/register';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = `${environment.baseApiUrl}api/User`
  token = '';
  private headers: HttpHeaders;
  // httpOptions ={
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // }
  paramMap: any;
  constructor(private httpClient: HttpClient) { 
    const auth = localStorage.getItem('Token');
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      const token = parsedAuth.token;
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }else {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  Login(loginCredentials: Login): Observable<any> {
    console.log("You have reached this point");
    return this.httpClient.post<any>(`${this.apiUrl}/Login`, loginCredentials);
  }

  VerifyCode(TFACredentials : TwoFactorAuth): Observable<any>{
    console.log("Code");
    return this.httpClient.post<any>(`${this.apiUrl}/VerifyCode`, TFACredentials)
      .pipe(
        tap((response: any) => console.log('VerifyCode response:', response)) // Add this line
      );
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
  
}
