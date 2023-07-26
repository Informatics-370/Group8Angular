import { Component, OnInit } from '@angular/core';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { WriteORService } from '../services/writeOffReason.service';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Inventory } from 'src/app/Model/inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit{

  // Inventory Variables
    inventory: Inventory[] = [];
    showInventoryModal: boolean = false;
    editingInventory: boolean = false;
    currentInventory: Inventory = new Inventory();
    inventoryToDelete: any = null;
    inventoryToDeleteDetails: any;
    showDeleteInventoryModal = false;
  // Inventory Variables

  // Write Off Reasons Variables
    writeOffReason: WriteOffReason[] = [];
    showWORModal: boolean = false;
    editingWOR: boolean = false;
    currentWOR: WriteOffReason = new WriteOffReason();
    wORToDelete: any = null;
    wORToDeleteDetails: any;
    showDeleteWORModal = false;
    // Write Off Reasons Variables
    

    constructor(private writeORService: WriteORService, private router: Router, private toastr: ToastrService, private inventoryService: InventoryService) {}

// **********************************************************When the page is called these methods are automatically called*************************************************

    ngOnInit(): void {
      this.loadWORs();
      this.loadInventory();
    }

// **********************************************************When the page is called these methods are automatically called*************************************************


// ****************** Methods to display *****************************************************************************************************


    async loadWORs(): Promise<void> {
      try {
        this.writeOffReason = await this.writeORService.getWriteORs();
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, please try again', 'Write-Off Reason Table');
      }
      };

      async loadInventory(): Promise<void> {
        try {
          this.inventory = await this.inventoryService.getFullInventory();
        } catch (error) {
          console.error(error);
          this.toastr.error('Error, please try again', 'Inventory Table');
        }
        };

// ****************** Methods to display *****************************************************************************************************


//******************* Inventory Modal-related methods *********************************************************************************************************************************

openAddInventoryModal() {
  this.editingInventory = false;
  this.currentInventory = new Inventory();
  this.showInventoryModal = true;
}

closeInventoryModal() {
  this.showInventoryModal = false;
}

// openEditInventoryModal(id: number) {
//   console.log('Opening edit Inventory modal for ID:', id);
//   this.editingInventory = true;

//   const originalInventory = this.inventory.find(x => x.inventoryID === id);
//     if (originalInventory) {
//       // Clone the original Inventory Details object and assign it to currentInventory
//       //this.currentInventory = {...originalInventory};
//     }

//     this.showInventoryModal = true;
// }

openEditInventoryModal(id: number) {
  this.editingInventory = true;

  const originalInventory = this.inventory.find(x => x.inventoryID === id);
  if (originalInventory) {
    // Clone the original Customer Details object and assign it to currentBlacklistC
    this.currentInventory = {...originalInventory};
  }
  this.showInventoryModal = true;
}

async submitInventoryForm(form: NgForm): Promise<void> {
  console.log('Submitting form with editing Inventory flag:', this.editingInventory);
  if (form.valid) {
    try {
      if (this.editingInventory) {
        // Update WriteOffReason 
        await this.inventoryService.updateInventory(this.currentInventory.inventoryID!, this.currentInventory);
        const index = this.inventory.findIndex(x => x.inventoryID === this.currentInventory.inventoryID);
        if (index !== -1) {
          this.inventory[index] = this.currentInventory;
        }
        this.toastr.success('Successfully updated', 'Inventory Reason');
      } else {
        // Add WriteOffReason 
        const data = await this.inventoryService.addInventory(this.currentInventory);
        this.inventory.push(data);
        this.toastr.success('Successfully added', 'Inventory Reason');
      }
      this.closeInventoryModal();
      if (!this.editingInventory) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Error occurred, please try again', 'Inventory Reason');
      this.closeInventoryModal();
    }
  }
}

openDeleteInventoryModal(inv: any): void {
  this.inventoryToDelete = inv.inventoryID;
  console.log("Inventory : ", this.inventoryToDelete)
  this.inventoryToDeleteDetails = inv;
  this.showDeleteInventoryModal = true;
}

