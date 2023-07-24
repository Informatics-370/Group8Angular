import { Component, OnInit } from '@angular/core';
import { Wine } from 'src/app/Model/wine';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';
import { WineService } from 'src/app/admin/services/wine.service';
import { VarietalService } from 'src/app/admin/services/varietal.service';
import { WinetypeService } from 'src/app/admin/services/winetype.service';
import { CartService } from '../services/cart.service';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../services/data-service.service';

@Component({
  selector: 'app-client-products',
  templateUrl: './client-products.component.html',
  styleUrls: ['./client-products.component.css']
})
export class ClientProductsComponent implements OnInit {
  // variables
  counter = 0;
  // wine: Wine[] = [];
  wines: Wine[] = [];
  winetypes: WineType[] = [];
  varietals: Varietal[] = [];
  dataLoaded = false;
  quantityMap: Map<number, number> = new Map<number, number>();



  constructor(
    private wineService: WineService,
    private varietalService: VarietalService,
    private winetypeService: WinetypeService,
    private cartService : CartService
  ) { } // Inject the WineService, VarietalService, and WinetypeService

  ngOnInit() {
    this.loadWines();
    this.loadVarietals();
    this.loadWinetypes();
    }
    
    incrementCounter(wineId: number): void {
      let quantity = this.quantityMap.get(wineId) || 0;
      this.quantityMap.set(wineId, ++quantity);
    }
    
    decrementCounter(wineId: number): void {
      let quantity = this.quantityMap.get(wineId);
      if (quantity && quantity > 0) {
        this.quantityMap.set(wineId, --quantity);
      }
    }

    getQuantity(wineId: number): number {
      return this.quantityMap.get(wineId) || 0;
    }
    
    

  loadWines() {
    this.wineService.getWines().then((wines: Wine[]) => {
    this.wines = wines;
    console.log(wines);
    this.assignWineTypesAndVarietals();
    this.checkDataLoaded(); // Check if all data is loaded

  }).catch(error => {
    console.error('Error:', error);
    console.log("Failed to load wines");
    // Handle your error here
    this.checkDataLoaded(); // Check if all data is loaded even in case of error
  });
  
  }

  loadVarietals() {
    this.varietalService.getVarietals().then((varietals: Varietal[]) => {
    this.varietals = varietals;
    console.log(varietals);
    this.checkDataLoaded(); // Check if all data is loaded

  }).catch(error => {
    console.error('Error:', error);
    console.log("Failed to load varietals");
    // Handle your error here
    this.checkDataLoaded(); // Check if all data is loaded even in case of error
  });
  
  }

  loadWinetypes() {
    this.winetypeService.getWinetypes().then((winetypes: WineType[]) => {
      this.winetypes = winetypes;
      console.log(winetypes);
      this.checkDataLoaded(); // Check if all data is loaded

    }).catch(error => {
      console.error('Error:', error);
      console.log("Failed to load winetypes");
      // Handle your error here
      this.checkDataLoaded(); // Check if all data is loaded even in case of error
    });
  }

  checkDataLoaded() {
    if (this.wines.length > 0 && this.varietals.length > 0 && this.winetypes.length > 0) {
      this.dataLoaded = true;
      this.assignWineTypesAndVarietals();
    }
  }



  assignWineTypesAndVarietals() {
    for (let wine of this.wines) {
      wine.wineType = this.winetypes.find(type => type.wineTypeID === wine.wineTypeID) || new WineType();
      wine.varietal = this.varietals.find(varietal => varietal.varietalID === wine.varietalID) || new Varietal();
    }
  }

  //Cart functionality

  addToCart(wine: Wine) {
    // Decode token to get email
    const token = localStorage.getItem('Token') || '';
    const decoded = jwtDecode(token) as DecodedToken;
    const email = decoded.sub; // the property might be different, adjust it to match your token structure
    
    // Fetch or create cart for the user here if necessary
  
    // Create cartItem
    const cartItem = {
      cartItemID: 0,  // generate or fetch ID if necessary
      cartID: 0,  // fetch the user's cart ID
      wineID: wine.wineID,
      quantity: this.getQuantity(wine.wineID),
      wine: wine,  // Use the wine object directly here
      cart: {
        cartID: 0,  // fetch the user's cart ID
        customerID: email,  // the user's email
        cartItems: []  // add cart items if necessary
      }
    };
  
    this.cartService.addToCart(email, cartItem).subscribe(
      () => {
        console.log('Wine added to cart!');
      },
      error => {
        console.log('Failed to add wine to cart');
      }
    );
  }
  
  }


