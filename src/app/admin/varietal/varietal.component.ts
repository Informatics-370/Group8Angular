import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VarietalService } from '../services/varietal.service';
import { Varietal } from 'src/app/Model/varietal';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-varietal',
  templateUrl: './varietal.component.html',
  styleUrls: ['./varietal.component.css']
})
export class VarietalComponent {

  constructor(private toastr : ToastrService, private router: Router,  private varietalService: VarietalService) { }

  ngOnInit(): void {
    this.loadVarietals();
    
  }
  //Varietal variables needed
  varietals: Varietal[] = [];
  currentVarietal: Varietal = new Varietal();
  showVarietalModal: boolean = false;
  editingVarietal: boolean = false;
  showDeleteVarietalModal = false;
  varietalToDeleteDetails: any;
  varietalToDelete: any = null;

  async loadVarietals(): Promise<void> {
    try {
      this.varietals = await this.varietalService.getVarietals();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Varietal Table');
    }
  }

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
        // Toastr success message for update
        this.toastr.success('Varietal has been updated successfully.', 'Successful');
      } else {
        // Add Varietal
        const data = await this.varietalService.addVarietal(this.currentVarietal);
        this.varietals.push(data);
        // Toastr success message for addition
        this.toastr.success('Varietal has been added successfully.', 'Successful');
      }
      this.closeVarietalModal();
      if (!this.editingVarietal) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      // Toastr error message
      this.toastr.error('An error occurred, please try again.', 'Error');
    }
  }
}


  // Delete Varietal
  async deleteVarietal(): Promise<void> {
      // Delete the varietal if there are no referencing wines
      await this.varietalService.deleteVarietal(this.varietalToDeleteDetails.varietalID);
      this.varietals = this.varietals.filter(varietal => varietal.varietalID !== this.varietalToDeleteDetails.varietalID);
      this.closeDeleteVarietalModal();
      this.toastr.success('Varietal deleted successfully.', 'Successful');
      console.log("Varietal to delete is null, undefined, or has an undefined VarietalID property.");
    }
  }
  
