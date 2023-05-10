import { Component, OnInit } from '@angular/core';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WineService } from '../services/wine.service';
import { VarietalService } from '../services/varietal.service';
import { WinetypeService } from '../services/winetype.service';
import { Wine } from 'src/app/Model/wine';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
})
export class WineComponent implements OnInit {



  //Marco geniet 
  wines: Wine[] = [];
  winetypes: WineType[] = [];
  varietals: Varietal[] = [];

  //Wine modal booleans
  showWineModal: boolean = false;
  showTypeModal: boolean = false;
  showVarietalModal: boolean = false;

  //Wine variables
  editingWine: boolean = false;
  currentWine: Wine = new Wine();
  showDeleteWineModal = false;

  //Varietal variables
  editingVarietal: boolean = false;
  currentVarietal: Varietal = new Varietal();
  showDeleteVarietalModal: boolean = false;

  // WineType variables
  editingWineType: boolean = false;
  currentWineType: WineType = new WineType();
  showDeleteWineTypeModal: boolean = false;
  




  constructor(private discountService: DiscountService, private router: Router, private wineService: WineService, private winetypeService: WinetypeService, private varietalService: VarietalService) { }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadWines();
    this.loadVarietals();
    this.loadWinetypes();
  }

  //--------------------------------------------------------------------------------------------------------------------------------
//Methods to display the Wines, WineTypes and WineVarietals in the tables
  async loadDiscounts(): Promise<void> {
    try {
      this.discounts = await this.discountService.getDiscounts();
    } catch (error) {
      console.error(error);
    }
  }

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error(error);
    }
  }

  async loadVarietals(): Promise<void> {
    try {
      this.varietals = await this.varietalService.getVarietals();
      console.log('Loaded Varietals:', this.varietals); // Add this line
    } catch (error) {
      console.error(error);
    }
  }

  async loadWinetypes(): Promise<void> {
    try {
      this.winetypes = await this.winetypeService.getWinetypes();
    } catch (error) {
      console.error(error);
    }
  }
