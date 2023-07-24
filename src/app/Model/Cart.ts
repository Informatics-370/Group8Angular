import { Wine } from "./wine";

export interface CartItem {
    cartItemID: number;
    cartID: number;
    wineID: number;
    quantity: number;
    wine: Wine;
  }
  
  export interface Cart {
    cartID: number;
    customerID: string;
    cartTotal : number;
    cartItems: CartItem[];
  }
  