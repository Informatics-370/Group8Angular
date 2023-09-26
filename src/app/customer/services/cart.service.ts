import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment'; // update with your path to environment file
import { Cart, CartItem } from 'src/app/Model/Cart';
import { Wine } from 'src/app/Model/wine';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private headers: HttpHeaders | undefined;
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
  private apiUrl = `${environment.baseApiUrl}api/cart`;  // Append your endpoint to base URL
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();


  constructor(private http: HttpClient) { }  // Inject HttpClient


  getCart(email: string): Observable<Cart> {
    this.setHeaders();

    return this.http.get<Cart>(`${this.apiUrl}/${email}`, { headers: this.headers }).pipe(
      tap(cart => {
        // Update the cartItemCount BehaviorSubject with the number of CartItems
        this.cartItemCount.next(cart.cartItems.length);

        // Calculate the total quantity of all items in the cart
        const totalQuantity = cart.cartItems.reduce((sum, current) => sum + current.quantity, 0);
        this.updateCartItemCount(totalQuantity); // Assuming you have a method to update cartItemCount

        // Log the total quantity
        // console.log(totalQuantity);       
      })
    );
  }

  public updateCartItemCount(count: number): void {
    this.cartItemCount.next(count);
  }
  

  getWine(wineID: number): Observable<Wine> {
    this.setHeaders();
    return this.http.get<Wine>(`${this.apiUrl}/wine/${wineID}`, { headers: this.headers });
  }
  
  
  addToCart(email: string, cartItem: any): Observable<any> {
    this.setHeaders();
    return this.http.post<any>(`${this.apiUrl}/${email}`, cartItem, { headers: this.headers }).pipe(
      switchMap(() => {
        return this.getCart(email);
      }),
      tap(cart => {
        // Update the cartItemCount based on the total number of items in the cart
        const totalCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.cartItemCount.next(totalCount);
      })
    );
  }
  
  incrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
    this.setHeaders();
    return this.http.put<any>(`${this.apiUrl}/${email}/increment/${cartItemId}`, {}, { headers: this.headers }).pipe(
      switchMap(() => {
        return this.getCart(email);
      }),
      tap(cart => {
        // Update the cartItemCount based on the total number of items in the cart
        const totalCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.cartItemCount.next(totalCount);
      })
    );
  }
  
  
  decrementCartItemQuantity(email: string, cartItemId: number): Observable<any> {
    this.setHeaders();
    return this.http.put(`${this.apiUrl}/${email}/decrement/${cartItemId}`, {}, { headers: this.headers }).pipe(
      tap(() => {
        // Decrement the cartItemCount BehaviorSubject value
        // Make sure it does not go below 0
        this.cartItemCount.next(Math.max(0, this.cartItemCount.value - 1));
      })
    );
  }
  
  clearCart(email: string): Observable<any> {
    this.setHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${email}/clear`, { headers: this.headers }).pipe(
      tap(() => {
        // Reset the cartItemCount BehaviorSubject value to 0
        this.cartItemCount.next(0);
      })
    );
  }
  

getCartTotal(email: string): Observable<any> {
  this.setHeaders();
  return this.http.get<any>(`${this.apiUrl}/${email}/total`, { headers: this.headers });
}

applyDiscount(email: string, newTotal: number): Observable<any> {
  this.setHeaders();
  return this.http.put<any>(`${this.apiUrl}/${email}/applyDiscount`, newTotal, { headers: this.headers });
}

public resetCartItemCount(): void {
  this.cartItemCount.next(0);
}
}
