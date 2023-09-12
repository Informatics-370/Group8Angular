import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WinetypeService } from '../services/winetype.service';
import { WineType } from 'src/app/Model/winetype';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent {

  constructor(private toastr : ToastrService, private router: Router,  private winetypeService: WinetypeService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.loadWinetypes();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  winetypes: WineType[] = [];
  currentWinetype: WineType = new WineType();
  showWinetypeModal: boolean = false;
  editingWinetype: boolean = false;
  showDeleteWinetypeModal = false;
  winetypeToDeleteDetails: any;
  winetypeToDelete: any = null;

  async loadWinetypes(): Promise<void> {
    try {
      this.winetypes = await this.winetypeService.getWinetypes();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Type Table');
    }
  }

  openAddWinetypeModal() {
    this.editingWinetype = false;
    this.currentWinetype = new WineType();
    this.showWinetypeModal = true;
  }

  openEditWinetypeModal(id: number) {
    this.editingWinetype = true;
    this.currentWinetype = JSON.parse(JSON.stringify(this.winetypes.find(winetype => winetype.wineTypeID === id)!));
    this.showWinetypeModal = true;
  }

  closeWinetypeModal() {
    this.showWinetypeModal = false;
  }

  openDeleteWinetypeModal(winetype: any): void {
    this.winetypeToDelete = winetype.WinetypeID;
    this.winetypeToDeleteDetails = winetype;
    this.showDeleteWinetypeModal = true;
  }

  closeDeleteWineTypeModal(): void {
    this.showDeleteWinetypeModal = false;
  }

  async submitWinetypeForm(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        if (this.editingWinetype) {
          await this.winetypeService.updateWinetype(this.currentWinetype.wineTypeID!, this.currentWinetype);
          const index = this.winetypes.findIndex(winetype => winetype.wineTypeID === this.currentWinetype.wineTypeID);
          if (index !== -1) {
            this.winetypes[index] = this.currentWinetype;
          }
          this.toastr.success('Winetype has been updated successfully.', 'Successful');
        } else {
          const data = await this.winetypeService.addWinetype(this.currentWinetype);
          this.winetypes.push(data);
          this.toastr.success('Winetype has been added successfully.', 'Successful');
        }
        this.closeWinetypeModal();
        if (!this.editingWinetype) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('An error occurred, please try again.', 'Error');
      }
    }
  }

  async deleteWinetype(): Promise<void> {
    try {
      await this.winetypeService.deleteWinetype(this.winetypeToDeleteDetails.wineTypeID);
      this.winetypes = this.winetypes.filter(winetype => winetype.wineTypeID !== this.winetypeToDeleteDetails.wineTypeID);
      this.closeDeleteWineTypeModal();
      this.toastr.success('Winetype deleted successfully.', 'Successful');
    } catch (error) {
      console.error(error);
     
      this.toastr.warning('An error occurred, wine type referenced by wine or varietal.', 'Error');
      this.closeDeleteWineTypeModal();
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
      'Wine Type: ' + (this.editingWinetype ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}
