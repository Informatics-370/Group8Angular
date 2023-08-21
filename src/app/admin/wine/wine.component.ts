import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  isSaving: boolean = false;
  characterCount: any;
  fileUploaded!: boolean;
  currentWineImageURL: string | undefined;

  constructor(private toastr : ToastrService, private discountService: DiscountService, private router: Router, private wineService: WineService, private winetypeService: WinetypeService, private varietalService: VarietalService, private changeDetector: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.loadVarietals();
    this.loadWines();
    this.loadWinetypes();
  }



  //--------------------------------------------------------------------------------------------------------------------------------
  //Methods to display the Wines, WineTypes and WineVarietals in the tables


  async loadWines(): Promise<void> {
    try {
      this.allWines = await this.wineService.getWines();
      this.filterWines();
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
  allWines: Wine[] = [];
  wines: Wine[] = [];
currentWine: Wine = new Wine();
showWineModal: boolean = false;
editingWine: boolean = false;
showDeleteWineModal = false;
wineToDeleteDetails: any;
wineToDelete: any = null;
selectedFile: File | null = null;
searchQuery: string = '';



wineRestockLimitField = new FormControl('', [
  Validators.required,
  Validators.min(1),
  Validators.max(999),
  Validators.pattern(/^\d+$/)
]);


// onFileSelected(event: Event): void {
//   const target = event.target as HTMLInputElement;
//   if (target.files !== null) {
//     const file: File = target.files[0];
//     const fileType = file.type;

//     // Check if the file type is PNG or JPG
//     if (fileType.match(/image\/*/) === null || (fileType !== 'image/jpeg' && fileType !== 'image/png')) {
//       this.toastr.error('Only PNG or JPG files can be uploaded', 'File Type Error');
//       return; // Exit the method if the file type is not PNG or JPG
//     }

//     // If the file type is PNG or JPG, continue processing
//     this.selectedFile = file;
//   }
// }

onFileSelected(wine: any) {
  if (wine.target.files && wine.target.files[0]) {
    this.selectedFile = wine.target.files[0];
    this.currentWine.filePath = this.selectedFile?.name ?? '';
  }

  if (wine.target.files && wine.target.files.length > 0) {
    this.fileUploaded = true;
  } else {
    this.fileUploaded = false;
  }
}

getObjectURL(file: File): string {
  return URL.createObjectURL(file);
}


// Modal-related methods
openAddWineModal() {
  if (this.varietals.length === 0 || this.winetypes.length === 0) {
    this.toastr.warning('Please add varietal and wine type before adding a wine.', 'Wine Form');
  } else {
    this.editingWine = false;
    this.currentWine = new Wine();
    this.showWineModal = true;
  }
}

openEditWineModal(id: number) {
  //console.log('Opening edit wine modal for ID:', id);
  this.editingWine = true;
  let wineToEdit = this.wines.find(wine => wine.wineID === id);
  this.currentWineImageURL = wineToEdit?.filePath;
  console.log(this.currentWineImageURL)
  if (wineToEdit) {
    this.tempWine = {
      ...wineToEdit,
      wineTypeName: this.getWinetypeName(wineToEdit.wineTypeID),
      varietalName: this.getVarietalName(wineToEdit.varietalID),
      
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

updateDisplay(wine: Wine): void {
  wine.displayWine = !!wine.displayWine;
}

// Create and Edit Wine
async submitWineForm(form: NgForm): Promise<void> {
  this.isSaving = true;
  try {
    const formData = new FormData();

    for (const key in this.currentWine) {
      if (this.currentWine.hasOwnProperty(key)) {
        formData.append(key, (this.currentWine as any)[key]);
      }
    }

    if (this.editingWine) {
      const extractFileName = (path: string): string => {
        const parts = path.split('_');
        return parts[parts.length - 1];
      };

      let oldWineImagePath = this.currentWine.filePath;
      let oldWineImagePathConvert = extractFileName(oldWineImagePath);

      if (this.selectedFile) {
        formData.delete('File');
        formData.delete('filePath');
        formData.append('filePath', "");
        
        if (this.selectedFile.name != oldWineImagePathConvert && this.selectedFile.name.length != 0) {
            formData.append('File', this.selectedFile);
        } else {
            formData.append('File', this.selectedFile);
        }
    } else if(this.selectedFile == null) {
        // If there's no selected file, you shouldn't try to append a null value to FormData.
        formData.delete('File');
        formData.delete('filePath');
        formData.append('filePath', "");
        formData.append('File', oldWineImagePathConvert); // Assuming you want to keep the old path when no new file is selected.
    }

      var wineToUpdate = await this.wineService.getWine(this.currentWine.wineID);
      this.updateDisplay(wineToUpdate);
      console.log(this.currentWine.displayWine);

      await this.wineService.updateWine(this.currentWine.wineID!, formData);
      const updatedWine = await this.wineService.getWine(this.currentWine.wineID!);
      const index = this.wines.findIndex(wine => wine.wineID === this.currentWine.wineID);
        if (index !== -1) {
          this.wines[index] = updatedWine;
        }
      this.changeDetector.detectChanges();
      this.toastr.success('Wine has been updated successfully.', 'Wine Form');
    } else {
      if (this.selectedFile) {
        formData.append('File', this.selectedFile);
      } 
      else {
        // Display toastr notification if no image is uploaded when adding a new wine
        this.toastr.warning('Please upload an image for the new wine.', 'Wine Form');
      }
      
      
      let createdWine = await this.wineService.addWine(formData);
      this.updateDisplay(createdWine);
      this.wines.push(createdWine);
      this.toastr.success('Wine has been added successfully.', 'Wine Form');
    }

    this.closeWineModal();
    form.resetForm();
    this.selectedFile = null;
  } catch (error) {
    console.error('Error:', error);
    this.toastr.error('An error occurred, please try again.', 'Wine Form');
  } finally {
    this.isSaving = false;
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



filterWines(): void {
  if (this.searchQuery.trim() !== '') {
    const query = this.searchQuery.toLowerCase().trim();
    this.wines = this.allWines.filter(wine =>
      wine.name.toLowerCase().includes(query) ||
      wine.vintage.toString().includes(query) ||
      wine.varietalID.toString().includes(query) ||
      wine.wineTypeID.toString().includes(query) ||
      wine.winePrice.toString().includes(query)
    );
  } else {
    this.wines = [...this.allWines]; // if searchQuery is empty, show all wines
  }
}

updateCharacterCount(event: any) {
  this.characterCount = event.target.value.length;
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