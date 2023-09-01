import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DiscountService } from '../services/discount.service';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WineService } from '../services/wine.service';
import { VarietalService } from '../services/varietal.service';
import { WinetypeService } from '../services/winetype.service';
import { Wine } from 'src/app/Model/wine';
import { WineType } from 'src/app/Model/winetype';
import { Varietal } from 'src/app/Model/varietal';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';


@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']

})

export class WineComponent implements OnInit {

  tempWine: Wine = new Wine();
  isSaving: boolean = false;
  characterCount: any;
  fileUploaded!: boolean;
  currentWineImageURL: string | undefined;

  constructor(private toastr: ToastrService, private discountService: DiscountService, private router: Router, private wineService: WineService
    , private winetypeService: WinetypeService, private varietalService: VarietalService, private changeDetector: ChangeDetectorRef
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.loadVarietals();
    this.loadWines();
    this.loadWinetypes();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }
  //--------------------------------------------------------------------------------------------------------------------------------
  //Methods to display the Wines, WineTypes and WineVarietals in the tables


  async loadWines(): Promise<void> {
    try {
      this.allWines = await this.wineService.getWines();
      this.filterWines();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Wine Table');
    }
  }


  async loadVarietals(): Promise<void> {
    try {
      this.varietals = await this.varietalService.getVarietals();
    } catch (error) {
      console.error(error);
    }
  }
  async loadWinetypes(): Promise<void> {
    try {
      this.winetypes = await this.winetypeService.getWinetypes();
    } catch (error) {
      console.error(error);
    }
  }

  getVarietalName(varietalID: number): string {
    const varietal = this.varietals.find(v => v.varietalID === varietalID);
    return varietal?.name || 'Unknown';
  }

  getWinetypeName(wineTypeID: number): string {
    const winetype = this.winetypes.find(w => w.wineTypeID === wineTypeID);
    return winetype?.name || 'Unknown';
  }
  //--------------------------------------------------------------------------------------------------------------------------------

  //Wine----------------------------------------------------------------------------------------------------------------------------.>
  // Wine variables needed
  allWines: Wine[] = [];
  wines: Wine[] = [];
  currentWine: Wine = new Wine();
  showWineModal: boolean = false;
  editingWine: boolean = false;
  showDeleteWineModal = false;
  wineToDeleteDetails: any;
  wineToDelete: any = null;
  selectedFile: File | null = null;
  searchQuery: string = '';

  invalidFileType: boolean = false;  // Add this new variable to track if uploaded file is of invalid type
  onFileSelected(wine: any) {
    if (wine.target.files && wine.target.files[0]) {
      const file = wine.target.files[0];
      const fileType = file["type"];
      const validImageTypes = ["image/jpeg", "image/png"];

      if (!validImageTypes.includes(fileType)) {
        // Invalid file type
        this.invalidFileType = true;
        this.fileUploaded = false;
        return;
      }

      this.invalidFileType = false;
      this.selectedFile = file;
      this.currentWine.filePath = this.selectedFile?.name ?? '';
    }

    if (wine.target.files && wine.target.files.length > 0) {
      this.fileUploaded = true;
    } else {
      this.fileUploaded = false;
    }
  }


  getObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  // Modal-related methods
  openAddWineModal() {
    if (this.varietals.length === 0 || this.winetypes.length === 0) {
      this.toastr.warning('Please add varietal and wine type before adding a wine.', 'Wine Form');
    } else {
      this.editingWine = false;
      this.currentWine = new Wine();
      this.showWineModal = true;
    }
  }

  openEditWineModal(id: number) {
    //console.log('Opening edit wine modal for ID:', id);
    this.editingWine = true;
    let wineToEdit = this.wines.find(wine => wine.wineID === id);
    this.currentWineImageURL = wineToEdit?.filePath;
    console.log(this.currentWineImageURL)
    if (wineToEdit) {
      this.tempWine = {
        ...wineToEdit,
        wineTypeName: this.getWinetypeName(wineToEdit.wineTypeID),
        varietalName: this.getVarietalName(wineToEdit.varietalID)
      };
      this.currentWine = this.tempWine;
    }
    this.showWineModal = true;
  }

  closeWineModal() {
    this.showWineModal = false;
  }

  openDeleteWineModal(wine: any): void {
    this.wineToDelete = wine.wineID;
    console.log("Wine : ", this.wineToDelete)
    this.wineToDeleteDetails = wine;
    this.showDeleteWineModal = true;
  }

  closeDeleteWineModal(): void {
    this.showDeleteWineModal = false;
  }

  updateDisplay(wine: Wine): void {
    wine.displayItem = !!wine.displayItem;
  }

