import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Discount } from 'src/app/Model/discount';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiUrl = `${environment.baseApiUrl}api/Discounts`;

  constructor(private http: HttpClient) { }

  async getDiscounts(): Promise<Discount[]> {
    return firstValueFrom(this.http.get<Discount[]>(this.apiUrl));
  }

  async getDiscount(id: number): Promise<Discount> {
    return firstValueFrom(this.http.get<Discount>(`${this.apiUrl}/${id}`));
  }

  async addDiscount(discount: Discount): Promise<Discount> {
    return firstValueFrom(this.http.post<Discount>(this.apiUrl, discount));
  }

  async updateDiscount(id: number, discount: Discount): Promise<any> {
    console.log('Updating discount with ID:', id, 'and data:', discount);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, discount));
  }
  

  async deleteDiscount(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

  async validateDiscountCode(code: string): Promise<Discount> {
    return firstValueFrom(this.http.post<Discount>(`${this.apiUrl}/Validate`, { Code: code }));
  }
}
