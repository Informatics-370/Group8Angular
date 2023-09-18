import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EarlyBird } from 'src/app/Model/earlybird';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarlyBirdService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/EarlyBirds`;

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

  async getEarlyBirds(): Promise<EarlyBird[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EarlyBird[]>(this.apiUrl, { headers: this.headers}));
  }

  async getEarlyBird(id: number): Promise<EarlyBird> {
    this.setHeaders()
    return firstValueFrom(this.http.get<EarlyBird>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addEarlyBird(earlyBird: EarlyBird): Promise<EarlyBird> {
    this.setHeaders()
    return firstValueFrom(this.http.post<EarlyBird>(this.apiUrl, earlyBird, { headers: this.headers}));
  }

  async updateEarlyBird(id: number, earlyBird: EarlyBird): Promise<any> {
    this.setHeaders()
    console.log('Updating EarlyBird with ID:', id, 'and data:', earlyBird);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, earlyBird, { headers: this.headers}));
  }

  async deleteEarlyBird(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }
}
