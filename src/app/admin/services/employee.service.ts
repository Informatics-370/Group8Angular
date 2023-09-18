import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Employee } from 'src/app/Model/employee';
import { EmployeeRegistrationViewModel } from 'src/app/Model/employeeRegisterViewModel';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/Employees`;

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


  GetEmployees(): Observable<any> {
    this.setHeaders();
    return this.httpClient.get(`${this.apiUrl}/GetEmployees`, { headers: this.headers });
  }

  async GetEmployee(id: string): Promise<Employee> {
    this.setHeaders();
    return firstValueFrom(this.httpClient.get<Employee>(`${this.apiUrl}/${id}`, { headers: this.headers }));
  }

  AddEmployee(employee: EmployeeRegistrationViewModel): Observable<any> {
    this.setHeaders();
    return this.httpClient.post(`${this.apiUrl}/AddEmployee`, employee, { headers: this.headers });
  }

  UpdateEmployee(id: string, employee: Employee): Observable<any> {
    this.setHeaders();
    console.log('Updating employee with ID:', id, 'and data:', employee);
    return this.httpClient.put(`${this.apiUrl}/${id}`, employee, { headers: this.headers });
  }
  

  DeleteEmployee(id: string): Observable<any> {
    this.setHeaders();
    return this.httpClient.delete(`${this.apiUrl}/DeleteEmployee/${id}`, { headers: this.headers });
  } 
}

