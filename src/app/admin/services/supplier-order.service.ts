import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateSupplierOrderStatusDTO } from 'src/app/Model/UpdateSupplierOrderStatusDTO';
// Update with your model path
import { environment } from 'src/app/environment';// Update with your environment file path

import { SupplierOrder } from 'src/app/Model/supplierOrder';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  headers: HttpHeaders | undefined;
  private apiURL = `${environment.baseApiUrl}api/SupplierOrders`;

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

  getSupplierOrders(): Observable<SupplierOrder[]> {
    this.setHeaders()
    return this.http.get<SupplierOrder[]>(this.apiURL, { headers: this.headers});
  }

  getSupplierOrder(id: number): Observable<SupplierOrder> {
    this.setHeaders()
    return this.http.get<SupplierOrder>(`${this.apiURL}/${id}`, { headers: this.headers});
  }

  updateSupplierOrderStatus(id: number, statusDTO: UpdateSupplierOrderStatusDTO): Observable<any> {
    this.setHeaders()
    const url = `${this.apiURL}/${id}/status`;
    return this.http.put(url, statusDTO, { headers: this.headers});
  }

  createSupplierOrder(supplierOrder: SupplierOrder): Observable<SupplierOrder> {
    this.setHeaders()
    return this.http.post<SupplierOrder>(this.apiURL, supplierOrder, { headers: this.headers});
  }

  deleteSupplierOrder(id: number): Observable<void> {
    this.setHeaders()
    return this.http.delete<void>(`${this.apiURL}/${id}`, { headers: this.headers});
  }
}
