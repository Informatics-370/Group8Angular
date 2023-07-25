import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRolesViewModel } from 'src/app/Model/userRolesViewModel';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/SuperUsers`;

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

GetAllUsers(){
  this.setHeaders();
  return this.httpClient.get<UserRolesViewModel[]>(`${this.apiUrl}/GetAllUsers`, {headers: this.headers});
}


UpdateUserRoles(user: UserRolesViewModel){
  this.setHeaders();
  return this.httpClient.put(`${this.apiUrl}/UpdateUserRoles`, user, {headers: this.headers});
}

  GetAllRoles(){
    this.setHeaders();
    return this.httpClient.get<string[]>(`${this.apiUrl}/GetAllRoles`, {headers: this.headers});
  }
  
}
