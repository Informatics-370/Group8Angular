import { Component, OnInit } from '@angular/core';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { WriteORService } from '../services/writeOffReason.service';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Inventory } from 'src/app/Model/inventory';
import { Wine } from 'src/app/Model/wine';
import { WineService } from '../services/wine.service';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';
import { WinetypeService } from '../services/winetype.service';
import { VarietalService } from '../services/varietal.service';
import * as XLSX from 'xlsx';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';





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



    allWines: Wine[] = [];
    currentWine: Wine = new Wine();
    wines: Wine[] = [];
    name: string ='';
    searchQuery: string = '';
    winetypes: WineType[] = []; 
    varietals: Varietal[] = []; 

    

    constructor(private writeORService: WriteORService,
                private router: Router,
                private toastr: ToastrService,
                private inventoryService: InventoryService,
                private wineService: WineService,
                private winetypeService: WinetypeService,
                private varietalService: VarietalService
                , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService
               ) {}

// **********************************************************When the page is called these methods are automatically called*************************************************

    ngOnInit(): void {
      this.loadWORs();
      this.loadInventory();
      this.loadWines();
      this.populateExcelArray();
      this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
    }

// **********************************************************When the page is called these methods are automatically called*************************************************



getWineName(wineID: number): string {
  const wine = this.wines.find(w => w.wineID === wineID);
  return wine ? wine.name : 'N/A';
}

getVarietalName(varietalID: number): string {
  let varietal = this.varietals.find(x => x.varietalID == varietalID);
  return varietal?.name || 'Unknown';
}

getWinetypeName(wineTypeID?: number): string {
  let winetype = this.winetypes.find(x => x.wineTypeID == wineTypeID);  
  return winetype?.name || 'Unknown';
}

updateFieldsBasedOnWineName(wineID: number): void {
  console.log('Selected Wine ID:', wineID);
  let selectedWine = this.allWines.find(x => x.wineID == (wineID));
  console.log('All Wines:', this.allWines);
  console.log('Selected Wine:', selectedWine);
  console.log(this.currentInventory)
  if (selectedWine) {
    // this.varietalService.getVarietal(selectedWine.varietalID);
    // this.winetypeService.getWinetype(selectedWine.wineTypeID);
    this.getWinetypeName(selectedWine.wineTypeID);
    this.getVarietalName(selectedWine.varietalID);
    this.currentInventory.wineTypeID = selectedWine.wineTypeID; // Update wineType
    this.currentInventory.varietalID = selectedWine.varietalID; // Update varietal
    this.currentInventory.wine = selectedWine; // Update wine
  }
  console.log(this.currentInventory)
}




getWinePrice(wineID: number): number {
  const wine = this.wines.find(w => w.wineID === wineID);
  return wine ? wine.price : 0;
}



async loadWines(): Promise<void> {
  try {
    this.allWines = await this.wineService.getWines();
    //console.log('All Wines:', this.allWines);
    this.winetypes = await this.winetypeService.getWinetypes();
    this.varietals = await this.varietalService.getVarietals();
    this.filterWines();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Wine Table');
  }
}


filterWines(): void {
  if (this.searchQuery.trim() !== '') {
    const query = this.searchQuery.toLowerCase().trim();
    this.wines = this.allWines.filter(wine =>
      wine.name.toLowerCase().includes(query) ||
      wine.vintage.toString().includes(query) ||
      wine.varietalID.toString().includes(query) ||
      wine.wineTypeID.toString().includes(query) ||
      wine.price.toString().includes(query)
    );
  } else {
    this.wines = [...this.allWines]; // if searchQuery is empty, show all wines
  }
}










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
  this.getVarietalName(this.currentInventory.varietalID);
  this.getWinePrice(this.currentInventory.wineID);
  this.getWinetypeName(this.currentInventory.wineTypeID);
  this.showInventoryModal = true;
}

