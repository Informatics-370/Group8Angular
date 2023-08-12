import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Reports`;
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
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        });
    }
  }


  getRefunds(beginDate: Date, endDate: Date){
    this.setHeaders();
    return this.httpClient.get<any>(`${this.apiUrl}/getRefundReport/${beginDate}/${endDate}`, { headers: this.headers })
  } 
}
