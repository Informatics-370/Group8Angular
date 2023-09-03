import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/app/environment';
import { StockTake } from 'src/app/Model/stocktake';

@Injectable({
  providedIn: 'root'
})
export class StockTakeService {
  private apiUrl = `${environment.baseApiUrl}api/StockTake`;

  constructor(private httpClient: HttpClient) { }

  


  GetStockTake(): Observable<any> {
    return this.httpClient.get<StockTake[]>(`${this.apiUrl}/GetStockTake`);
  }

  async AddStockTake(stocktake: StockTake): Promise<StockTake> {
    return firstValueFrom(this.httpClient.post<StockTake>(this.apiUrl+ "/AddStockTake", stocktake));
  }

  
}

