import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient } from '@angular/common/http';
import { Inventory } from 'src/app/Model/inventory';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = `${environment.baseApiUrl}api/Inventory`;

  constructor(private http: HttpClient) {}


  // Inventory crud operations ----------------------------------------------------.>
  async getFullInventory(): Promise<Inventory[]> {
    return firstValueFrom(this.http.get<Inventory[]>(this.apiUrl));
  }

  async getItemInventory(id: number): Promise<Inventory> {
    return firstValueFrom(this.http.get<Inventory>(`${this.apiUrl}/${id}`));
  }

  async addIvetory(inventory: Inventory): Promise<Inventory> {
    return firstValueFrom(this.http.post<Inventory>(this.apiUrl, inventory));
  }

  async updateIventory(id: number, inventory: Inventory): Promise<any> {
    console.log('Updating Write Off Reason with ID:', id, 'and data:', inventory);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, inventory));
  }

  async deleteIventory(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

}


  