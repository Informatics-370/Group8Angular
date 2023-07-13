import { Component, OnInit } from '@angular/core';
import { Wine } from 'src/app/Model/wine';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';
import { WineService } from 'src/app/admin/services/wine.service';
import { VarietalService } from 'src/app/admin/services/varietal.service';
import { WinetypeService } from 'src/app/admin/services/winetype.service';

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


  constructor(
    private wineService: WineService,
    private varietalService: VarietalService,
    private winetypeService: WinetypeService
  ) { } // Inject the WineService, VarietalService, and WinetypeService

  ngOnInit() {
    this.loadWines();
    this.loadVarietals();
    this.loadWinetypes();
    }
    
    incrementCounter() {
    this.counter++;
    }
    
    decrementCounter() {
    if (this.counter > 0) {
    this.counter--;
    }
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
}
