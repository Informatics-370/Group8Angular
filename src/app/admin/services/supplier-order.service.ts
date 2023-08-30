import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateSupplierOrderStatusDTO } from 'src/app/Model/UpdateSupplierOrderStatusDTO';
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

  updateSupplierOrderStatus(id: number, statusDTO: UpdateSupplierOrderStatusDTO): Observable<any> {
    const url = `${this.apiURL}/${id}/status`;
    return this.http.put(url, statusDTO);
  }

  createSupplierOrder(supplierOrder: SupplierOrder): Observable<SupplierOrder> {
    return this.http.post<SupplierOrder>(this.apiURL, supplierOrder);
  }

  deleteSupplierOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
