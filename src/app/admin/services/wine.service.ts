import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Wine } from 'src/app/Model/wine';
import { firstValueFrom, map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';



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
    const response = await this.http.post<HttpEvent<Wine>>(this.apiUrl, wine, { reportProgress: true, observe: 'events' }).toPromise();
    
    if (response instanceof HttpResponse) {
      const event = response as unknown as HttpEvent<Wine>;
      if (event.type === HttpEventType.Response) {
        return event.body as Wine;
      }
    }
    
    throw new Error('An error occurred while adding the wine.');
  }
  
  async updateWine(id: number, wine: FormData): Promise<any> {
    console.log('Updating wine with ID:', id, 'and data:', wine);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, wine, { reportProgress: true, observe: 'events' }));
  }

  async deleteWine(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

}


  