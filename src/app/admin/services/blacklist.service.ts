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
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/Blacklists`;

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


  // Blacklist crud operations ----------------------------------------------------.>
  async getBlacklist(): Promise<Blacklist[]> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Blacklist[]>(this.apiUrl, { headers: this.headers}));
  }

  async getBlacklistC(id: number): Promise<Blacklist> {
    this.setHeaders()
    return firstValueFrom(this.http.get<Blacklist>(`${this.apiUrl}/${id}`, { headers: this.headers}));
  }

  async addBlacklistC(blacklistC: Blacklist): Promise<Blacklist> {
    this.setHeaders()
    return firstValueFrom(this.http.post<Blacklist>(this.apiUrl, blacklistC, { headers: this.headers}));
  }

  async updateBlacklistC(id: number, blacklistC: Blacklist): Promise<any> {
    this.setHeaders()
    console.log('Updating Blacklist Customer with ID:', id, 'and data:', blacklistC);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, blacklistC,  { headers: this.headers}));
  }

  async deleteBlacklistC(blacklistDelete: BlacklistDelete): Promise<any> {
    this.setHeaders()
    return firstValueFrom(this.http.delete(`${this.apiUrl}`, {body: blacklistDelete, headers: this.headers}));
}


  //Check if user is in Blacklist table
  async checkBlacklist(email: string): Promise<boolean> {
    this.setHeaders()
    return firstValueFrom(this.http.get<boolean>(`${this.apiUrl}/check/${email}`, { headers: this.headers}));
  }
}


  