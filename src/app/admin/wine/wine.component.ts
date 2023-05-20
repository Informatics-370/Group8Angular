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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
  
})

export class WineComponent implements OnInit {


  constructor(private toastr : ToastrService, private discountService: DiscountService, private router: Router, private wineService: WineService, private winetypeService: WinetypeService, private varietalService: VarietalService) { }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadVarietals();
    this.loadWines();
    this.loadWinetypes();
  }

  //--------------------------------------------------------------------------------------------------------------------------------
  //Methods to display the Wines, WineTypes and WineVarietals in the tables


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
  async loadDiscounts(): Promise<void> {
    try {
      this.discounts = await this.discountService.getDiscounts();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Discount Table');
    }
  }
  //--------------------------------------------------------------------------------------------------------------------------------

  //Wine----------------------------------------------------------------------------------------------------------------------------.>
  // Wine variables needed
wines: Wine[] = [];
currentWine: Wine = new Wine();
showWineModal: boolean = false;
editingWine: boolean = false;
showDeleteWineModal = false;
wineToDeleteDetails: any;
wineToDelete: any = null;

//save wine picture
onFileSelected(event: any) {
  const file: File = event.target.files[0];
  this.currentWine.imageFile = file;
}

// Modal-related methods
openAddWineModal() {
  this.editingWine = false;
  this.currentWine = new Wine();
  this.showWineModal = true;
}

openEditWineModal(id: number) {
  console.log('Opening edit wine modal for ID:', id);
  this.editingWine = true;
  this.currentWine = this.wines.find(wine => wine.wineID === id)!;
  this.showWineModal = true;
}

closeWineModal() {
  this.showWineModal = false;
}

openDeleteWineModal(wine: any): void {
  this.wineToDelete = wine.wineID;
  console.log("Wine : ", this.wineToDelete)
  this.wineToDeleteDetails = wine;
  this.showDeleteWineModal = true;
}

closeDeleteWineModal(): void {
  this.showDeleteWineModal = false;
}

// CRUD Wine

