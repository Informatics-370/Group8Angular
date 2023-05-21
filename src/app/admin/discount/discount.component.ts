import { Component } from '@angular/core';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent {

constructor(private toastr : ToastrService, private router: Router,  private discountService: DiscountService) { }


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
          this.toastr.success('Successfully updated', 'Successful');
        } else {
          // Add Discount
          const data = await this.discountService.addDiscount(this.currentDiscount);
          this.discounts.push(data);
          this.toastr.success('Successfully added', 'Successful');
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
        this.toastr.success('Successfully deleted', 'Successful');
      } catch (error) {
        console.error('Error deleting Discount:', error);
        this.toastr.error('Error, please try again', 'Delete');
      }
      this.closeDeleteModal();
    }
  }

  // Discount END-----------------------------------------------------------------------------------------------------.>
}
