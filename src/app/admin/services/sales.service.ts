import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Model/order';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/OrderHistory`;

  constructor(private httpClient: HttpClient) { }
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

// Updated service to work with the specified date range
getSalesReport(startDate: Date, endDate: Date): Observable<Order[]> {
  this.setHeaders()
  console.log('Start Date in Service:', startDate); // Log the start date in the service
  console.log('End Date in Service:', endDate); // Log the end date in the service

  const startDateFormat = startDate.toISOString().split('T')[0];
  const endDateFormat = endDate.toISOString().split('T')[0];
  return this.httpClient.get<Order[]>(`${this.apiUrl}/SalesReport/${startDateFormat}/${endDateFormat}`, { headers: this.headers});
}


  getAllSales(): Observable<Order[]> {
    this.setHeaders()
    return this.httpClient.get<Order[]>(`${this.apiUrl}/AllSales`, { headers: this.headers});
  }
}
