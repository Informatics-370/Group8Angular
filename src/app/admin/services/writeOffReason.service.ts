import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class WriteORService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/WriteOff_Reason`;

  constructor(private http: HttpClient) {}
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


  // Write Off Reason crud operations ----------------------------------------------------.>
  async getWriteORs(): Promise<WriteOffReason[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<WriteOffReason[]>(this.apiUrl, { headers: this.headers}));
  }

  async getWriteOR(id: number): Promise<WriteOffReason> {
    this.setHeaders()
    return firstValueFrom(this.http.get<WriteOffReason>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addWriteOR(writeOffReason: WriteOffReason): Promise<WriteOffReason> {
    this.setHeaders()
    return firstValueFrom(this.http.post<WriteOffReason>(this.apiUrl, writeOffReason, { headers: this.headers}));
  }

  async updateWriteOR(id: number, writeOffReason: WriteOffReason): Promise<any> {
    this.setHeaders()
    console.log('Updating Write Off Reason with ID:', id, 'and data:', writeOffReason);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, writeOffReason, { headers: this.headers}));
  }

  async deleteWriteOR(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

}


  