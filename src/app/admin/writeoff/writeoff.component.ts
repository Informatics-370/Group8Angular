import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { WriteORService } from '../services/writeOffReason.service';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-writeoff',
  templateUrl: './writeoff.component.html',
  styleUrls: ['./writeoff.component.css']
})
export class WriteoffComponent {
  writeOffReason: WriteOffReason[] = [];
  showWORModal: boolean = false;
  editingWOR: boolean = false;
  currentWOR: WriteOffReason = new WriteOffReason();
  wORToDelete: any = null;
  wORToDeleteDetails: any;
  showDeleteWORModal = false;

  constructor(private writeORService: WriteORService, private router: Router, private toastr: ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.loadWORs();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }


  async loadWORs(): Promise<void> {
    try {
      this.writeOffReason = await this.writeORService.getWriteORs();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Write-Off Reason Table');
    }
    };

    
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
    'Write-Off Reason: ' + (this.editingWOR ? 'Updated' : 'Added');
  this.AddAuditLog(auditLogMessage);
}
}
