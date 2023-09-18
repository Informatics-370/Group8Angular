import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api`;

  constructor(private http: HttpClient) { }
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

  getGenderDistribution(): Observable<any> {
    this.setHeaders()
    return this.http.get<any>(`${this.apiUrl}/User/GetGenderDistribution`, { headers: this.headers});
  }

  getAgeDistribution(): Observable<any> {
    this.setHeaders()
    return this.http.get<any>(`${this.apiUrl}/Customers/AgeDistribution`, { headers: this.headers});
  }

  getSalesReport(startDate?: string, endDate?: string): Observable<any> {
    this.setHeaders()
    let params = new HttpParams();
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }
    return this.http.get<any>(`${this.apiUrl}/OrderHistory/SalesReport`, { params: params, headers: this.headers});
  }

  getTicketSalesReport(startDate: string, endDate: string): Observable<any> {
    this.setHeaders()
    console.log(`Sending start date: ${startDate}, end date: ${endDate}`); // Debugging line
  
    let params = new HttpParams()
      .append('startDate', startDate)
      .append('endDate', endDate);
  
    return this.http.get<any>(`${this.apiUrl}/TicketPurchases/TicketSalesReport`, { params: params, headers: this.headers});
  }
  
}
