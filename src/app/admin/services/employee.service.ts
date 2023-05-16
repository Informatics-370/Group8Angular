import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Employee } from 'src/app/Model/employee';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.baseApiUrl}api/Employees`;

  constructor(private http: HttpClient) { }

  async GetEmployees(): Promise<Employee[]> {
    return firstValueFrom(this.http.get<Employee[]>(this.apiUrl));
  }

  async GetEmployee(id: number): Promise<Employee> {
    return firstValueFrom(this.http.get<Employee>(`${this.apiUrl}/${id}`));
  }

  async AddEmployee(employee: Employee): Promise<Employee> {
    return firstValueFrom(this.http.post<Employee>(this.apiUrl, employee));
  }

  async UpdateEmployee(id: number, employee: Employee): Promise<any> {
    console.log('Updating employee with ID:', id, 'and data:', employee);
    return firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, employee));
  }
  

  async DeleteEmployee(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  } 
}

