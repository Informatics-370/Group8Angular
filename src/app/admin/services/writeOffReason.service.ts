import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class WriteORService {

  private apiUrl = `${environment.baseApiUrl}api/WriteOff_Reason`;

  constructor(private http: HttpClient) {}


  // Write Off Reason crud operations ----------------------------------------------------.>
  async getWriteORs(): Promise<WriteOffReason[]> {
    return firstValueFrom(this.http.get<WriteOffReason[]>(this.apiUrl));
  }

  async getWriteOR(id: number): Promise<WriteOffReason> {
    return firstValueFrom(this.http.get<WriteOffReason>(`${this.apiUrl}/${id}`));
  }

  async addWriteOR(writeOffReason: WriteOffReason): Promise<WriteOffReason> {
    return firstValueFrom(this.http.post<WriteOffReason>(this.apiUrl, writeOffReason));
  }

  async updateWriteOR(id: number, writeOffReason: WriteOffReason): Promise<any> {
    console.log('Updating Write Off Reason with ID:', id, 'and data:', writeOffReason);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, writeOffReason));
  }

  async deleteWriteOR(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

}


  