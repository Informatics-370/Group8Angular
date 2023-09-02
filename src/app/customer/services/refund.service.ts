import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefundRequest, RefundStatus } from 'src/app/Model/RefundRequest';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  private baseUrl = `${environment.baseApiUrl}api/Refunds`;

  constructor(private http: HttpClient) { }

    //When user requests a refund
    requestRefund(wineId: number, email: string, cost: number, description: string, referenceNumber: string, phoneNumber: string): Observable<any> {
      console.log('Request Refund Params:', wineId, email, cost, description, referenceNumber, phoneNumber);
      return this.http.post(`${this.baseUrl}/RequestRefund`, { wineId, email, cost, description, referenceNumber, phoneNumber });
    }
  
    getRefundRequests(): Observable<RefundRequest[]> {
      return this.http.get<RefundRequest[]>(`${this.baseUrl}`);
    }

    getUserRefundRequests(email: string): Observable<RefundRequest[]> {
      return this.http.get<RefundRequest[]>(`${this.baseUrl}/${email}`);
    }

    updateStatus(id: number, status: RefundStatus, orderRefNum: string): Observable<any> {
      return this.http.put(`${this.baseUrl}/${id}/status`, { status: status as number, orderRefNum: orderRefNum });
    }
}
