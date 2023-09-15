import { Component, OnInit } from '@angular/core';
import { EarlyBirdService } from '../services/earlybird.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-early-bird',
  templateUrl: './early-bird.component.html',
  styleUrls: ['./early-bird.component.css']
})


export class EarlyBirdComponent implements OnInit {
  earlyBirds: EarlyBird[] = [];
  currentEarlyBird: EarlyBird = new EarlyBird();
  showEarlyBirdModal: boolean = false;
  editingEarlyBird: boolean = false;
  showDeleteEarlyBirdModal = false;
  earlyBirdToDeleteDetails: any;
  earlyBirdToDelete: any = null;
  isSaving = false;
  searchText: string = '';
  filteredBirds: EarlyBird[] = [];

  constructor(private earlyBirdService: EarlyBirdService, private toastr : ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService){ }

  ngOnInit(): void {
    // you can load initial data here if needed.
    this.loadEarlyBirds();
    this.userDetails = this.dataService.getUserFromToken();
      this.loadUserData();
  }

  async loadEarlyBirds(): Promise<void> {
    try {
      this.earlyBirds = await this.earlyBirdService.getEarlyBirds();
     
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Early Bird Table');
    }
  }

  openAddEarlyBirdModal() {
    this.editingEarlyBird = false;
    this.currentEarlyBird = new EarlyBird();
    this.showEarlyBirdModal = true;
  }

  openEditEarlyBirdModal(id: number) {
    console.log('Opening edit early bird modal for ID:', id);
    this.editingEarlyBird = true;
    // Find the original EarlyBird object
    const originalEarlyBird = this.earlyBirds.find(earlyBird => earlyBird.earlyBirdID === id);
    if (originalEarlyBird) {
      // Clone the original EarlyBird object and assign it to currentEarlyBird
      this.currentEarlyBird = {...originalEarlyBird};
    }
    this.showEarlyBirdModal = true;
}

  closeEarlyBirdModal() {
    this.showEarlyBirdModal = false;
    this.isSaving = false;
  }

  openDeleteEarlyBirdModal(earlyBird: any): void {
    this.earlyBirdToDelete = earlyBird.earlyBirdID;
    console.log("Early Bird : ", this.earlyBirdToDelete)
    this.earlyBirdToDeleteDetails = earlyBird;
    this.showDeleteEarlyBirdModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteEarlyBirdModal = false;
  }

  async submitEarlyBirdForm(form: NgForm): Promise<void> {
    this.isSaving = true;  // Indicate that saving is in progress
    console.log('Submitting form with editingEarlyBird flag:', this.editingEarlyBird);
    
    if (form.valid) {
      try {
        if (this.editingEarlyBird) {
          await this.earlyBirdService.updateEarlyBird(this.currentEarlyBird.earlyBirdID!, this.currentEarlyBird);
          const index = this.earlyBirds.findIndex(earlyBird => earlyBird.earlyBirdID === this.currentEarlyBird.earlyBirdID);
          if (index !== -1) {
            this.earlyBirds[index] = this.currentEarlyBird;
          }
          this.toastr.success('Successfully updated', 'Update');
        } else {
          const data = await this.earlyBirdService.addEarlyBird(this.currentEarlyBird);
          this.earlyBirds.push(data);
          this.toastr.success('Successfully added', 'Add');
        }
        this.closeEarlyBirdModal();
        if (!this.editingEarlyBird) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, please try again');
      } finally {
        this.isSaving = false;  // Reset isSaving to false
      }
    } else {
      this.isSaving = false;  // Reset isSaving to false if form is invalid
    }
  }
  

  async deleteEarlyBird(): Promise<void> {
    this.isSaving = true;  // Indicate that deletion is in progress
    if (this.earlyBirdToDelete !== null) {
      try {
        await this.earlyBirdService.deleteEarlyBird(this.earlyBirdToDelete);
        console.log(this.earlyBirdToDelete);
        this.earlyBirds = this.earlyBirds.filter(earlyBird => earlyBird.earlyBirdID !== this.earlyBirdToDelete);
        this.toastr.success('Successfully deleted', 'Delete');
      } catch (error) {
        console.error('Error deleting EarlyBird:', error);
        this.toastr.warning('An error occurred, early bird referenced by wine.', 'Error');
        this.closeDeleteModal();  // Explicitly close the modal on error
      } finally {
        this.isSaving = false;  // Reset isSaving to false
        this.closeDeleteModal();  // Close the modal whether or not an error occurred
      }
    } else {
      this.isSaving = false;  // Reset isSaving to false if there's nothing to delete
    }
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
      'Early Bird: ' + (this.editingEarlyBird ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }

  searchBirds() {
    this.filteredBirds = this.earlyBirds.filter((earlyBird) =>
      earlyBird.percentage?.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
      earlyBird.limit?.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
}
