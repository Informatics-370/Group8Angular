import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { WriteOffs } from 'src/app/Model/writeOffs';

@Injectable({
  providedIn: 'root'
})
export class WriteOffsService {

  private apiUrl = `${environment.baseApiUrl}api/WriteOffs`;

  constructor(private http: HttpClient) {}
  
  getWriteOffs(): Observable<any> {
    return this.http.get<WriteOffs[]>(this.apiUrl);
  }

  async addWriteOffs(writeOff: WriteOffs): Promise<WriteOffs> {
    return firstValueFrom(this.http.post<WriteOffs>(this.apiUrl, writeOff));
  }
}
