import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment';
import { ChargeModel } from 'src/app/Model/ChargeModel';

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  private baseUrl = `${environment.baseApiUrl}api/Coinbase`;

  constructor(private http: HttpClient) {}

  createCharge(data: ChargeModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateCharge`, data);
  }
}
