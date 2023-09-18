import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Supplier } from 'src/app/Model/supplier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Suppliers`;

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

  getSuppliers(): Observable<Supplier[]> {
    this.setHeaders()
    return this.http.get<Supplier[]>(this.apiUrl, { headers: this.headers});
  }

  getSupplier(id: number): Observable<Supplier> {
    this.setHeaders()
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`, { headers: this.headers});
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    this.setHeaders()
    return this.http.post<Supplier>(this.apiUrl, supplier, { headers: this.headers});
  }

  updateSupplier(id: number, supplier: Supplier): Observable<any> {
    this.setHeaders()
    return this.http.put(`${this.apiUrl}/${id}`, supplier, { headers: this.headers});
  }

  deleteSupplier(id: number): Observable<any> {
    this.setHeaders()
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers});
  }
}