async submitInventoryForm(form: NgForm): Promise<void> {
  console.log('Submitting form with editing Inventory flag:', this.editingInventory);
  if (form.valid) {
    try {
      if (this.editingInventory) {
        // Update inventory 
        console.log(this.currentInventory);
        await this.inventoryService.updateInventory(this.currentInventory.inventoryID!, this.currentInventory);
        const index = this.inventory.findIndex(x => x.inventoryID === this.currentInventory.inventoryID);
        if (index !== -1) {
          this.inventory[index] = this.currentInventory;
        }
        this.toastr.success('Successfully updated', 'Inventory');
      } else {
        // Add inventory
        const data = await this.inventoryService.addInventory(this.currentInventory);
        this.inventory.push(data);
        this.loadInventory();
        this.toastr.success('Successfully added', 'Inventory');
      }
      this.closeInventoryModal();
      if (!this.editingInventory) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Error occurred, please try again', 'Inventory');
      this.closeInventoryModal();
    }
  }
}

//******************* Delete Modal-related methods *********************************************************************************************************************************

openDeleteInventoryModal(inventory: any): void {
  this.inventoryToDelete = inventory.inventoryID;
  console.log("Inventory : ", this.inventoryToDelete)
  this.inventoryToDeleteDetails = inventory;
  console.log(this.inventoryToDeleteDetails);
  this.showDeleteInventoryModal = true;
}

closeDeleteInventoryModal(): void {
  this.showDeleteInventoryModal = false;
}

async deleteInventory(): Promise<void> {
  if (this.inventoryToDeleteDetails && this.inventoryToDeleteDetails.inventoryID !== undefined) {
    try{
    await this.inventoryService.deleteInventory(this.inventoryToDeleteDetails.inventoryID);
    this.inventory = this.inventory.filter(x => x.inventoryID !== this.inventoryToDeleteDetails.inventoryID);
    this.toastr.success('Successfully deleted', 'Inventory');
  } catch (error) {
    this.toastr.error('Deletion failed, please try again', 'Error');
    console.log("Inventory to Delete is null, undefined, or has an undefined inventoryID property.");
  }
  this.closeDeleteInventoryModal();
}
}

//******************* Delete Modal-related methods *********************************************************************************************************************************

// Function to increase the Quantity on Hand for a specific wine
increaseQuantity(item: any) {
  if (item.quantityOnHand > -1) {
    item.quantityOnHand++;
    // Update the inventory using the service
    this.inventoryService.updateInventory(item.inventoryID, item)
      .then(() => {
        this.toastr.success('Quantity increased successfully', 'Inventory');
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Error occurred while updating quantity', 'Inventory Reason');
      });
  }
}

decreaseQuantity(item: any) {
  if (item.quantityOnHand > 0) {
    item.quantityOnHand--;
    // Update the inventory using the service
    this.inventoryService.updateInventory(item.inventoryID, item)
      .then(() => {
        this.toastr.success('Quantity decreased successfully', 'Inventory');
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Error occurred while updating quantity', 'Inventory Reason');
      });
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







excelarray: any[] =[];

populateExcelArray() {
  this.excelarray = this.inventory.map((x) => {
    return {
      'Wine Name': this.getWineName(x.wineID),
      'Wine Varietal': this.getVarietalName(x.varietalID),
      'Wine Type': this.getWinetypeName(x.wineTypeID),
      'Wine Price': this.getWinePrice(x.wineID),
      'Stock Limit' : x.stockLimit,
      'Quantity On Hand': x.quantityOnHand,
    };
  });
  console.log(this.excelarray)
}

exportexcel(): void {
  this.populateExcelArray();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.excelarray);
  
  // Set column widths (example: wineName width = 20, varietalName width = 15, etc.)
  const columnWidths = [
    { wch: 15 }, // wineName
    { wch: 15 }, // varietalName
    { wch: 15 }, // winetypeName
    { wch: 15 }, // winePrice
    { wch: 15 }, // stockLimit
    { wch: 15 }, // quantityOnHand
  ];
  
  ws['!cols'] = columnWidths;

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Generate an array containing the Excel data
  const excelDataArray = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Create a Blob object from the array data
  const blob = new Blob([excelDataArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // Create a download URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Inventory On Hand.xlsx';
  a.click();

  // Clean up the URL object
  window.URL.revokeObjectURL(url);
}


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
  const auditLogMessage =
    'Inventory on Hand: ' + (this.editingInventory ? 'Updated' : 'Added');
  this.AddAuditLog(auditLogMessage);
}
}
