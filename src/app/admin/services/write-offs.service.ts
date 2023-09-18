import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { WriteOffs } from 'src/app/Model/writeOffs';

@Injectable({
  providedIn: 'root'
})
export class WriteOffsService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/WriteOffs`;

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
  
  getWriteOffs(): Observable<any> {
    this.setHeaders()
    return this.http.get<WriteOffs[]>(this.apiUrl, { headers: this.headers});
  }

  async addWriteOffs(writeOff: WriteOffs): Promise<WriteOffs> {
    this.setHeaders()
    return firstValueFrom(this.http.post<WriteOffs>(this.apiUrl, writeOff, { headers: this.headers}));
  }
}
