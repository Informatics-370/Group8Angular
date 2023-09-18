import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/app/environment';
import { StockTake } from 'src/app/Model/stocktake';

@Injectable({
  providedIn: 'root'
})
export class StockTakeService {
  headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/StockTake`;

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

  


  GetStockTake(): Observable<any> {
    this.setHeaders()
    return this.httpClient.get<StockTake[]>(`${this.apiUrl}/GetStockTake`, { headers: this.headers});
  }

  async AddStockTake(stocktake: StockTake): Promise<StockTake> {
    this.setHeaders()
    return firstValueFrom(this.httpClient.post<StockTake>(this.apiUrl+ "/AddStockTake", stocktake, { headers: this.headers}));
  }

  async UpdateStockTake(stocktake: StockTake): Promise<StockTake> {
    this.setHeaders()
    return firstValueFrom(this.httpClient.put<StockTake>(`${this.apiUrl}/UpdateStockTake/${stocktake.stocktakeID}`, stocktake, { headers: this.headers}));
  }
  

  
}

