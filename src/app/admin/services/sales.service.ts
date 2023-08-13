import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Model/order';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = `${environment.baseApiUrl}api/OrderHistory`;

  constructor(private httpClient: HttpClient) { }

// Updated service to work with the specified date range
getSalesReport(startDate: Date, endDate: Date): Observable<Order[]> {
  console.log('Start Date in Service:', startDate); // Log the start date in the service
  console.log('End Date in Service:', endDate); // Log the end date in the service

  const startDateFormat = startDate.toISOString().split('T')[0];
  const endDateFormat = endDate.toISOString().split('T')[0];
  return this.httpClient.get<Order[]>(`${this.apiUrl}/SalesReport/${startDateFormat}/${endDateFormat}`);
}


  getAllSales(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.apiUrl}/AllSales`);
  }
}
