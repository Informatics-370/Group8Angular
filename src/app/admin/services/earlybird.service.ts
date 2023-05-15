import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { EarlyBird } from 'src/app/Model/earlybird';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarlyBirdService {

  private apiUrl = `${environment.baseApiUrl}api/EarlyBirds`;

  constructor(private http: HttpClient) { }

  async getEarlyBirds(): Promise<EarlyBird[]> {
    return firstValueFrom(this.http.get<EarlyBird[]>(this.apiUrl));
  }

  async getEarlyBird(id: number): Promise<EarlyBird> {
    return firstValueFrom(this.http.get<EarlyBird>(`${this.apiUrl}/${id}`));
  }

  async addEarlyBird(earlyBird: EarlyBird): Promise<EarlyBird> {
    return firstValueFrom(this.http.post<EarlyBird>(this.apiUrl, earlyBird));
  }

  async updateEarlyBird(id: number, earlyBird: EarlyBird): Promise<any> {
    console.log('Updating EarlyBird with ID:', id, 'and data:', earlyBird);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, earlyBird));
  }

  async deleteEarlyBird(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
