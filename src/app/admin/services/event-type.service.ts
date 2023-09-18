import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventType } from 'src/app/Model/eventtype';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/EventType`;

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

  async getEventTypes(): Promise<EventType[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EventType[]>(this.apiUrl, { headers: this.headers}));
  }

  async getEventType(id: number): Promise<EventType> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EventType>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addEventType(eventType: EventType): Promise<EventType> {
    this.setHeaders()
    return firstValueFrom(this.http.post<EventType>(this.apiUrl, eventType, { headers: this.headers}));
  }

  async updateEventType(id: number, eventType: EventType): Promise<any> {
    this.setHeaders()
    console.log('Updating eventType with ID:', id, 'and data:', eventType);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, eventType, { headers: this.headers}));
  }

  async deleteEventType(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }
}
