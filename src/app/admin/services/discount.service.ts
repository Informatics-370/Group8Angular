import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Discount } from 'src/app/Model/discount';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/Discounts`;

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

  async getDiscounts(): Promise<Discount[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Discount[]>(this.apiUrl, { headers: this.headers}));
  }

  async getDiscount(id: number): Promise<Discount> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Discount>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addDiscount(discount: Discount): Promise<Discount> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Discount>(this.apiUrl, discount, { headers: this.headers}));
  }

  async updateDiscount(id: number, discount: Discount): Promise<any> {
    this.setHeaders()
    console.log('Updating discount with ID:', id, 'and data:', discount);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, discount, { headers: this.headers}));
  }
  

  async deleteDiscount(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async validateDiscountCode(code: string): Promise<Discount> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Discount>(`${this.apiUrl}/Validate`, { Code: code }, { headers: this.headers}));
  }
}
