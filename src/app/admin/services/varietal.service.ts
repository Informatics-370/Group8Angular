import { Injectable } from '@angular/core';
import { Varietal } from 'src/app/Model/varietal';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VarietalService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Varietals`;

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

  // varietal crud operations---------------------------------------------------.>
  async getVarietals(): Promise<Varietal[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Varietal[]>(this.apiUrl, { headers: this.headers}));
  }

  async getVarietal(id: number): Promise<Varietal> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Varietal>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addVarietal(varietal: Varietal): Promise<Varietal> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Varietal>(this.apiUrl, varietal, { headers: this.headers}));
  }

  async updateVarietal(id: number, varietal: Varietal): Promise<any> {
    this.setHeaders()
    console.log('Updating varietal with ID:', id, 'and data:', varietal);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, varietal, { headers: this.headers}));
  }

  async deleteVarietal(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }
}
