import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from 'src/app/Model/event';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Events`;

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

  // Event crud operations ----------------------------------------------------.>
  async getEvents(): Promise<Event[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Event[]>(this.apiUrl, { headers: this.headers}));
  }

  async getEvent(id: number): Promise<Event> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Event>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addEvent(event: FormData): Promise<Event> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Event>(this.apiUrl, event, { headers: this.headers}));
  }

  async updateEvent(id: number, event: FormData): Promise<any> {
    this.setHeaders()
    console.log('Updating event with ID:', id, 'and data:', event);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, event, { headers: this.headers}));
  }

  async deleteEvent(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  purchaseTicket(eventID: number): Promise<any> {
    this.setHeaders()
    const url = `${this.apiUrl}/purchase/${eventID}`;
    return firstValueFrom(this.http.post<any>(url, {}, { headers: this.headers}));
  }

  async toggleEventDisplay(eventID: number): Promise<any> {
    this.setHeaders()
    const url = `${this.apiUrl}/display-toggle/${eventID}`;
    return firstValueFrom(this.http.put<any>(url, {}, { headers: this.headers}));
  }



}
