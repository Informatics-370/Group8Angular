import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  private baseUrl = `${environment.baseApiUrl}api/Refunds`;

  constructor(private http: HttpClient) { }

    //When user requests a refund
    requestRefund(wineId: number, email: string, cost: number, description: string): Observable<any> {
      console.log('Request Refund Params:', wineId, email, cost, description);
      return this.http.post(`${this.baseUrl}/RequestRefund`, { wineId, email, cost, description });
    }
  
    getRefundRequests(): Observable<RefundRequest[]> {
      return this.http.get<RefundRequest[]>(`${this.baseUrl}`);
    }
}
