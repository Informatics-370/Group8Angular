import { Component } from '@angular/core';
import { VAT } from 'src/app/Model/vat';
import { VatService } from '../services/vat.service';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent {
  vats: VAT[] = [];

  constructor(private vatService: VatService) { }

  ngOnInit(): void {
    this.loadVATs();
  }

  loadVATs(): void {
    this.vatService.getVATs().subscribe({
      next: (data: VAT[]) => this.vats = data,
      error: (error: any) => console.error(error)
    });
  }

  // Add methods for handling edit and delete actions here
    // Add methods for handling edit and delete actions here
    editVAT(id: number): void {
      console.log('Edit VAT with id:', id);
      // Implement your edit functionality here
    }
  
    deleteVAT(id: number): void {
      console.log('Delete VAT with id:', id);
      // Implement your delete functionality here
    }
}
