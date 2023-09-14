import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { WineService } from 'src/app/admin/services/wine.service';
import { VarietalService } from 'src/app/admin/services/varietal.service';
import { WinetypeService } from 'src/app/admin/services/winetype.service';
import { Wine } from 'src/app/Model/wine';
import { Varietal } from 'src/app/Model/varietal';
import { WineType } from 'src/app/Model/winetype';
import jwt_decode from 'jwt-decode';
import { WishlistItem } from 'src/app/Model/WishListItem';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../services/cart.service';


interface DecodedToken {
  sub: string;
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  wines: Wine[] = [];
  varietals: Varietal[] = [];
  winetypes: WineType[] = [];
  showDeleteWineModal = false; // boolean to toggle the delete modal
  wineToDeleteDetails: Wine | null = null; // Store the wine to delete
  wishlistItemToDelete: WishlistItem | null = null; // Store the wishlist item to delete
  wineToDeleteIndex!: number; 
  userEmail: string = '';
  showImageModal: boolean = false;
  currentImage: any;
  searchQuery: string = '';
  filteredWines: Wine[] = [];
  pageSize: number = 2;
  currentPage: number = 1;
  



  constructor(
    private wishlistService: WishlistService, 
    private wineService: WineService,
    private varietalService: VarietalService, // Inject VarietalService
    private winetypeService: WinetypeService, // Inject WinetypeService
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      let token = localStorage.getItem('Token') || '';
      let decodedToken = jwt_decode(token) as DecodedToken;
      let email = decodedToken.sub;
      this.userEmail = email;
      const wishlist = await this.wishlistService.getWishlist(email).toPromise();
      if (wishlist && wishlist.wishlistItems) {
        this.wishlistItems = wishlist.wishlistItems;
        this.wines = []; // Clear the wines list
        for (let item of this.wishlistItems) {
          if (item.wineID !== undefined) {
            let wine = await this.wineService.getWine(item.wineID);
            this.wines.push(wine);
          }
        }
      }
  
      // Fetch varietals and winetypes from your API
      this.varietals = await this.varietalService.getVarietals();
      this.winetypes = await this.winetypeService.getWinetypes();
      this.filteredWines = [...this.wines];
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
  getVarietalName(varietalID: number): string {
    const varietal = this.varietals.find(v => v.varietalID === varietalID);
    return varietal?.name || 'Unknown';
  }
  
  getWinetypeName(wineTypeID: number): string {
    const winetype = this.winetypes.find(w => w.wineTypeID === wineTypeID);
    return winetype?.name || 'Unknown';
  }



openDeleteWineModal(item: WishlistItem) {
    this.wishlistItemToDelete = item; // The WishlistItem to delete
    this.wineToDeleteDetails = this.wines.find(wine => wine.wineID === item.wineID) || null; // The wine details to show in the modal
    this.showDeleteWineModal = true;
}


async removeFromWishlist(wishlistItemID: number | undefined): Promise<void> {
  if (typeof wishlistItemID === 'number') {  // Check if the ID is defined and is a number
    try {
      let token = localStorage.getItem('Token') || '';
      let decodedToken = jwt_decode(token) as DecodedToken;
      let email = decodedToken.sub;
      console.log(`Deleting item ${wishlistItemID} from wishlist of ${email}`);
      await this.wishlistService.removeFromWishlist(email, wishlistItemID)
        .toPromise();  // Convert Observable to Promise
      // Update the wishlist items and wines in the local state
      this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemID !== wishlistItemID);
      this.wines = this.wines.filter(wine => wine.wineID !== this.wishlistItems.find(item => item.wishlistItemID === wishlistItemID)?.wineID);
    } catch (error) {
      console.error(`Failed to remove wine with ID ${wishlistItemID} from wishlist:`, error);
      this.toastr.error('Failed to Remove from Wihslist', this.wineToDeleteDetails?.name)
    }
  }
}


  async deleteWishlistItem() {
    if (this.wishlistItemToDelete) {
      try{
      await this.removeFromWishlist(this.wishlistItemToDelete.wishlistItemID);
      const itemIndex = this.wishlistItems.findIndex(item => item.wishlistItemID === this.wishlistItemToDelete?.wishlistItemID);
      const wineIndex = this.wines.findIndex(wine => wine.wineID === this.wishlistItemToDelete?.wineID);
      if (itemIndex !== -1) this.wishlistItems.splice(itemIndex, 1); // Remove the item from the array
      if (wineIndex !== -1) this.wines.splice(wineIndex, 1); // Remove the wine details from the array
      console.log('deleted:', this.wishlistItemToDelete )
      this.toastr.success('Successfully Removed from Wihslist', this.wineToDeleteDetails?.name)
      }catch (error){
        return;
      }      
      this.closeDeleteWineModal();
      
    }
  }

  closeDeleteWineModal() {
    this.showDeleteWineModal = false;
  }

  addToCart(item: WishlistItem){
    this.cartService.addToCart(this.userEmail, item).subscribe((result: any) => {
      console.log(result);
      this.toastr.success("The wine has been added to your cart", "Added to cart");
    }, (error: any) => {
      console.log("ERROR:", error);
      this.toastr.error("Failed to add wine to cart", "Failed to add wine to cart");
    })
  }

  // openImageModal(wine: any) {
  //   this.currentImage = wine;
  //   this.showImageModal = true;
  // }
  
  // closeImageModal() {
  //   this.showImageModal = false;
  //   this.currentImage = null;
  // }

  

  filterWines() {
    if (this.searchQuery.trim() === '') {
      this.filteredWines = [...this.wines]; // If the search query is empty, show all wines
    } else {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      this.filteredWines = this.wines.filter(wine =>
        wine.name.toLowerCase().includes(searchTerm) ||
        wine.vintage.toString().includes(searchTerm) ||
        this.getVarietalName(wine.varietalID).toLowerCase().includes(searchTerm) ||
        this.getWinetypeName(wine.wineTypeID).toLowerCase().includes(searchTerm) ||
        wine.price.toString().includes(searchTerm)
      );
    }
  }

  get paginatedWines(): Wine[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredWines.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredWines.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWines.length / this.pageSize);
  }
  

}
