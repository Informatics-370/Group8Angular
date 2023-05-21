import { Component, OnInit } from '@angular/core';
import { Blacklist } from 'src/app/Model/blacklist';
import { BlacklistService } from '../services/blacklist.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit{

    blacklistC: Blacklist[] = [];
    showBlacklistModal: boolean = false;
    editingBlacklistC: boolean = false;
    currentBlacklistC: Blacklist = new Blacklist();
    blacklistCToDelete: any = null;
    blacklistCToDeleteDetails: any;
    showDeleteBlacklistCModal = false;
    
    constructor(private blacklistService: BlacklistService, private router: Router, private toastr: ToastrService) {}


// **********************************************************When the page is called these methods are automatically called*************************************************
    
ngOnInit(): void {
      this.loadBlacklistCs();
    }

// **********************************************************When the page is called these methods are automatically called*************************************************
  
  
// ****************** Methods to display the list of Blacklisted Customers. ************************************************************************************************
   
async loadBlacklistCs(): Promise<void> {
      try {
        this.blacklistC = await this.blacklistService.getBlacklist();
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, failed to connect to the database', 'Blacklist Table');
      }
      };
      
// ****************** Methods to display the list of Blacklisted Customers. ************************************************************************************************



//******************* Modal-related methods *********************************************************************************************************************************


//******************* Add/Edit Modal-related methods *********************************************************************************************************************************

openAddBlacklistCModal() {
  this.editingBlacklistC = false;
  this.currentBlacklistC = new Blacklist();
  this.showBlacklistModal = true;
}

closeBlacklistCModal() {
  this.showBlacklistModal = false;
}

openEditBlacklistCModal(id: number) {
  console.log('Opening edit Blacklist customer modal for ID:', id);
  this.editingBlacklistC = true;

  const originalBlacklistC = this.blacklistC.find(x => x.blacklistID === id);
    if (originalBlacklistC) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentBlacklistC = {...originalBlacklistC};
    }

    this.showBlacklistModal = true;
}

async submitBlacklistCForm(form: NgForm): Promise<void> {
  console.log('Submitting form with editing Blacklist flag:', this.editingBlacklistC);
  if (form.valid) {
    try {
      if (this.editingBlacklistC) {
        // Update Blacklist Customer
        await this.blacklistService.updateBlacklistC(this.currentBlacklistC.blacklistID!, this.currentBlacklistC);
        const index = this.blacklistC.findIndex(x => x.blacklistID === this.currentBlacklistC.blacklistID);
        if (index !== -1) {
          this.blacklistC[index] = this.currentBlacklistC;
        }
        this.toastr.success('Successfully updated', 'Customer');
      } else {
        // Add Blacklist Customer
        const data = await this.blacklistService.addBlacklistC(this.currentBlacklistC);
        this.blacklistC.push(data);
        this.toastr.success('Successfully added', 'Customer');
      }
      this.closeBlacklistCModal();
      if (!this.editingBlacklistC) {
        form.resetForm();
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Error occurred please try again', 'Customer');
    }
  }
}

//******************* Add/Edit Modal-related methods *********************************************************************************************************************************


//******************* Delete Modal-related methods *********************************************************************************************************************************

openDeleteBlacklistCModal(blacklistCustomer: any): void {
  this.blacklistCToDelete = blacklistCustomer.blacklistID;
  console.log("Blacklist Customer : ", this.blacklistCToDelete)
  this.blacklistCToDeleteDetails = blacklistCustomer;
  this.showDeleteBlacklistCModal = true;
}

closeDeleteBlacklistCModal(): void {
  this.showDeleteBlacklistCModal = false;
}

async deleteBlacklistC(): Promise<void> {
  if (this.blacklistCToDeleteDetails && this.blacklistCToDeleteDetails.blacklistID !== undefined) {
    try{
    await this.blacklistService.deleteBlacklistC(this.blacklistCToDeleteDetails.blacklistID);
    this.blacklistC = this.blacklistC.filter(x => x.blacklistID !== this.blacklistCToDeleteDetails.blacklistID);
    this.toastr.success('Successfully removed', 'Customer');
    this.closeDeleteBlacklistCModal();
    }catch (error){ 
    this.toastr.error('Removal failed, please try again', 'Error');
    console.log("Blacklist Customer to remove is null, undefined, or has an undefined BlacklistID property.");
  }  
}
}

//******************* Delete Modal-related methods *********************************************************************************************************************************


//******************* Modal-related methods *********************************************************************************************************************************

} 
