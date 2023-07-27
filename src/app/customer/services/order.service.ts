import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/Model/order';
import { environment } from 'src/app/environment';

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

  // Add a function for the put request here
  updateOrderStatus(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateOrder/${orderId}`, null);
  }
}
