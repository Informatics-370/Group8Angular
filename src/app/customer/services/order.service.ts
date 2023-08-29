import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Model/order';
import { environment } from 'src/app/environment';
import { RefundRequest } from 'src/app/Model/RefundRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.baseApiUrl}api/OrderHistory`;

  constructor(private http: HttpClient) { }

  createOrder(email: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${email}`, null);
  }

  getOrdersForUser(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${email}`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/Order/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/AllOrders`);
  }

  updateOrderStatus(orderId: number, newStatus: number): Observable<any> {
    // Assuming newStatus is required in the URL as well
    return this.http.put(`${this.baseUrl}/UpdateOrder/${orderId}?newStatus=${newStatus}`, {});
}



}
