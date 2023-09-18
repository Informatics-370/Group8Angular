import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inventory } from 'src/app/Model/inventory';
import { firstValueFrom } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Inventory`;

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


  // Inventory crud operations ----------------------------------------------------.>
  async getFullInventory(): Promise<Inventory[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Inventory[]>(this.apiUrl, { headers: this.headers}));
  }

  async getItemInventory(id: number): Promise<Inventory> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Inventory>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addInventory(inventory: Inventory): Promise<Inventory> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Inventory>(this.apiUrl, inventory, { headers: this.headers}));
  }

  async updateInventory(id: number, inventory: Inventory): Promise<any> {
    this.setHeaders()
    console.log('Updating Write Off Reason with ID:', id, 'and data:', inventory);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, inventory, { headers: this.headers}));
  }

  async deleteInventory(id: number): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

}


  