import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefundItem, RefundRequest } from 'src/app/Model/RefundRequest';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  private baseUrl = `${environment.baseApiUrl}api/Refunds`;

  constructor(private http: HttpClient) { }

  requestRefund(wineOrderId: number, reason: string, refundItems: RefundItem[]): Observable<RefundRequest> {
    const requestData = {
      wineOrderId: wineOrderId,
      reason: reason,
      refundItems: refundItems
    };
    console.log('RequestData:', requestData);

    return this.http.post<RefundRequest>(`${this.baseUrl}/RequestARefund`, requestData);
  }
    
  getAllRefunds(): Observable<RefundRequest[]> {
    return this.http.get<RefundRequest[]>(`${this.baseUrl}`);
  }

  // getUserRefundRequests(email: string): Observable<RefundRequest[]> {
  //   return this.http.get<RefundRequest[]>(`${this.baseUrl}/${email}`);
  // }

  getRefundItems(refundRequestId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetWineDetailsForRefund/${refundRequestId}`);
  }

  updateRefundStatus(refundRequestId: number, itemsStatuses: any[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateRefundStatus/${refundRequestId}`, itemsStatuses);
  }

  getAllResponses(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/allRefundsResponses`);
  }

  getResponseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getResponse/${id}`);
  }

  getCustomerRefund(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/CustomerRefunds/${email}`);
  }
}
