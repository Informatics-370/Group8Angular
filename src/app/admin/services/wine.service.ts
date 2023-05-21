import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class WineService {

  private apiUrl = `${environment.baseApiUrl}api/Wines`;

  constructor(private http: HttpClient) {}


  // wine crud operations ----------------------------------------------------.>
  async getWines(): Promise<Wine[]> {
    return firstValueFrom(this.http.get<Wine[]>(this.apiUrl));
  }

  async getWine(id: number): Promise<Wine> {
    return firstValueFrom(this.http.get<Wine>(`${this.apiUrl}/${id}`));
  }

  async addWine(wine: FormData): Promise<Wine> {
    return firstValueFrom(this.http.post<Wine>(this.apiUrl, wine));
  }
  
  async updateWine(id: number, wine: FormData): Promise<any> {
    console.log('Updating wine with ID:', id, 'and data:', wine);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, wine));
  }

  async deleteWine(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

}


  