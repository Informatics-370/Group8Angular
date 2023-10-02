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

import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';


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
  originalWines!: Wine[];
  public isInvalidVintage = false;



  constructor(private toastr: ToastrService, private discountService: DiscountService, private router: Router, private wineService: WineService
    , private winetypeService: WinetypeService, private varietalService: VarietalService, private changeDetector: ChangeDetectorRef
    , private customerService: CustomersService, private auditLogService: AuditlogService, private dataService: DataServiceService
    ,private pdfService: PdfService,) { }

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
      this.originalWines = [...this.allWines];

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
  public displayedImageURL: string | undefined;
  public selectedWineImageURL: string | undefined;

  onFileSelected(wine: any) {
    if (wine.target.files && wine.target.files[0]) {
      const file = wine.target.files[0];
      const fileType = file["type"];
      const validImageTypes = ["image/jpeg", "image/png"];
      this.selectedWineImageURL = this.getObjectURL(file);
      if (!validImageTypes.includes(fileType)) {
        // Invalid file type
        this.invalidFileType = true;
        this.fileUploaded = false;
        return;
      }

      this.invalidFileType = false;
      this.selectedFile = file;
      let filePathInput = document.getElementById('filePath') as HTMLElement;
      if (filePathInput) {
        filePathInput.style.setProperty('--dynamic-content', `"${this.selectedFile?.name}"`); // Note the use of backticks and quotes
      }
      this.currentWine.filePath = this.selectedFile?.name ?? '';


      // Update displayedImageURL here with null check
      if (this.selectedFile) {
        this.displayedImageURL = this.getObjectURL(this.selectedFile);
        console.log("Display", this.displayedImageURL);
      }
    }

    if (wine.target.files && wine.target.files.length > 0) {
      this.fileUploaded = true;
    } else {
      this.fileUploaded = false;
    }

    // Trigger manual change detection
    this.changeDetector.detectChanges();
  }




  getObjectURL(file: File): string {
    // Clean up any old blob URLs to prevent memory leak
    if (this.displayedImageURL) {
      URL.revokeObjectURL(this.displayedImageURL);
    }
    return URL.createObjectURL(file);
  }

  // Modal-related methods
  openAddWineModal() {
    this.displayedImageURL = "";
    let filePathInput = document.getElementById('filePath') as HTMLElement;
    if (filePathInput) {
      filePathInput.style.setProperty('--dynamic-content', `"Pick an image file"`); // Note the use of backticks and quotes
    }
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
    if (this.currentWineImageURL) {
      var lastUnderScore = this.currentWineImageURL.lastIndexOf('_');

      var extractedValue = this.currentWineImageURL.substring(lastUnderScore + 1);

      let filePathInput = document.getElementById('filePath') as HTMLInputElement;
      if (filePathInput) {
        filePathInput.style.setProperty('--dynamic-content', `"${extractedValue}"`);
        filePathInput.placeholder = "";  // Clear actual placeholder
      }
    }


    console.log(this.currentWineImageURL)
    if (wineToEdit) {
      this.selectedWineImageURL = wineToEdit.filePath; // Assuming wineToEdit.file contains the File object
      this.displayedImageURL = this.selectedWineImageURL;
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
    if (this.selectedWineImageURL && this.displayedImageURL !== this.selectedWineImageURL) {
      this.displayedImageURL = this.selectedWineImageURL;
    }
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
    
    const currentYear = new Date().getFullYear();
    const enteredVintage = parseInt(this.currentWine.vintage, 10); // Convert the string to a number
    
    if (isNaN(enteredVintage)) {
      this.toastr.error('Wine vintage must be a valid year.', 'Wine Form');
      this.isInvalidVintage = true;
      this.isSaving = false;
      return;
    }
    
    this.isInvalidVintage = enteredVintage > currentYear; // Update this flag based on the validation
  
    if (this.isInvalidVintage) {
      this.toastr.error('Wine vintage cannot be in the future.', 'Wine Form');
      this.isSaving = false;
      return;
    }
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
        // Update both originalWines and allWines array.
        const index = this.originalWines.findIndex(wine => wine.wineID === this.currentWine.wineID);
        if (index !== -1) {
          this.originalWines[index] = updatedWine;
          this.allWines[index] = updatedWine;
        }
        this.filterWines(); // This should re-filter and paginate wines
        this.changeDetector.detectChanges(); // Force the view to update

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


        // Update both originalWines and allWines array.
        this.originalWines.push(createdWine);
        this.allWines.push(createdWine);

        this.filterWines(); // This should re-filter and paginate wines
        this.changeDetector.detectChanges(); // Force the view to update
        this.updateDisplay(createdWine);

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
      // Verify that wine details exist and that wineID is not undefined.
      if (this.wineToDeleteDetails && this.wineToDeleteDetails.wineID !== undefined) {
        // Attempt to delete the wine.
        await this.wineService.deleteWine(this.wineToDeleteDetails.wineID);
  
        // Remove deleted wine from the local list of all wines.
        this.allWines = this.allWines.filter(wine => wine.wineID !== this.wineToDeleteDetails.wineID);
        this.originalWines = this.originalWines.filter(wine => wine.wineID !== this.wineToDeleteDetails.wineID);
  
        // Reapply filters, sorting, and pagination
        this.filterWines();
  
        // Notify user of successful delete.
        this.toastr.success('Wine has been deleted successfully.', 'Successful');
  
        // Close the modal.
        this.closeDeleteWineModal();
      } else {
        // Log the error and notify user.
        console.log("Wine to delete is null, undefined, or has an undefined WineID property.");
        this.toastr.warning('Unable to delete wine, please check the wine details.', 'Error');
      }
    } catch (error: any) {  // Explicitly annotate type to 'any' or appropriate type.
      console.error(error);
      if (error.message === 'This wine is part of an existing order and cannot be deleted.') {
        this.toastr.warning('This wine is part of an existing order and cannot be deleted.', 'Error');
      } else {
        this.toastr.error('An error occurred, please try again.', 'Error');
      }
    }
  }

  onSortChange(event: globalThis.Event): void {
    // Assert the type to HTMLSelectElement
    const target = event.target as HTMLSelectElement;
    // Now TypeScript knows that 'value' exists on target
    const value = target.value;
    this.sortBy = value;
    this.filterWines(); // Re-filter and sort wines
  }
  
  onSortDirectionChange(event: globalThis.Event): void {
    // Assert the type to HTMLSelectElement
    const target = event.target as HTMLSelectElement;
    // Now TypeScript knows that 'value' exists on target
    const value = target.value;
    this.sortDirection = value as 'asc' | 'desc';
    this.filterWines(); // Re-filter and sort wines
  }
  
  



 // TypeScript Code

