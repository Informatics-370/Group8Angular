import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment'; // update with your path to environment file
import { Cart } from 'src/app/Model/Cart';
import { Wine } from 'src/app/Model/wine';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.baseApiUrl}api/cart`;  // Append your endpoint to base URL

  constructor(private http: HttpClient) { }  // Inject HttpClient

  getCart(email: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${email}`);
  }

  getWine(wineID: number): Observable<Wine> {
    return this.http.get<Wine>(`${this.apiUrl}/wine/${wineID}`);
  }
  
  
  addToCart(email: string, cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${email}`, cartItem);
  }

  incrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${email}/increment/${cartItemId}`, {});
}

decrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${email}/decrement/${cartItemId}`, {});
}


getCartTotal(email: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${email}/total`);
}

}
