import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom } from 'rxjs';
import { WineType } from 'src/app/Model/winetype';

@Injectable({
  providedIn: 'root'
})
export class WinetypeService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/WineTypes`;

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

  //winetype crud operations------------------------------------------------------.>
  async getWinetypes(): Promise<WineType[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<WineType[]>(this.apiUrl, { headers: this.headers}));
  }

  async getWinetype(id: number): Promise<WineType> {
    this.setHeaders()
    return firstValueFrom(this.http.get<WineType>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addWinetype(winetype: WineType): Promise<WineType> {
    this.setHeaders()
    return firstValueFrom(this.http.post<WineType>(this.apiUrl, winetype, { headers: this.headers}));
  }

  async updateWinetype(id: number, winetype: WineType): Promise<any> {
    this.setHeaders()
    console.log('Updating wine type with ID:', id, 'and data:', winetype);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, winetype, { headers: this.headers}));
  }

  async deleteWinetype(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

}


