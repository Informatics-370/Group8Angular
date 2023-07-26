
import { WishlistItem } from "./WishListItem";
// wishlist.model.ts
export interface Wishlist {
    wishlistID: number |undefined;
    customerID: string |undefined;
    wishlistItems: WishlistItem[] |undefined;
  }
  