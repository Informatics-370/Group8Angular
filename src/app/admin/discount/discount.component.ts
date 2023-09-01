import { Component } from '@angular/core';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent {

constructor(private toastr : ToastrService, private router: Router,  private discountService: DiscountService
  , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) { }

ngOnInit(): void {
  this.loadDiscounts();
  this.userDetails = this.dataService.getUserFromToken();
      this.loadUserData();
}

async loadDiscounts(): Promise<void> {
  try {
    this.discounts = await this.discountService.getDiscounts();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Discount Table');
  }
}
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


  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;

  loadUserData() {
    const userEmail = this.userDetails?.email;

    if (userEmail != null) {
      this.customerService.GetCustomer(userEmail).subscribe(
        (result: any) => {
          console.log(result);
          // Access the user object within the result
          this.user = result.user; // Assign the user data to the variable
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load user data.');
        }
      );
    }
  }

  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
  }

  onSubmitClick() {
    const auditLogMessage = 'Discount: ' + (this.editingDiscount ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
}

}