  async submitWineForm(form: NgForm): Promise<void> {
    this.isSaving = true;
    try {
      const formData = new FormData();

      for (const key in this.currentWine) {
        if (this.currentWine.hasOwnProperty(key)) {
          formData.append(key, (this.currentWine as any)[key]);
        }
      }
  
      // Debug code to log the contents of formData
      console.log("Debugging FormData contents:");
      (formData as any).forEach((value: any, key: any) => {
        console.log(key, value);
      });

      if (this.editingWine) {
        const extractFileName = (path: string): string => {
          const parts = path.split('_');
          return parts[parts.length - 1];
        };

        let oldWineImagePath = this.currentWine.filePath;
        let oldWineImagePathConvert = extractFileName(oldWineImagePath);

        if (this.selectedFile) {
          formData.delete('File');
          formData.delete('filePath');
          formData.append('filePath', "");

          if (this.selectedFile.name != oldWineImagePathConvert && this.selectedFile.name.length != 0) {
            formData.append('File', this.selectedFile);
          } else {
            formData.append('File', this.selectedFile);
          }
        } else if (this.selectedFile == null) {
          formData.delete('File');
          formData.delete('filePath');
          formData.append('filePath', "");
          formData.append('File', oldWineImagePathConvert);
        }

        var wineToUpdate = await this.wineService.getWine(this.currentWine.wineID);
        this.updateDisplay(wineToUpdate);
        console.log(this.currentWine.displayItem);

        await this.wineService.updateWine(this.currentWine.wineID!, formData);
        const updatedWine = await this.wineService.getWine(this.currentWine.wineID!);
        const index = this.wines.findIndex(wine => wine.wineID === this.currentWine.wineID);
        if (index !== -1) {
          this.wines[index] = updatedWine;
        }
        this.changeDetector.detectChanges();
        this.toastr.success('Wine has been updated successfully.', 'Wine Form');
      } else {
        if (this.selectedFile) {
          formData.append('File', this.selectedFile);
        }
        else {
          this.toastr.warning('Please upload an image for the new wine.', 'Wine Form');
        }

        console.log('Data being sent to addWine API:', formData); // Add this log statement

        let createdWine = await this.wineService.addWine(formData);
        this.updateDisplay(createdWine);
        this.wines.push(createdWine);
        this.toastr.success('Wine has been added successfully.', 'Wine Form');
      }

      this.closeWineModal();
      form.resetForm();
      this.selectedFile = null;
    } catch (error) {
      console.error('Error:', error);
      this.toastr.error('An error occurred, please try again.', 'Wine Form');
    } finally {
      this.isSaving = false;
    }
  }