closeDeleteInventoryModal(): void {
  this.showDeleteInventoryModal = false;
}

async deleteInventory(): Promise<void> {
  if (this.inventoryToDeleteDetails && this.inventoryToDeleteDetails.inventoryID !== undefined) {
    try{
    await this.writeORService.deleteWriteOR(this.inventoryToDeleteDetails.inventoryID);
    this.inventory = this.inventory.filter(x => x.inventoryID !== this.inventoryToDeleteDetails.inventoryID);
    this.toastr.success('Successfully deleted', 'Write-Off Reason');
  } catch (error) {
    this.toastr.error('Deletion failed, please try again', 'Error');
    console.log("Write off Reason to Delete is null, undefined, or has an undefined inventoryID property.");
  }
  this.closeDeleteInventoryModal();
}
}

//******************* Inventory Modal-related methods *********************************************************************************************************************************

//******************* Write off Reason Modal-related methods *********************************************************************************************************************************

openAddWORModal() {
  this.editingWOR = false;
  this.currentWOR = new WriteOffReason();
  this.showWORModal = true;
}

closeWORModal() {
  this.showWORModal = false;
}

openEditWORModal(id: number) {
  console.log('Opening edit Write Off Reason modal for ID:', id);
  this.editingWOR = true;

  const originalWOR = this.writeOffReason.find(x => x.writeOff_ReasonID === id);
    if (originalWOR) {
      // Clone the original WOR Details object and assign it to currentWOR
      this.currentWOR = {...originalWOR};
    }

    this.showWORModal = true;
}

async submitWORForm(form: NgForm): Promise<void> {
  console.log('Submitting form with editing Write Off Reason flag:', this.editingWOR);
  if (form.valid) {
    try {
      if (this.editingWOR) {
        // Update WriteOffReason 
        await this.writeORService.updateWriteOR(this.currentWOR.writeOff_ReasonID!, this.currentWOR);
        const index = this.writeOffReason.findIndex(x => x.writeOff_ReasonID === this.currentWOR.writeOff_ReasonID);
        if (index !== -1) {
          this.writeOffReason[index] = this.currentWOR;
        }
        this.toastr.success('Successfully updated', 'Write-Off Reason');
      } else {
        // Add WriteOffReason 
        const data = await this.writeORService.addWriteOR(this.currentWOR);
        this.writeOffReason.push(data);
        this.toastr.success('Successfully added', 'Write-Off Reason');
      }
      this.closeWORModal();
      if (!this.editingWOR) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Error occurred, please try again', 'Write-Off Reason');
      this.closeWORModal();
    }
  }
}


openDeleteWORModal(writeOffR: any): void {
  this.wORToDelete = writeOffR.writeOff_ReasonID;
  console.log("Write Off Reason : ", this.wORToDelete)
  this.wORToDeleteDetails = writeOffR;
  this.showDeleteWORModal = true;
}

closeDeleteWORModal(): void {
  this.showDeleteWORModal = false;
}

async deleteWOR(): Promise<void> {
  if (this.wORToDeleteDetails && this.wORToDeleteDetails.writeOff_ReasonID !== undefined) {
    try{
    await this.writeORService.deleteWriteOR(this.wORToDeleteDetails.writeOff_ReasonID);
    this.writeOffReason = this.writeOffReason.filter(x => x.writeOff_ReasonID !== this.wORToDeleteDetails.writeOff_ReasonID);
    this.toastr.success('Successfully deleted', 'Write-Off Reason');
  } catch (error) {
    this.toastr.error('Deletion failed, please try again', 'Error');
    console.log("Write off Reason to Delete is null, undefined, or has an undefined writeOff_ReasonID property.");
  }
  this.closeDeleteWORModal();
}
}

//******************* Write off Reason Modal-related methods *********************************************************************************************************************************


//******************* Modal-related methods *********************************************************************************************************************************

}
