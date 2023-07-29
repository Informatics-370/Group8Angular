import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WriteOffReason } from 'src/app/Model/writeOffReason';
import { WriteORService } from '../services/writeOffReason.service';

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

  constructor(private writeORService: WriteORService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadWORs()
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
}