  async deleteWine(): Promise<void> {
    try {
      if (this.wineToDeleteDetails && this.wineToDeleteDetails.wineID !== undefined) {
        await this.wineService.deleteWine(this.wineToDeleteDetails.wineID);
        this.wines = this.wines.filter(wine => wine.wineID !== this.wineToDeleteDetails.wineID);
        this.toastr.success('Wine has been deleted successfully.', 'Successful');
        this.closeDeleteWineModal();
      } else {
        console.log("Wine to delete is null, undefined, or has an undefined WineID property.");
        this.toastr.warning('Unable to delete wine, please check the wine details.', 'Error');
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Error');
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
      this.wines = [...this.allWines];
    }
  }

  updateCharacterCount(event: any) {
    this.characterCount = event.target.value.length;
  }

  // Wine END-----------------------------------------------------------------------------------------------------.>

  // WINETYPES------------------------------------------------------------------------------------------------------------------------------------------------------------//

  //===================================================================================================================================================================.//
  //Winetype variables needed
  winetypes: WineType[] = [];
  currentWinetype: WineType = new WineType();
  showWinetypeModal: boolean = false;
  editingWinetype: boolean = false;
  showDeleteWinetypeModal = false;
  winetypeToDeleteDetails: any;
  winetypeToDelete: any = null;

  openAddWinetypeModal() {
    this.editingWinetype = false;
    this.currentWinetype = new WineType();
    this.showWinetypeModal = true;
  }
  openEditWinetypeModal(id: number) {
    console.log('Opening edit winetype modal for ID:', id);
    this.editingWinetype = true;
    this.currentWinetype = JSON.parse(JSON.stringify(this.winetypes.find(winetype => winetype.wineTypeID === id)!));
    this.showWinetypeModal = true;
  }

  closeWinetypeModal() {
    this.showWinetypeModal = false;
  }

  openDeleteWinetypeModal(winetype: any): void {
    this.winetypeToDelete = winetype.WinetypeID;
    console.log("Winetype : ", this.winetypeToDelete)
    this.winetypeToDeleteDetails = winetype;
    this.showDeleteWinetypeModal = true;
  }

  closeDeleteWineTypeModal(): void {
    this.showDeleteWinetypeModal = false;
  }

  async submitWinetypeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingWinetype flag:', this.editingWinetype);
    if (form.valid) {
      try {
        if (this.editingWinetype) {
          await this.winetypeService.updateWinetype(this.currentWinetype.wineTypeID!, this.currentWinetype);
          const index = this.winetypes.findIndex(winetype => winetype.wineTypeID === this.currentWinetype.wineTypeID);
          if (index !== -1) {
            this.winetypes[index] = this.currentWinetype;
          }
        } else {
          const data = await this.winetypeService.addWinetype(this.currentWinetype);
          this.winetypes.push(data);
        }
        this.closeWinetypeModal();
        if (!this.editingWinetype) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async deleteWinetype(): Promise<void> {
    if (this.winetypeToDeleteDetails && this.winetypeToDeleteDetails.wineTypeID !== undefined) {
      // Check if there are any wines referencing the winetype
      const winesReferencingWinetype = this.wines.filter(wine => wine.wineTypeID === this.winetypeToDeleteDetails.wineTypeID);

      if (winesReferencingWinetype.length > 0) {
        console.log("Cannot delete winetype. There are wines referencing it.");
        return;
      }

      await this.winetypeService.deleteWinetype(this.winetypeToDeleteDetails.wineTypeID);
      this.winetypes = this.winetypes.filter(winetype => winetype.wineTypeID !== this.winetypeToDeleteDetails.wineTypeID);
      this.closeDeleteWineTypeModal();
    } else {
      console.log("Winetype to delete is null, undefined, or has an undefined WinetypeID property.");
    }
  }

  // Winetype END-----------------------------------------------------------------------------------------------------.>

  // VARIETALS------------------------------------------------------------------------------------------------------------------------------------------------------------//
  //===================================================================================================================================================================.//


  //Varietal variables needed
  varietals: Varietal[] = [];
  currentVarietal: Varietal = new Varietal();
  showVarietalModal: boolean = false;
  editingVarietal: boolean = false;
  showDeleteVarietalModal = false;
  varietalToDeleteDetails: any;
  varietalToDelete: any = null;


  // Modal-related methods
  openAddVarietalModal() {
    this.editingVarietal = false;
    this.currentVarietal = new Varietal();
    this.showVarietalModal = true;
  }

  openEditVarietalModal(id: number) {
    console.log('Opening edit varietal modal for ID:', id);
    this.editingVarietal = true;
    // We need to make a deep copy of the varietal, not reference the same object
    this.currentVarietal = JSON.parse(JSON.stringify(this.varietals.find(varietal => varietal.varietalID === id)!));
    this.showVarietalModal = true;
  }

  closeVarietalModal() {
    this.showVarietalModal = false;
  }

  openDeleteVarietalModal(varietal: any): void {
    this.varietalToDelete = varietal.VarietalID;
    console.log("Varietal : ", this.varietalToDelete)
    this.varietalToDeleteDetails = varietal;
    this.showDeleteVarietalModal = true;
  }

  closeDeleteVarietalModal(): void {
    this.showDeleteVarietalModal = false;
  }

  // CRUD Varietal

  // Create and Edit Varietal
  async submitVarietalForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingVarietal flag:', this.editingVarietal);
    if (form.valid) {
      try {
        if (this.editingVarietal) {
          // Update Varietal
          await this.varietalService.updateVarietal(this.currentVarietal.varietalID!, this.currentVarietal);
          const index = this.varietals.findIndex(varietal => varietal.varietalID === this.currentVarietal.varietalID);
          if (index !== -1) {
            this.varietals[index] = this.currentVarietal;
          }
        } else {
          // Add Varietal
          const data = await this.varietalService.addVarietal(this.currentVarietal);
          this.varietals.push(data);
        }
        this.closeVarietalModal();
        if (!this.editingVarietal) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Delete Varietal
  async deleteVarietal(): Promise<void> {
    if (this.varietalToDeleteDetails && this.varietalToDeleteDetails.varietalID !== undefined) {
      // Check if there are any wines referencing the varietal
      const winesReferencingVarietal = this.wines.filter(wine => wine.varietalID === this.varietalToDeleteDetails.varietalID);

      if (winesReferencingVarietal.length > 0) {
        // Display a notification or prevent deletion
        console.log("Cannot delete varietal. There are wines referencing it.");
        return;
      }

      // Delete the varietal if there are no referencing wines
      await this.varietalService.deleteVarietal(this.varietalToDeleteDetails.varietalID);
      this.varietals = this.varietals.filter(varietal => varietal.varietalID !== this.varietalToDeleteDetails.varietalID);
      this.closeDeleteVarietalModal();
    } else {
      console.log("Varietal to delete is null, undefined, or has an undefined VarietalID property.");
    }
  }


  // <!-- Varietal ------------------------------------------------------------------------------------------------------------------------------------------------------------>


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
      'Wine: ' + (this.editingWine ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}