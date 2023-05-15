import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { FAQ } from 'src/app/Model/faq';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FAQService {

  private apiUrl = `${environment.baseApiUrl}api/FAQs`;

  constructor(private http: HttpClient) { }

  getFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(this.apiUrl);
  }

  getFAQ(id: number): Observable<FAQ> {
    return this.http.get<FAQ>(`${this.apiUrl}/${id}`);
  }

  addFAQ(faq: FAQ): Observable<FAQ> {
    return this.http.post<FAQ>(this.apiUrl, faq);
  }

  updateFAQ(id: number, faq: FAQ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, faq);
  }

  deleteFAQ(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
