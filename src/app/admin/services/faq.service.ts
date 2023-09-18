import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FAQ } from 'src/app/Model/faq';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/FAQs`;
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

  constructor(private http: HttpClient) { }

  getFAQs(): Observable<FAQ[]> {
    this.setHeaders();
    return this.http.get<FAQ[]>(this.apiUrl, { headers: this.headers});
  }

  getFAQ(id: number): Observable<FAQ> {
    this.setHeaders();
    return this.http.get<FAQ>(`${this.apiUrl}/${id}`, { headers: this.headers});
  }

  addFAQ(faq: FAQ): Observable<FAQ> {
    this.setHeaders();
    return this.http.post<FAQ>(this.apiUrl, faq, { headers: this.headers});
  }

  updateFAQ(id: number, faq: FAQ): Observable<any> {
    this.setHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, faq, { headers: this.headers});
  }

  deleteFAQ(id: number): Observable<any> {
    this.setHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers});
  }
}
