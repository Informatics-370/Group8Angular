import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { EventPrice } from 'src/app/Model/eventprice';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventPriceService {

  private apiUrl = `${environment.baseApiUrl}api/EventPrice`;

  constructor(private http: HttpClient) { }

  async getEventPrices(): Promise<EventPrice[]> {
    return firstValueFrom(this.http.get<EventPrice[]>(this.apiUrl));
  }

  async getEventPrice(id: number): Promise<EventPrice> {
    return firstValueFrom(this.http.get<EventPrice>(`${this.apiUrl}/${id}`));
  }

  async addEventPrice(eventPrice: EventPrice): Promise<EventPrice> {
    return firstValueFrom(this.http.post<EventPrice>(this.apiUrl, eventPrice));
  }

  async updateEventPrice(id: number, eventPrice: EventPrice): Promise<any> {
    console.log('Updating eventPrice with ID:', id, 'and data:', eventPrice);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, eventPrice));
  }

  async deleteEventPrice(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
