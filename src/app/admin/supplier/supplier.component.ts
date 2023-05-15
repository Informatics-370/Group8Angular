import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/Model/supplier';
import { SupplierService } from '../services/supplier.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})

export class SupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  showModal: boolean = false;
  editingSupplier: boolean = false;
  currentSupplier: Supplier = new Supplier();
  
  constructor(private supplierService: SupplierService, private router: Router) {}

  //When the page is called these methods are automatically called
  ngOnInit(): void {
    this.loadSuppliers();
  }

  //retrieves all the information in the Supplier table from the database and stores it in the suppliers array.
  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => this.suppliers = data,
      error: (error: any) => console.error(error)
    });
  }

  isDuplicateSupplier(supplier: Supplier): boolean {
    return this.suppliers.some(item => item.name === supplier.name && item.phonenumber === supplier.phonenumber && item.email === supplier.email);
  }

  // The openAddSupplierModal() function is called when the "Add Supplier" button is clicked, 
  //which opens a modal window for adding a new Supplier record.
  openAddSupplierModal() {
    this.editingSupplier = false;
    this.currentSupplier = new Supplier();
    this.showModal = true;
  }

  //The openEditSupplierModal() function is called when the user clicks the "Edit" button in the table. 
  //This function opens the modal window with the selected Supplier record's details and allows the user to edit the record.
  openEditSupplierModal(id: number) {
    this.editingSupplier = true;
    this.currentSupplier = this.suppliers.find(supplier => supplier.supplierid === id)!;
    this.showModal = true;
  }
//The closeSupplierModal() function is called when the user clicks the "Close" button in the modal window. 
//This function simply closes the modal window.
  closeSupplierModal() {
    this.showModal = false;
  }

  //The submitSupplierForm() function is called when the user submits the form in the modal window. This function saves the 
  //new or edited Supplier record to an array of Supplier records and closes the modal window.
  submitSupplierForm(form: NgForm): void {
    if (form.valid) {
      if (this.editingSupplier) {


        // Update Supplier
        this.supplierService.updateSupplier(this.currentSupplier.supplierid!, this.currentSupplier).subscribe({
          next: () => {
            const index = this.suppliers.findIndex(supplier => supplier.supplierid === this.currentSupplier.supplierid);
            if (index !== -1) {
              this.suppliers[index] = this.currentSupplier;
            }
            this.closeSupplierModal();
          },
          error: (error: any) => console.error(error)
        });
      } else {

        
        // Check for duplicate Supplier entries before adding
        if (this.isDuplicateSupplier(this.currentSupplier)) {
          alert('Supplier with the same name, phone number or email already exists!');
        } else {
          this.supplierService.addSupplier(this.currentSupplier).subscribe({
            next: (data: Supplier) => {
              this.suppliers.push(data);
              this.closeSupplierModal();
              form.resetForm();
            },
            error: (error: any) => console.error(error)
          });
        }
      }
    }
  }
  

  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => this.suppliers = this.suppliers.filter(supplier => supplier.supplierid !== id),
      error: (error: any) => console.error(error)
    });
  }
}
