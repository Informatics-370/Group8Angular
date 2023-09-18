import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventPrice } from 'src/app/Model/eventprice';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventPriceService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/EventPrice`;

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

  async getEventPrices(): Promise<EventPrice[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EventPrice[]>(this.apiUrl, { headers: this.headers}));
  }

  async getEventPrice(id: number): Promise<EventPrice> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EventPrice>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addEventPrice(eventPrice: EventPrice): Promise<EventPrice> {
    this.setHeaders()
    return firstValueFrom(this.http.post<EventPrice>(this.apiUrl, eventPrice, { headers: this.headers}));
  }

  async updateEventPrice(id: number, eventPrice: EventPrice): Promise<any> {
    this.setHeaders()
    console.log('Updating eventPrice with ID:', id, 'and data:', eventPrice);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, eventPrice, { headers: this.headers}));
  }

  async deleteEventPrice(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }
}
