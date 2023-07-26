import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wishlist } from 'src/app/Model/WishList';
import { WishlistItem } from 'src/app/Model/WishListItem';
import { environment } from 'src/app/environment'; // import environment

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.baseApiUrl}api/wishlist`;  // use environment baseApiUrl

  constructor(private http: HttpClient) { }

  getWishlist(email: string): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.apiUrl}/${email}`);
  }

  addToWishlist(email: string, wishlistItem: WishlistItem): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${this.apiUrl}/${email}`, wishlistItem);
  }

  removeFromWishlist(email: string, wishlistItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}/${wishlistItemId}`);
  }
}
