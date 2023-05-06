import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { VAT } from 'src/app/Model/vat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VatService {

  private apiUrl = `${environment.baseApiUrl}api/VATs`;

  constructor(private http: HttpClient) { }

  getVATs(): Observable<VAT[]> {
    return this.http.get<VAT[]>(this.apiUrl);
  }

  getVAT(id: number): Observable<VAT> {
    return this.http.get<VAT>(`${this.apiUrl}/${id}`);
  }

  addVAT(vat: VAT): Observable<VAT> {
    return this.http.post<VAT>(this.apiUrl, vat);
  }

  updateVAT(id: number, vat: VAT): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vat);
  }

  deleteVAT(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
