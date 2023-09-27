import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/BackupAndRestore`;
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

  constructor(private http: HttpClient) { }

  createBackup(){
    this.setHeaders();
    return this.http.post(`${this.apiUrl}/BackupDatabase`, null, { headers: this.headers });
  }

  restoreBackup(backupFilePath: string): Observable<any>{
    console.log(backupFilePath);
    this.setHeaders();
    return this.http.post(`${this.apiUrl}/RestoreDatabase/${backupFilePath}`, { backupFilePath: backupFilePath.toString() }, { headers: this.headers });
  }

  updateTimer(timer: number): Observable<any>{
    this.setHeaders();
    return this.http.put(`${this.apiUrl}/UpdateTimer/${timer}`, timer, { headers: this.headers });
  }

  getTimer(): Observable<any> {
    this.setHeaders();
    return this.http.get(`${this.apiUrl}/GetTimer`, { headers: this.headers })
  }
}
