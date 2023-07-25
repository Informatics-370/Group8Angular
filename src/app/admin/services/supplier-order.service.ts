import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Update with your model path
import { environment } from 'src/app/environment';// Update with your environment file path

import { SupplierOrder } from 'src/app/Model/supplierOrder';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {
  private apiURL = `${environment.baseApiUrl}api/SupplierOrders`;

  constructor(private http: HttpClient) { }

  getSupplierOrders(): Observable<SupplierOrder[]> {
    return this.http.get<SupplierOrder[]>(this.apiURL);
  }

  getSupplierOrder(id: number): Observable<SupplierOrder> {
    return this.http.get<SupplierOrder>(`${this.apiURL}/${id}`);
  }

  updateSupplierOrder(id: number, supplierOrder: SupplierOrder): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/${id}`, supplierOrder);
  }

  createSupplierOrder(supplierOrder: SupplierOrder): Observable<SupplierOrder> {
    return this.http.post<SupplierOrder>(this.apiURL, supplierOrder);
  }

  deleteSupplierOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
