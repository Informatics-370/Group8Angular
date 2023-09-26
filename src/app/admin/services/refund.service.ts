import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RefundItem, RefundRequest } from 'src/app/Model/RefundRequest';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  headers: HttpHeaders | undefined;
  private baseUrl = `${environment.baseApiUrl}api/Refunds`;

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

  requestRefund(wineOrderId: number, reason: string, refundItems: RefundItem[]): Observable<RefundRequest> {
    this.setHeaders()
    const requestData = {
      wineOrderId: wineOrderId,
      reason: reason,
      refundItems: refundItems
    };
    console.log('RequestData:', requestData);

    return this.http.post<RefundRequest>(`${this.baseUrl}/RequestARefund`, requestData, { headers: this.headers});
  }
    
  getAllRefunds(): Observable<RefundRequest[]> {
    this.setHeaders()
    return this.http.get<RefundRequest[]>(`${this.baseUrl}`, { headers: this.headers});
  }

  // getUserRefundRequests(email: string): Observable<RefundRequest[]> {
  //   return this.http.get<RefundRequest[]>(`${this.baseUrl}/${email}`);
  // }

  getRefundItems(refundRequestId: number): Observable<any> {
    this.setHeaders()
    return this.http.get(`${this.baseUrl}/GetWineDetailsForRefund/${refundRequestId}`, { headers: this.headers});
  }

  updateRefundStatus(refundRequestId: number, itemsStatuses: any[], discountCode: string | null, allNotApproved: boolean): Observable<any> {
    this.setHeaders();
    const url = `${this.baseUrl}/UpdateRefundStatus/${refundRequestId}/${discountCode || 'null'}/${allNotApproved}`;
    return this.http.put(url, itemsStatuses, { headers: this.headers });
  }

  getAllResponses(): Observable<any[]>{
    this.setHeaders()
    return this.http.get<any[]>(`${this.baseUrl}/allRefundsResponses`, { headers: this.headers});
  }

  getResponseById(id: number): Observable<any> {
    this.setHeaders()
    return this.http.get<any>(`${this.baseUrl}/getResponse/${id}`, { headers: this.headers});
  }

  getCustomerRefund(email: string): Observable<any> {
    this.setHeaders()
    return this.http.get<any>(`${this.baseUrl}/CustomerRefunds/${email}`, { headers: this.headers});
  }
}
