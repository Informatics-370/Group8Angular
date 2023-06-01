import { Component, OnInit } from '@angular/core';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WineService } from '../services/wine.service';
import { VarietalService } from '../services/varietal.service';
import { WinetypeService } from '../services/winetype.service';
import { Wine } from 'src/app/Model/wine';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
  
})

export class WineComponent implements OnInit {

  tempWine: Wine = new Wine();
  constructor(private toastr : ToastrService, private discountService: DiscountService, private router: Router, private wineService: WineService, private winetypeService: WinetypeService, private varietalService: VarietalService) { }

  ngOnInit(): void {
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
      this.toastr.error('Error, please try again', 'Wine Table');
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

  getVarietalName(varietalID: number): string {
    const varietal = this.varietals.find(v => v.varietalID === varietalID);
    return varietal?.name || 'Unknown';
  }
  
  getWinetypeName(wineTypeID: number): string {
    const winetype = this.winetypes.find(w => w.wineTypeID === wineTypeID);
    return winetype?.name || 'Unknown';
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
selectedFile: File | null = null;

wineRestockLimitField = new FormControl('', [
  Validators.required,
  Validators.min(1),
  Validators.max(999),
  Validators.pattern(/^\d+$/)
]);

//save wine picture
onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files !== null) {
    this.selectedFile = target.files[0];
  }
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
  let wineToEdit = this.wines.find(wine => wine.wineID === id);
  if (wineToEdit) {
    this.tempWine = {
      ...wineToEdit,
      wineTypeName: this.getWinetypeName(wineToEdit.wineTypeID),
      varietalName: this.getVarietalName(wineToEdit.varietalID)
    };
    this.currentWine = this.tempWine;
  }
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
      const formData = new FormData();

      for (const key in this.currentWine) {
        if (this.currentWine.hasOwnProperty(key)) {
          formData.append(key, (this.currentWine as any)[key]);
        }
      }

      if (this.editingWine) {
        await this.wineService.updateWine(this.currentWine.wineID!, formData);
        const updatedWine = await this.wineService.getWine(this.currentWine.wineID!); // Fetch the updated wine.
        const index = this.wines.findIndex(wine => wine.wineID === this.currentWine.wineID);
        if (index !== -1) {
          this.wines[index] = updatedWine; // Update the wine in the wines array.
        }
        this.toastr.success('Wine has been updated successfully.', 'Wine Form');
      }  else {
        const createdWine = await this.wineService.addWine(formData);
        this.wines.push(createdWine);
        this.toastr.success('Wine has been added successfully.', 'Wine Form');
      }

      this.closeWineModal();
      form.resetForm();
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Wine Form');
    }
  }
}


// Delete Wine
async deleteWine(): Promise<void> {
  try {
    if (this.wineToDeleteDetails && this.wineToDeleteDetails.wineID !== undefined) {
      await this.wineService.deleteWine(this.wineToDeleteDetails.wineID);
      this.wines = this.wines.filter(wine => wine.wineID !== this.wineToDeleteDetails.wineID);
      // Toastr success message for deletion
      this.toastr.success('Wine has been deleted successfully.', 'Successful');
      this.closeDeleteWineModal();
    } else {
      console.log("Wine to delete is null, undefined, or has an undefined WineID property.");
      // Toastr warning message
      this.toastr.warning('Unable to delete wine, please check the wine details.', 'Error');
    }
  } catch (error) {
    console.error(error);
    // Toastr error message
    this.toastr.error('An error occurred, please try again.', 'Error');
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
    // Create a deep copy of the Winetype, not reference the same object
    this.currentWinetype = JSON.parse(JSON.stringify(this.winetypes.find(winetype => winetype.wineTypeID === id)!));
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
    // We need to make a deep copy of the varietal, not reference the same object
    this.currentVarietal = JSON.parse(JSON.stringify(this.varietals.find(varietal => varietal.varietalID === id)!));
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

}






