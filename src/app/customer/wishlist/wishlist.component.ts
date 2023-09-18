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
import { ChangeDetectorRef } from '@angular/core';

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
  pageSize: number = 5;
  currentPage: number = 1;
  



  constructor(
    private wishlistService: WishlistService, 
    private wineService: WineService,
    private varietalService: VarietalService, // Inject VarietalService
    private winetypeService: WinetypeService, // Inject WinetypeService
    private cartService: CartService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
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
  try {
    if (typeof wishlistItemID === 'number') {  // Check if the ID is defined and is a number
      // Your existing code ...
      const wineIDToDelete = this.wishlistItems.find(item => item.wishlistItemID === wishlistItemID)?.wineID;

      // Decode token and get email
      const token = localStorage.getItem('Token') || '';
      const decodedToken = jwt_decode(token) as DecodedToken;
      const email = decodedToken.sub;

      await this.wishlistService.removeFromWishlist(email, wishlistItemID).toPromise();

      // Optimized: Create new array instances for wishlistItems and wines in a single step
      this.wishlistItems = this.wishlistItems.filter(item => item.wishlistItemID !== wishlistItemID);
      if (typeof wineIDToDelete === 'number') {
        this.wines = this.wines.filter(wine => wine.wineID !== wineIDToDelete);
      }
      
    }
  } catch (error) {
    console.error(`Failed to remove wishlist item with ID ${wishlistItemID}:`, error);
    this.toastr.error('Failed to Remove from Wishlist');
  }
}


async deleteWishlistItem() {
  if (this.wishlistItemToDelete) {
    try {
      console.log("Before:", JSON.stringify(this.wishlistItems)); // Before logging
      console.log("Before:", JSON.stringify(this.wines)); // Before logging

      await this.removeFromWishlist(this.wishlistItemToDelete.wishlistItemID);

      console.log("After:", JSON.stringify(this.wishlistItems)); // After logging
      console.log("After:", JSON.stringify(this.wines)); // After logging

      this.toastr.success('Successfully Removed from Wishlist', this.wineToDeleteDetails?.name);

      this.cd.detectChanges(); // force change detection
      console.log('Change detection triggered.');
      location.reload();
    } catch (error) {
      console.error("Delete operation failed", error);
      this.toastr.error('Failed to Remove from Wishlist', this.wineToDeleteDetails?.name);
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
