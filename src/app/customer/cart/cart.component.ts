import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../services/data-service.service';
import { Cart, CartItem } from 'src/app/Model/Cart';
import { Wine } from 'src/app/Model/wine';  // Import Wine model

import { WineService } from 'src/app/admin/services/wine.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Cart | undefined;
  cartItems: CartItem[] = [];

  wines: Wine[] = [];  // This will hold wines details
  cartTotal = 0;

  constructor(private cartService: CartService, private wineService: WineService) { }  // Inject WineService

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    
    await this.loadCart(email);
    console.log(email);
  }

  loadCart(email: string): void {
    this.cartService.getCart(email).subscribe(
      (cart: Cart) => {
        this.cart = cart;
        this.cartTotal = cart.cartTotal;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  
  async incrementQuantity(cartItemId: number): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;

    if (!email) return;

    try {
      await this.cartService.incrementCartItemQuantity(email, cartItemId).toPromise();
      await this.loadCart(email);
    } catch (error) {
      console.log(error);
    }
}

async decrementQuantity(cartItemId: number): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;

    if (!email) return;

    try {
      await this.cartService.decrementCartItemQuantity(email, cartItemId).toPromise();
      await this.loadCart(email);
     

    } catch (error) {
      console.log(error);
    }
}


getWineDetails(wineID: number): Wine | undefined {
  const foundWine = this.wines.find(wine => wine.wineID === wineID);
  return foundWine;
}

}
