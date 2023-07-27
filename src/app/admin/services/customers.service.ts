import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Customer } from 'src/app/Model/customer';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Customers`;

  constructor(private httpClient: HttpClient) {}

  private setHeaders() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Retrieve the token from localStorage
    let token = localStorage.getItem('Token');
    if (token) {
      token = JSON.parse(token);
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    }
  }

  GetCustomers(): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetCustomers`, { headers: this.headers });
  }

  GetCustomer(email: string): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetUser/${email}`, { headers: this.headers });
  }

  UpdateCustomer(id: string, customer: Customer): Observable<Customer> {
    this.setHeaders();
    return this.httpClient.put<Customer>(`${this.apiUrl}/${id}`, customer, { headers: this.headers });
  }

  DeleteCustomer(id: string): Observable<any> {
    this.setHeaders();
    return this.httpClient.delete(`${this.apiUrl}/DeleteCustomer/${id}`, { headers: this.headers });
  } 
}
