import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Event } from 'src/app/Model/event';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = `${environment.baseApiUrl}api/Events`;

  constructor(private http: HttpClient) {}

  // Event crud operations ----------------------------------------------------.>
  async getEvents(): Promise<Event[]> {
    return firstValueFrom(this.http.get<Event[]>(this.apiUrl));
  }

  async getEvent(id: number): Promise<Event> {
    return firstValueFrom(this.http.get<Event>(`${this.apiUrl}/${id}`));
  }

  async addEvent(event: FormData): Promise<Event> {
    return firstValueFrom(this.http.post<Event>(this.apiUrl, event));
  }

  async updateEvent(id: number, event: FormData): Promise<any> {
    console.log('Updating event with ID:', id, 'and data:', event);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, event));
  }

  async deleteEvent(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
