import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wishlist } from 'src/app/Model/WishList';
import { WishlistItem } from 'src/app/Model/WishListItem';
import { environment } from 'src/app/environment'; // import environment

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private headers: HttpHeaders | undefined;
  private apiUrl = `${environment.baseApiUrl}api/wishlist`;  // use environment baseApiUrl
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

  constructor(private http: HttpClient) { }

  getWishlist(email: string): Observable<Wishlist> {
    this.setHeaders();
    console.log(this.headers);
    return this.http.get<Wishlist>(`${this.apiUrl}/${email}`, { headers: this.headers });
  }

  addToWishlist(email: string, wishlistItem: WishlistItem): Observable<Wishlist> {
    this.setHeaders();
    return this.http.post<Wishlist>(`${this.apiUrl}/${email}`, wishlistItem, { headers: this.headers });
  }

  removeFromWishlist(email: string, wishlistItemId: number): Observable<void> {
    this.setHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${email}/${wishlistItemId}`, { headers: this.headers });
  }
}
