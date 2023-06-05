import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { EventType } from 'src/app/Model/eventtype';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

  private apiUrl = `${environment.baseApiUrl}api/EventType`;

  constructor(private http: HttpClient) { }

  async getEventTypes(): Promise<EventType[]> {
    return firstValueFrom(this.http.get<EventType[]>(this.apiUrl));
  }

  async getEventType(id: number): Promise<EventType> {
    return firstValueFrom(this.http.get<EventType>(`${this.apiUrl}/${id}`));
  }

  async addEventType(eventType: EventType): Promise<EventType> {
    return firstValueFrom(this.http.post<EventType>(this.apiUrl, eventType));
  }

  async updateEventType(id: number, eventType: EventType): Promise<any> {
    console.log('Updating eventType with ID:', id, 'and data:', eventType);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, eventType));
  }

  async deleteEventType(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
