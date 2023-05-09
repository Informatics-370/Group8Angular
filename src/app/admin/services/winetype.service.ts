import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom } from 'rxjs';
import { WineType } from 'src/app/Model/winetype';

@Injectable({
  providedIn: 'root'
})
export class WinetypeService {

  private apiUrl = `${environment.baseApiUrl}api/WineTypes`;

  constructor(private http: HttpClient) { }

  //winetype crud operations------------------------------------------------------.>
  async getWinetypes(): Promise<WineType[]> {
    return firstValueFrom(this.http.get<WineType[]>(this.apiUrl));
  }

  async getWinetype(id: number): Promise<WineType> {
    return firstValueFrom(this.http.get<WineType>(`${this.apiUrl}/${id}`));
  }

  async addWinetype(winetype: WineType): Promise<WineType> {
    return firstValueFrom(this.http.post<WineType>(this.apiUrl, winetype));
  }

  async updateWinetype(id: number, winetype: WineType): Promise<any> {
    console.log('Updating wine type with ID:', id, 'and data:', winetype);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, winetype));
  }

  async deleteWinetype(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

}


