import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpResource } from 'src/app/Model/helpService';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpResourcesService {
  headers: HttpHeaders | undefined;
  private baseUrl: string =  `${environment.baseApiUrl}api/HelpResource`; // replace with your actual API URL

  constructor(private httpClient: HttpClient) { }
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

  getHelpPaths(){
    this.setHeaders()
    return this.httpClient.get<HelpResource[]>(`${this.baseUrl}/getHelpPaths`, { headers: this.headers});
  }
}