// Create and Edit Wine
async submitWineForm(form: NgForm): Promise<void> {
  console.log('Submitting form with editingWine flag:', this.editingWine);
  if (form.valid) {
    try {
      if (this.editingWine) {
        // Update Wine
        await this.wineService.updateWine(this.currentWine.wineID!, this.currentWine);
        const index = this.wines.findIndex(wine => wine.wineID === this.currentWine.wineID);
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

// Delete Wine
async deleteWine(): Promise<void> {
  if (this.wineToDeleteDetails && this.wineToDeleteDetails.wineID !== undefined) {
    await this.wineService.deleteWine(this.wineToDeleteDetails.wineID);
    this.wines = this.wines.filter(wine => wine.wineID !== this.wineToDeleteDetails.wineID);
    this.closeDeleteWineModal();
  } else {
    console.log("Wine to delete is null, undefined, or has an undefined WineID property.");
  }
}
// Wine END-----------------------------------------------------------------------------------------------------.>



  // WINETYPES------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //===================================================================================================================================================================.//


  //Winetype variables needed
  winetypes: WineType[] = [];
  currentWinetype: WineType = new WineType();
  showWinetypeModal: boolean = false;
  editingWinetype: boolean = false;
  showDeleteWinetypeModal = false;
  winetypeToDeleteDetails: any;
  winetypeToDelete: any = null;


  // Modal-related methods
  openAddWinetypeModal() {
    this.editingWinetype = false;
    this.currentWinetype = new WineType();
    this.showWinetypeModal = true;
  }
  openEditWinetypeModal(id: number) {
    console.log('Opening edit winetype modal for ID:', id);
    this.editingWinetype = true;
    // Create a copy of the Winetype, not reference the same object
    this.currentWinetype = {...this.winetypes.find(winetype => winetype.wineTypeID === id)!};
    this.showWinetypeModal = true;
  }
  
  closeWinetypeModal() {
    this.showWinetypeModal = false;
  }

  openDeleteWinetypeModal(winetype: any): void {
    this.winetypeToDelete = winetype.WinetypeID;
    console.log("Winetype : ", this.winetypeToDelete)
    this.winetypeToDeleteDetails = winetype;
    this.showDeleteWinetypeModal = true;
  }

  closeDeleteWineTypeModal(): void {
    this.showDeleteWinetypeModal = false;
  }

  // CRUD Winetype

  // Create and Edit Winetype
  async submitWinetypeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingWinetype flag:', this.editingWinetype);
    if (form.valid) {
      try {
        if (this.editingWinetype) {
          // Update Winetype
          await this.winetypeService.updateWinetype(this.currentWinetype.wineTypeID!, this.currentWinetype);
          const index = this.winetypes.findIndex(winetype => winetype.wineTypeID === this.currentWinetype.wineTypeID);
          if (index !== -1) {
            this.winetypes[index] = this.currentWinetype;
          }
        } else {
          // Add Winetype
          const data = await this.winetypeService.addWinetype(this.currentWinetype);
          this.winetypes.push(data);
        }
        this.closeWinetypeModal();
        if (!this.editingWinetype) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Delete Winetype
  async deleteWinetype(): Promise<void> {
    if (this.winetypeToDeleteDetails && this.winetypeToDeleteDetails.wineTypeID !== undefined) {
      // Check if there are any wines referencing the winetype
      const winesReferencingWinetype = this.wines.filter(wine => wine.wineTypeID === this.winetypeToDeleteDetails.wineTypeID);
  
      if (winesReferencingWinetype.length > 0) {
        // Display a notification or prevent deletion
        console.log("Cannot delete winetype. There are wines referencing it.");
        return;
      }
  
      // Delete the winetype if there are no referencing wines
      await this.winetypeService.deleteWinetype(this.winetypeToDeleteDetails.wineTypeID);
      this.winetypes = this.winetypes.filter(winetype => winetype.wineTypeID !== this.winetypeToDeleteDetails.wineTypeID);
      this.closeDeleteWineTypeModal();
    } else {
      console.log("Winetype to delete is null, undefined, or has an undefined WinetypeID property.");
    }
  }
  
  // Winetype END-----------------------------------------------------------------------------------------------------.>









  // VARIETALS------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //===================================================================================================================================================================.//


  //Varietal variables needed
  varietals: Varietal[] = [];
  currentVarietal: Varietal = new Varietal();
  showVarietalModal: boolean = false;
  editingVarietal: boolean = false;
  showDeleteVarietalModal = false;
  varietalToDeleteDetails: any;
  varietalToDelete: any = null;


  // Modal-related methods
  openAddVarietalModal() {
    this.editingVarietal = false;
    this.currentVarietal = new Varietal();
    this.showVarietalModal = true;
  }

  openEditVarietalModal(id: number) {
    console.log('Opening edit varietal modal for ID:', id);
    this.editingVarietal = true;
    // We need to make a copy of the varietal, not reference the same object
    this.currentVarietal = {...this.varietals.find(varietal => varietal.varietalID === id)!};
    this.showVarietalModal = true;
  }
  

  closeVarietalModal() {
    this.showVarietalModal = false;
  }

  openDeleteVarietalModal(varietal: any): void {
    this.varietalToDelete = varietal.VarietalID;
    console.log("Varietal : ", this.varietalToDelete)
    this.varietalToDeleteDetails = varietal;
    this.showDeleteVarietalModal = true;
  }

  closeDeleteVarietalModal(): void {
    this.showDeleteVarietalModal = false;
  }

  // CRUD Varietal

  // Create and Edit Varietal
  async submitVarietalForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingVarietal flag:', this.editingVarietal);
    if (form.valid) {
      try {
        if (this.editingVarietal) {
          // Update Varietal
          await this.varietalService.updateVarietal(this.currentVarietal.varietalID!, this.currentVarietal);
          const index = this.varietals.findIndex(varietal => varietal.varietalID === this.currentVarietal.varietalID);
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

  // Delete Varietal
  async deleteVarietal(): Promise<void> {
    if (this.varietalToDeleteDetails && this.varietalToDeleteDetails.varietalID !== undefined) {
      // Check if there are any wines referencing the varietal
      const winesReferencingVarietal = this.wines.filter(wine => wine.varietalID === this.varietalToDeleteDetails.varietalID);
      
      if (winesReferencingVarietal.length > 0) {
        // Display a notification or prevent deletion
        console.log("Cannot delete varietal. There are wines referencing it.");
        return;
      }
  
      // Delete the varietal if there are no referencing wines
      await this.varietalService.deleteVarietal(this.varietalToDeleteDetails.varietalID);
      this.varietals = this.varietals.filter(varietal => varietal.varietalID !== this.varietalToDeleteDetails.varietalID);
      this.closeDeleteVarietalModal();
    } else {
      console.log("Varietal to delete is null, undefined, or has an undefined VarietalID property.");
    }
  }
  

  // <!-- Varietal ------------------------------------------------------------------------------------------------------------------------------------------------------------>





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
    // Find the original Discount object
    const originalDiscount = this.discounts.find(discount => discount.discountID === id);
    if (originalDiscount) {
      // Clone the original Discount object and assign it to currentDiscount
      this.currentDiscount = {...originalDiscount};
    }
    this.showDiscountModal = true;
    }
  closeDiscountModal() {
    this.showDiscountModal = false;
  }

  openDeleteDiscountModal(discount: any): void {
    this.discountToDelete = discount.discountID;
    console.log("Discount : ", this.discountToDelete)
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
            // Update the original Discount object with the changes made to the clone
            this.discounts[index] = this.currentDiscount;
          }
          this.toastr.success('Successfully updated', 'Update');
        } else {
          // Add Discount
          const data = await this.discountService.addDiscount(this.currentDiscount);
          this.discounts.push(data);
          this.toastr.success('Successfully added', 'Add');
        }
        this.closeDiscountModal();
        if (!this.editingDiscount) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, please try again');
      }
    }
  }
  
  async deleteDiscount(): Promise<void> {
    if (this.discountToDelete !== null) {
      try {
        await this.discountService.deleteDiscount(this.discountToDelete);
        console.log(this.discountToDelete);
        this.discounts = this.discounts.filter(discount => discount.discountID !== this.discountToDelete);
        this.toastr.success('Successfully deleted', 'Delete');
      } catch (error) {
        console.error('Error deleting Discount:', error);
        this.toastr.error('Error, please try again', 'Delete');
      }
      this.closeDeleteModal();
    }
  }

  // Discount END-----------------------------------------------------------------------------------------------------.>

}






