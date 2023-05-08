import { Component, OnInit } from '@angular/core';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
})
export class WineComponent implements OnInit {

  discounts: Discount[] = [];
  showModal: boolean = false;
  editingDiscount: boolean = false;
  currentDiscount: Discount = new Discount();

  constructor(private discountService: DiscountService, private router: Router) { }

  ngOnInit(): void {
    this.loadDiscounts();

  }


  async loadDiscounts(): Promise<void> {
    try {
      this.discounts = await this.discountService.getDiscounts();
    } catch (error) {
      console.error(error);
    }
  }

  // Modal-related methods
  openAddDiscountModal() {
    this.editingDiscount = false;
    this.currentDiscount = new Discount();
    this.showModal = true;
  }

  openEditDiscountModal(id: number) {
    console.log('Opening edit discount modal for ID:', id);
    this.editingDiscount = true;
    this.currentDiscount = this.discounts.find(discount => discount.discountID === id)!;
    this.showModal = true;
  }

  closeDiscountModal() {
    this.showModal = false;
  }



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
  
  
  

  async deleteDiscount(id: number): Promise<void> {
    try {
      await this.discountService.deleteDiscount(id);
      this.discounts = this.discounts.filter(discount => discount.discountID !== id);
    } catch (error) {
      console.error(error);
    }
  }
 }






