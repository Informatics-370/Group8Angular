import { Component, OnInit } from '@angular/core';
import { VAT } from 'src/app/Model/vat';
import { VatService } from '../services/vat.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent implements OnInit {
  minDate!: string;
  vats: VAT[] = [];
  showModal: boolean = false;
  editingVat: boolean = false;
  currentVat: VAT = new VAT();
  
  

  constructor(private vatService: VatService, private router: Router) {}

  
  ngOnInit(): void {
    this.loadVATs();
    const today = new Date();
    this.minDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  loadVATs(): void {
    this.vatService.getVATs().subscribe({
      next: (data: VAT[]) => this.vats = data,
      error: (error: any) => console.error(error)
    });
  }

  isDuplicateVAT(vat: VAT): boolean {
    return this.vats.some(item => item.percentage === vat.percentage && item.date === vat.date);
  }

  // Modal-related methods
  openAddVatModal() {
    this.editingVat = false;
    this.currentVat = new VAT();
    this.showModal = true;
  }

  openEditVatModal(id: number) {
    this.editingVat = true;
    this.currentVat = this.vats.find(vat => vat.vatid === id)!;
    this.showModal = true;
  }

  closeVatModal() {
    this.showModal = false;
  }

  submitVatForm(form: NgForm): void {
    if (form.valid) {
      if (this.editingVat) {
        // Update VAT
        this.vatService.updateVAT(this.currentVat.vatid!, this.currentVat).subscribe({
          next: () => {
            const index = this.vats.findIndex(vat => vat.vatid === this.currentVat.vatid);
            if (index !== -1) {
              this.vats[index] = this.currentVat;
            }
            this.closeVatModal();
            // form.resetForm();
            // this.router.navigate(['/vat']).then(() => window.location.reload());
          },
          error: (error: any) => console.error(error)
        });
      } else {
        // Check for duplicate VAT entries before adding
        if (this.isDuplicateVAT(this.currentVat)) {
          alert('VAT with the same percentage and date already exists!');
        } else {
          this.vatService.addVAT(this.currentVat).subscribe({
            next: (data: VAT) => {
              this.vats.push(data);
              this.closeVatModal();
              form.resetForm();
              // this.router.navigate(['/vat']).then(() => window.location.reload());
            },
            error: (error: any) => console.error(error)
          });
        }
      }
    }
  }
  

  deleteVAT(id: number): void {
    this.vatService.deleteVAT(id).subscribe({
      next: () => this.vats = this.vats.filter(vat => vat.vatid !== id),
      error: (error: any) => console.error(error)
    });
  }
}
