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

  openAddVarietalModal() {
    this.editingVarietal = false;
    this.currentVarietal = new Varietal();
    this.showVarietalModal = true;
  }

  openEditVarietalModal(id: number) {
    this.editingVarietal = true;
    this.currentVarietal = JSON.parse(JSON.stringify(this.varietals.find(varietal => varietal.varietalID === id)!));
    this.showVarietalModal = true;
  }

  closeVarietalModal() {
    this.showVarietalModal = false;
  }

  openDeleteVarietalModal(varietal: any): void {
    this.varietalToDelete = varietal.VarietalID;
    this.varietalToDeleteDetails = varietal;
    this.showDeleteVarietalModal = true;
  }

  closeDeleteVarietalModal(): void {
    this.showDeleteVarietalModal = false;
  }

  async submitVarietalForm(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        if (this.editingVarietal) {
          await this.varietalService.updateVarietal(this.currentVarietal.varietalID!, this.currentVarietal);
          const index = this.varietals.findIndex(varietal => varietal.varietalID === this.currentVarietal.varietalID);
          if (index !== -1) {
            this.varietals[index] = this.currentVarietal;
          }
          this.toastr.success('Varietal has been updated successfully.', 'Successful');
        } else {
          const data = await this.varietalService.addVarietal(this.currentVarietal);
          this.varietals.push(data);
          this.toastr.success('Varietal has been added successfully.', 'Successful');
        }
        this.closeVarietalModal();
        if (!this.editingVarietal) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('An error occurred, please try again.', 'Error');
      }
    }
  }

  async deleteVarietal(): Promise<void> {
    try {
      await this.varietalService.deleteVarietal(this.varietalToDeleteDetails.varietalID);
      this.varietals = this.varietals.filter(varietal => varietal.varietalID !== this.varietalToDeleteDetails.varietalID);
      this.closeDeleteVarietalModal();
      this.toastr.success('Varietal deleted successfully.', 'Successful');
    } catch (error) {
      console.error(error);
    
        this.toastr.warning('An error occurred, varietal referenced by wine.', 'Error');
      
      this.closeDeleteVarietalModal();
    }
  }
}
