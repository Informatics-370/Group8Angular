import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Blacklist } from 'src/app/Model/blacklist';
import { firstValueFrom } from 'rxjs';
import { BlacklistDelete } from 'src/app/Model/blacklistDelete';



@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  private apiUrl = `${environment.baseApiUrl}api/Blacklists`;

  constructor(private http: HttpClient) {}


  // Blacklist crud operations ----------------------------------------------------.>
  async getBlacklist(): Promise<Blacklist[]> {
    return firstValueFrom(this.http.get<Blacklist[]>(this.apiUrl));
  }

  async getBlacklistC(id: number): Promise<Blacklist> {
    return firstValueFrom(this.http.get<Blacklist>(`${this.apiUrl}/${id}`));
  }

  async addBlacklistC(blacklistC: Blacklist): Promise<Blacklist> {
    return firstValueFrom(this.http.post<Blacklist>(this.apiUrl, blacklistC));
  }

  async updateBlacklistC(id: number, blacklistC: Blacklist): Promise<any> {
    console.log('Updating Blacklist Customer with ID:', id, 'and data:', blacklistC);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, blacklistC));
  }

  async deleteBlacklistC(blacklistDelete: BlacklistDelete): Promise<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = {
        headers: headers,
        body: blacklistDelete
    };
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${blacklistDelete.id}`, options));
}


  //Check if user is in Blacklist table
  async checkBlacklist(email: string): Promise<boolean> {
    return firstValueFrom(this.http.get<boolean>(`${this.apiUrl}/check/${email}`));
  }
}


  