import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpResource } from 'src/app/Model/helpService';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpResourcesService {

  private baseUrl: string =  `${environment.baseApiUrl}api/HelpResource`; // replace with your actual API URL

  constructor(private httpClient: HttpClient) { }

  getHelpPaths(){
    return this.httpClient.get<HelpResource[]>(`${this.baseUrl}/getHelpPaths`);
  }
}
