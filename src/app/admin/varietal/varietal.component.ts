import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VarietalService } from '../services/varietal.service';
import { Varietal } from 'src/app/Model/varietal';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';
import { WinetypeService } from '../services/winetype.service';
import { WineType } from 'src/app/Model/winetype';


@Component({
  selector: 'app-varietal',
  templateUrl: './varietal.component.html',
  styleUrls: ['./varietal.component.css']
})
export class VarietalComponent {
  wineTypes: WineType[] | undefined;


  constructor(private toastr : ToastrService, private router: Router,  private varietalService: VarietalService, private wineTypeService : WinetypeService,
     private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.loadVarietals();
    this.loadWineTypes();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  varietals: Varietal[] = [];
  currentVarietal: Varietal = new Varietal();
  showVarietalModal: boolean = false;
  editingVarietal: boolean = false;
  showDeleteVarietalModal = false;
  varietalToDeleteDetails: any;
  varietalToDelete: any = null;
  searchText: string = ''; // Property to store the search text
  filteredVarietals: Varietal[] = [];

  async loadVarietals(): Promise<void> {
    try {
      this.varietals = await this.varietalService.getVarietals();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Varietal Table');
    }
  }

  async loadWineTypes(): Promise<void> {
    try {
      this.wineTypes = await this.wineTypeService.getWinetypes();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Wine Types');
    }
  }

  openAddVarietalModal() {
    this.editingVarietal = false;
    this.currentVarietal = new Varietal();
    this.showVarietalModal = true;
  }

  openEditVarietalModal(id: number) {
    this.editingVarietal = true;
    this.currentVarietal = JSON.parse(JSON.stringify(this.varietals.find(varietal => varietal.varietalID === id)!));
    this.showVarietalModal = true;
  }

  closeVarietalModal() {
    this.showVarietalModal = false;
  }

  openDeleteVarietalModal(varietal: any): void {
    this.varietalToDelete = varietal.VarietalID;
    this.varietalToDeleteDetails = varietal;
    this.showDeleteVarietalModal = true;
  }

  closeDeleteVarietalModal(): void {
    this.showDeleteVarietalModal = false;
  }

  async submitVarietalForm(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        if (this.editingVarietal) {
          await this.varietalService.updateVarietal(this.currentVarietal.varietalID!, this.currentVarietal);
          const index = this.varietals.findIndex(varietal => varietal.varietalID === this.currentVarietal.varietalID);
          if (index !== -1) {
            this.varietals[index] = this.currentVarietal;
          }
          this.toastr.success('Varietal has been updated successfully.', 'Successful');
        } else {
          const data = await this.varietalService.addVarietal(this.currentVarietal);
          this.varietals.push(data);
          this.toastr.success('Varietal has been added successfully.', 'Successful');
        }
        this.closeVarietalModal();
        if (!this.editingVarietal) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('An error occurred, please try again.', 'Error');
      }
    }
  }

  async deleteVarietal(): Promise<void> {
    try {
      await this.varietalService.deleteVarietal(this.varietalToDeleteDetails.varietalID);
      this.varietals = this.varietals.filter(varietal => varietal.varietalID !== this.varietalToDeleteDetails.varietalID);
      this.closeDeleteVarietalModal();
      this.toastr.success('Varietal deleted successfully.', 'Successful');
    } catch (error) {
      console.error(error);
    
        this.toastr.warning('An error occurred, varietal referenced by wine.', 'Error');
      
      this.closeDeleteVarietalModal();
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
      'Wine Varietal: ' + (this.editingVarietal ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }

  searchVarietals() {
    this.filteredVarietals = this.varietals.filter((varietal) => {
      const nameMatches = varietal.name?.toLowerCase().includes(this.searchText.toLowerCase());
      const descriptionMatches = varietal.description?.toLowerCase().includes(this.searchText.toLowerCase());
      const wineTypeMatches = varietal.wineType?.name?.toLowerCase().includes(this.searchText.toLowerCase());
  
      // Return true if any of the properties match the search text
      return nameMatches || descriptionMatches || wineTypeMatches;
    });
  }
}
