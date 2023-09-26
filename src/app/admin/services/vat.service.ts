import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VAT } from 'src/app/Model/vat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VatService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/VATs`;

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

  getVATs(): Observable<VAT[]> {
    this.setHeaders();
    return this.http.get<VAT[]>(this.apiUrl, { headers: this.headers });
  }

  getVAT(id: number): Observable<VAT> {
    this.setHeaders();
    return this.http.get<VAT>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  getLatestVAT(): Observable<number> {
    this.setHeaders();
    return this.http.get<number>(`${this.apiUrl}/Latest`, { headers: this.headers });
  }

  addVAT(vat: VAT): Observable<VAT> {
    this.setHeaders();
    return this.http.post<VAT>(this.apiUrl, vat, { headers: this.headers });
  }

  updateVAT(id: number, vat: VAT): Observable<any> {
    this.setHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, vat, { headers: this.headers });
  }

  deleteVAT(id: number): Observable<any> {
    this.setHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
