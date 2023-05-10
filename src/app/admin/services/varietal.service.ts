import { Injectable } from '@angular/core';
import { Varietal } from 'src/app/Model/varietal';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VarietalService {

  private apiUrl = `${environment.baseApiUrl}api/Varietals`;

  constructor(private http: HttpClient) { }

  // varietal crud operations---------------------------------------------------.>
  async getVarietals(): Promise<Varietal[]> {
    return firstValueFrom(this.http.get<Varietal[]>(this.apiUrl));
  }

  async getVarietal(id: number): Promise<Varietal> {
    return firstValueFrom(this.http.get<Varietal>(`${this.apiUrl}/${id}`));
  }

  async addVarietal(varietal: Varietal): Promise<Varietal> {
    return firstValueFrom(this.http.post<Varietal>(this.apiUrl, varietal));
  }

  async updateVarietal(id: number, varietal: Varietal): Promise<any> {
    console.log('Updating varietal with ID:', id, 'and data:', varietal);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, varietal));
  }

  async deleteVarietal(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}