//--------------------------------------------------------------------------------------------------------------------------------


  // Wine methods
  openAddWineModal() {
    this.editingWine = false;
    this.currentWine = new Wine();
    this.showWineModal = true;
  }
  openEditWineModal(id: number) {
    console.log('Opening edit wine modal for ID:', id);
    this.editingWine = true;
    this.currentWine = this.wines.find(wine => wine.WineID === id)!;
    this.showWineModal = true;
  }
  closeWineModal() {
    this.showWineModal = false;
  }



  // Varietal methods
  openAddVarietalModal() {
    this.editingVarietal = false;
    this.currentVarietal = new Varietal();
    this.showVarietalModal = true;
  }
  openEditVarietalModal(id: number) {
    console.log('Opening edit varietal modal for ID:', id);
    this.editingVarietal = true;
    this.currentVarietal = this.varietals.find(varietal => varietal.VarietalID === id)!;
    this.showVarietalModal = true;
  }
  closeVarietalModal() {
    this.showVarietalModal = false;
  }



  // WineType methods
  openAddWineTypeModal() {
    this.editingWineType = false;
    this.currentWineType = new WineType();
    this.showTypeModal = true;
  }
  openEditWineTypeModal(id: number) {
    console.log('Opening edit wine type modal for ID:', id);
    this.editingWineType = true;
    this.currentWineType = this.winetypes.find(wineType => wineType.WineTypeID === id)!;
    this.showTypeModal = true;
  }
  closeWineTypeModal() {
    this.showTypeModal = false;
  }


  async submitWineForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingWine flag:', this.editingWine);
    if (form.valid) {
      try {
        if (this.editingWine) {
          // Update Wine
          await this.wineService.updateWine(this.currentWine.WineID!, this.currentWine);
          const index = this.wines.findIndex(wine => wine.WineID === this.currentWine.WineID);
          if (index !== -1) {
            this.wines[index] = this.currentWine;
          }
        } else {
          // Add Wine
          const data = await this.wineService.addWine(this.currentWine);
          this.wines.push(data);
        }
        this.closeWineModal();
        if (!this.editingWine) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async SubmitVarietalForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingVarietal flag:', this.editingVarietal);
    if (form.valid) {
      try {
        if (this.editingVarietal) {
          // Update Varietal
          await this.varietalService.updateVarietal(this.currentVarietal.VarietalID!, this.currentVarietal);
          const index = this.varietals.findIndex(varietal => varietal.VarietalID === this.currentVarietal.VarietalID);
          if (index !== -1) {
            this.varietals[index] = this.currentVarietal;
          }
        } else {
          // Add Varietal
          const data = await this.varietalService.addVarietal(this.currentVarietal);
          this.varietals.push(data);
        }
        this.closeVarietalModal();
        if (!this.editingVarietal) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async SubmitWineTypeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingWineType flag:', this.editingWineType);
    if (form.valid) {
      try {
        if (this.editingWineType) {
          // Update WineType

          await this.winetypeService.updateWinetype(this.currentWineType.WineTypeID!, this.currentWineType);
          // this.currentWine.WineTypeID = this.currentWineType.WineTypeID;

          const index = this.winetypes.findIndex(wineType => wineType.WineTypeID === this.currentWineType.WineTypeID);
          if (index !== -1) {
            this.winetypes[index] = this.currentWineType;
          }
        } else {
          // Add WineType
          const data = await this.winetypeService.addWinetype(this.currentWineType);
          this.winetypes.push(data);
        }
        this.closeWineTypeModal();
        if (!this.editingWineType) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }


  async deleteWineType(id: number): Promise<void> {
    try {
      if (id === -1) {
        console.error('No ID provided for WineType deletion');
        return;
      }
      await this.winetypeService.deleteWinetype(id);
      this.winetypes = this.winetypes.filter(wineType => wineType.WineTypeID !== id);
    } catch (error) {
      console.error('Error deleting WineType:', error);
    }
  }

  async deleteVarietal(id: number): Promise<void> {
    try {
      await this.varietalService.deleteVarietal(id);
      this.varietals = this.varietals.filter(varietal => varietal.VarietalID !== id);
    } catch (error) {
      console.error('Error deleting Varietal:', error);
    }
  }



  // DISCOUNT------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //===================================================================================================================================================================.//


  //Discount variables needed
  discounts: Discount[] = [];
  currentDiscount: Discount = new Discount();
  showDiscountModal: boolean = false;
  editingDiscount: boolean = false;
  showDeleteDiscountModal = false;
  discountToDeleteDetails: any;
discountToDelete: any = null;


  // Discount methods---------------------------------------------------------------------------------.>

  // Modal-related methods
  openAddDiscountModal() {
    this.editingDiscount = false;
    this.currentDiscount = new Discount();
    this.showDiscountModal = true;
  }
  openEditDiscountModal(id: number) {
    console.log('Opening edit discount modal for ID:', id);
    this.editingDiscount = true;
    this.currentDiscount = this.discounts.find(discount => discount.discountID === id)!;
    this.showDiscountModal = true;
  }
  closeDiscountModal() {
    this.showDiscountModal = false;
  }

  openDeleteDiscountModal(discount: any): void {
    this.discountToDelete = discount.discountID;
    console.log("Discount : ",this.discountToDelete)
    this.discountToDeleteDetails = discount;
    this.showDeleteDiscountModal = true;
  }
  

  closeDeleteModal(): void {
    this.showDeleteDiscountModal = false;
  }

  //CRUD discount

  // generate a new discount code for the customer to use upon checkout
  generateUniqueCode() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const timestampLast3Digits = Date.now().toString().slice(-3);

    return randomLetter1 + randomLetter2 + '-' + timestampLast3Digits;
  }

  //Create and Edit discount
  async submitDiscountForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingDiscount flag:', this.editingDiscount);
    if (form.valid) {

      // Generate a unique discount code only for new discount
      if (!this.editingDiscount) {
        const uniqueCode = this.generateUniqueCode();
        this.currentDiscount.discountCode = uniqueCode;
      }

      try {
        if (this.editingDiscount) {
          // Update Discount
          await this.discountService.updateDiscount(this.currentDiscount.discountID!, this.currentDiscount);
          const index = this.discounts.findIndex(discount => discount.discountID === this.currentDiscount.discountID);
          if (index !== -1) {
            this.discounts[index] = this.currentDiscount;
          }
        } else {
          // Add Discount
          const data = await this.discountService.addDiscount(this.currentDiscount);
          this.discounts.push(data);
        }
        this.closeDiscountModal();
        if (!this.editingDiscount) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  //Delete discount
  async deleteDiscount(): Promise<void> {
    if (this.discountToDeleteDetails && this.discountToDeleteDetails.discountID !== undefined) {
      await this.discountService.deleteDiscount(this.discountToDeleteDetails.discountID);
      this.discounts = this.discounts.filter(discount => discount.discountID !== this.discountToDeleteDetails.discountID);
      this.closeDeleteModal();
    } else {
      console.log("Discount to delete is null, undefined, or has an undefined discountID property.");
    }
  }

    // Discount END-----------------------------------------------------------------------------------------------------.>

}
  





