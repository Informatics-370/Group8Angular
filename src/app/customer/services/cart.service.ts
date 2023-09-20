import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment'; // update with your path to environment file
import { Cart } from 'src/app/Model/Cart';
import { Wine } from 'src/app/Model/wine';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  headers: HttpHeaders | undefined;

  private apiUrl = `${environment.baseApiUrl}api/cart`;  // Append your endpoint to base URL

  constructor(private http: HttpClient) { }  // Inject HttpClient

  public cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  setCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

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

  getCart(email: string): Observable<Cart> {
    this.setHeaders();
    return this.http.get<Cart>(`${this.apiUrl}/${email}`, { headers: this.headers });
  }

  getWine(wineID: number): Observable<Wine> {
    this.setHeaders();
    return this.http.get<Wine>(`${this.apiUrl}/wine/${wineID}`, { headers: this.headers });
  }
  
  
  addToCart(email: string, cartItem: any): Observable<any> {
    this.setHeaders();
    return this.http.post<any>(`${this.apiUrl}/${email}`, cartItem, { headers: this.headers });
  }

  incrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
    this.setHeaders();
    return this.http.put<any>(`${this.apiUrl}/${email}/increment/${cartItemId}`, { headers: this.headers });
}

decrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
  this.setHeaders();
    return this.http.put<any>(`${this.apiUrl}/${email}/decrement/${cartItemId}`, { headers: this.headers });
}


getCartTotal(email: string): Observable<any> {
  this.setHeaders();
  return this.http.get<any>(`${this.apiUrl}/${email}/total`, { headers: this.headers });
}

applyDiscount(email: string, newTotal: number): Observable<any> {
  this.setHeaders();
  return this.http.put<any>(`${this.apiUrl}/${email}/applyDiscount`, newTotal, { headers: this.headers });
}


clearCart(email: string): Observable<any> {
  this.setHeaders();
  return this.http.delete<any>(`${this.apiUrl}/${email}/clear`, { headers: this.headers });
}

resetCartCounter(): void {
  this.setCartCount(0);
}

}
