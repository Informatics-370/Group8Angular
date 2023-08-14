import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private apiUrl = `${environment.baseApiUrl}api`;

  constructor(private http: HttpClient) { }

  getGenderDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/GetGenderDistribution`);
  }

  getAgeDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Customers/AgeDistribution`);
  }

  getSalesReport(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }
    return this.http.get<any>(`${this.apiUrl}/OrderHistory/SalesReport`, { params: params });
  }
}
