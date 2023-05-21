import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WinetypeService } from '../services/winetype.service';
import { WineType } from 'src/app/Model/winetype';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent {

constructor(private toastr : ToastrService, private router: Router,  private winetypeService: WinetypeService) { }


ngOnInit(): void {
  this.loadWinetypes();
}

  //Winetype variables needed
  winetypes: WineType[] = [];
  currentWinetype: WineType = new WineType();
  showWinetypeModal: boolean = false;
  editingWinetype: boolean = false;
  showDeleteWinetypeModal = false;
  winetypeToDeleteDetails: any;
  winetypeToDelete: any = null;

async loadWinetypes(): Promise<void> {
  try {
    this.winetypes = await this.winetypeService.getWinetypes();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Type Table');
  }
}


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
        // Toastr success message for update
        this.toastr.success('Winetype has been updated successfully.', 'Successful');
      } else {
        // Add Winetype
        const data = await this.winetypeService.addWinetype(this.currentWinetype);
        this.winetypes.push(data);
        // Toastr success message for addition
        this.toastr.success('Winetype has been added successfully.', 'Successful');
      }
      this.closeWinetypeModal();
      if (!this.editingWinetype) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      // Toastr error message
      this.toastr.error('An error occurred, please try again.', 'Error');
    }
  }
}


// Delete Winetype
async deleteWinetype(): Promise<void> {
    // Delete the winetype if there are no referencing wines
    await this.winetypeService.deleteWinetype(this.winetypeToDeleteDetails.wineTypeID);
    this.winetypes = this.winetypes.filter(winetype => winetype.wineTypeID !== this.winetypeToDeleteDetails.wineTypeID);
    this.closeDeleteWineTypeModal();
    this.toastr.success('Varietal deleted successfully.', 'Successful');
    console.log("Winetype to delete is null, undefined, or has an undefined WinetypeID property.");
  }
}