filterWines(): void {
  // Reset to the first page when a new filter is applied
  // this.currentPage = 1;
  
  // Perform filtering
  if (this.searchQuery.trim() !== '') {
    const query = this.searchQuery.toLowerCase().trim();
    this.allWines = this.originalWines.filter(wine =>
      wine.name.toLowerCase().includes(query) ||
      wine.vintage.toString().toLowerCase().includes(query) ||
      wine.price.toString().toLowerCase().includes(query) 
      // Add more fields here as needed
    );
     } else {
    // Reset allWines to its original state if no filter is applied
    this.allWines = [...this.originalWines];
  }
  
  // Perform sorting
  if (this.sortBy) {
    this.allWines.sort((a, b) => {
      if (a[this.sortBy] < b[this.sortBy]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a[this.sortBy] > b[this.sortBy]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  // Update total pages based on filtered results and page size
  this.totalPages = Math.ceil(this.allWines.length / this.pageSize);
  
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.wines = this.allWines.slice(startIndex, endIndex);
}


  updateCharacterCount(event: any) {
    this.characterCount = event.target.value.length;
  }


  //=========Pagination and sorting ===================================================================//

  currentPage: number = 1; // Single number to represent the current page
  totalPages: number = 1; // Just an example value, set this dynamically
  pageSize: number = 3; // Items per page
  pageSizeOptions: number[] = [3, 5, 10, 15, 20]; // Options for page size dropdown

  sortBy: string = ''; // To store the field to sort by
  sortDirection: 'asc' | 'desc' = 'asc'; // To store the sorting direction


  onPageChange(newPage: number) {
    console.log('Received new page:', newPage);
    this.currentPage = newPage;
    this.filterWines(); // Re-filter wines without resetting allWines
  }
  
  
  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.filterWines(); // Re-filter wines without resetting allWines
  }

  currentReportType: 'REFUNDS' | 'EVENTS' | 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES' | null = null;
  showBlacklistModal: boolean = false;

  showModal(reportType: 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES'): void {
    this.currentReportType = reportType;
    this.showBlacklistModal = true;
  }
  closeBlacklistModal() {
    this.showBlacklistModal = false;
    this.currentReportType = null;
  }

  OpenReports(): void {
   
       if (this.currentReportType === 'WINES') {
      this.ViewWines();
    }
  }

  DownloadReports(): void {
    if (this.currentReportType === 'WINES') {
      this.generateWineReportpdf();
    }
  }


  async ViewWines(): Promise<void> {
    try {
      const currentDate = this.getCurrentDateFormatted(); // Get the current date
      console.log(this.wines)
      const pdfBlob = await this.pdfService.generateWinesReport(this.wines, currentDate);

      const resolvedPdfBlob = await pdfBlob;

      // Create a Blob URL and open it in a new tab
      const blobUrl = URL.createObjectURL(resolvedPdfBlob);
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab for PDF');
      } else {
        console.error('Received undefined or invalid Wine data');
      }
    } catch (error) {
      console.error('Error generating Wine report:', error);
    }
  }


  async generateWineReportpdf() {
    try {
      let result: Wine[] | undefined = await this.wineService.getWines();
      console.log('Result:', result); // Add this line
      if (result !== undefined) {
        this.wines = result;
        let currentDate = this.getCurrentDateFormatted();
        this.pdfService.generateWinesReportpdf(this.wines, currentDate);
        // Do any additional processing or actions here if needed
      } else {
        console.error('Received undefined or invalid wine data');
        this.toastr.error('Error, failed to download Wines Report', 'Wines Report');
        // Handle the case where the returned data is undefined or invalid
      }
    } catch (error) {
      console.error('Error fetching wine data:', error);
      this.toastr.error('Error, failed to retrieve Wine Data', 'Wines Report');
      // Handle error if needed
    }
  }


  getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
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
  filteredVarietals: Varietal[] = [];




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

  isBlendSelected: boolean | undefined;

  filterVarietals() {
    const wineTypeID = Number(this.currentWine.wineTypeID); // Convert to Number
    const selectedWineType = this.winetypes.find(w => w.wineTypeID === wineTypeID);

    if (selectedWineType) {
      this.filteredVarietals = selectedWineType.varietals.filter(v => v.blend === this.isBlendSelected);
    } else {
      this.filteredVarietals = [];
    }
  }

  onWineTypeChange() {
    this.filterVarietals();
  }

  onBlendChange() {
    this.filterVarietals();
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

  goToPage4() {
    this.router.navigate(['/help/1']);
  }
}