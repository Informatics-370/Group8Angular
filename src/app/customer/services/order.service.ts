import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Model/order';
import { environment } from 'src/app/environment';
import { RefundRequest } from 'src/app/Model/RefundRequest';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  headers: HttpHeaders | undefined;
  private baseUrl = `${environment.baseApiUrl}api/OrderHistory`;

  constructor(private http: HttpClient) {}
  private setHeaders() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Retrieve the token from localStorage
    let token = localStorage.getItem('Token');
    if (token) {
      token = JSON.parse(token);
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
  }

  createOrder(email: string): Observable<Order> {
    this.setHeaders();
    return this.http.post<Order>(`${this.baseUrl}/${email}`, null, {
      headers: this.headers,
    });
  }

  getOrdersForUser(email: string): Observable<Order[]> {
    this.setHeaders();
    return this.http.get<Order[]>(`${this.baseUrl}/${email}`, {
      headers: this.headers,
    });
  }

  getOrder(id: number): Observable<Order> {
    this.setHeaders();
    return this.http.get<Order>(`${this.baseUrl}/Order/${id}`, {
      headers: this.headers,
    });
  }

  getAllOrders(): Observable<Order[]> {
    this.setHeaders();
    return this.http.get<Order[]>(`${this.baseUrl}/AllOrders`, {
      headers: this.headers,
    });
  }

  updateOrderStatus(orderId: number, newStatus: number): Observable<any> {
    this.setHeaders();
    // Assuming newStatus is required in the URL as well
    return this.http.put(`${this.baseUrl}/UpdateOrder/${orderId}?newStatus=${newStatus}`, {},  { headers: this.headers });
  }
}
