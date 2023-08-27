import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Register } from 'src/app/Model/register';
import { Superuser } from 'src/app/Model/superuser';
import { SuperuserRegistrationViewModel } from 'src/app/Model/superuserRegisterViewModel';
import { SuperuserViewModel } from 'src/app/Model/superuserViewModel';
import { SuperuserService } from '../services/superuser.service';

@Component({
  selector: 'app-superuser',
  templateUrl: './superuser.component.html',
  styleUrls: ['./superuser.component.css']
})
export class SuperuserComponent {

  @ViewChild('superuserForm') superuserForm!: NgForm;
  
  superusers: Superuser[] = [];
  currentSuperuser: Superuser = new Superuser();
  showSuperuserModal: boolean = false;
  editingSuperuser: boolean = false;
  showDeleteSuperuserModal = false;
  superuserToDeleteDetails: any;
  superuserToDelete: any = null;
  maxDate!: string;
  deleteConfirmationText: string = 'Confirm';
  searchTerm: string = '';
  filteredSuperusers: Superuser[] = [];

  constructor(private superuserService: SuperuserService, private toastr : ToastrService){ }

  ngOnInit(): void { 
    this.getSuperusers();
    const today = new Date();
    this.maxDate = this.formatDate(today);
    this.clearConfirmationInput();
  }

  searchSuperusers() {
    if (!this.searchTerm) {
      this.filteredSuperusers = this.superusers; // If no search term, show all superusers
      return;
    }
  
    const lowercasedTerm = this.searchTerm.toLowerCase();
  
    this.filteredSuperusers = this.superusers.filter(sup => 
      (sup.first_Name && sup.first_Name.toLowerCase().includes(lowercasedTerm)) ||
      (sup.last_Name && sup.last_Name.toLowerCase().includes(lowercasedTerm)) ||
      (sup.email && sup.email.toLowerCase().includes(lowercasedTerm)) ||
      (sup.phoneNumber && sup.phoneNumber.toString().toLowerCase().includes(lowercasedTerm)) ||
      (sup.iD_Number && sup.iD_Number.toString().toLowerCase().includes(lowercasedTerm)) ||
      (sup.hire_Date && sup.hire_Date.toString().toLowerCase().includes(lowercasedTerm))
    );
  }

  clearConfirmationInput(): void {
    this.deleteConfirmationText = ''; // Clear the input field
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getSuperusers(){
    this.superuserService.GetSuperusers().subscribe(
      (result: Superuser[]) => {
        this.superusers = result;
        this.filteredSuperusers = result;
        console.log(this.superusers);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Unable to load superuser data");
      }
    );
  }

  openAddSuperuserModal() {
    this.editingSuperuser = false;
    this.currentSuperuser = new Superuser();
    this.showSuperuserModal = true;
  }

  openEditSuperuserModal(id: string) {
    console.log('Opening edit superuser modal for ID:', id);
    this.editingSuperuser = true;
    // Find the original Superuser object
    const originalSuperuser = this.superusers.find(superuser => superuser.id === id);
    if (originalSuperuser) {
      // Clone the original Superuser object and assign it to currentSuperuser
      this.currentSuperuser = {...originalSuperuser};
    }
    this.showSuperuserModal = true;
  }

  closeSuperuserModal() {
    this.showSuperuserModal = false;
    Object.keys(this.superuserForm.controls).forEach(key => {
      const control = this.superuserForm.controls[key];
      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  openDeleteSuperuserModal(superuser: any): void {
    this.superuserToDelete = superuser.id;
    console.log("Superuser ID to delete: ", this.superuserToDelete)
    this.superuserToDeleteDetails = superuser;
    this.showDeleteSuperuserModal = true;
  }

  closeDeleteSuperuserModal(): void {
    this.showDeleteSuperuserModal = false;
  }

  async submitSuperuserForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingSuperuser flag:', this.editingSuperuser);
    if (form.valid) {
      try {
        if (this.editingSuperuser) {
          this.superuserService.UpdateSuperuser(this.currentSuperuser.id!, this.currentSuperuser).subscribe(
            (data: Superuser) => {
              const index = this.superusers.findIndex(superuser => superuser.id === data.id);
              if (index !== -1) {
                // Update the original Superuser object with the changes made to the clone
                this.superusers[index] = data;
                this.toastr.success("Superuser updated.", "Update Superuser");
              }
              this.closeSuperuserModal();
            },
            (error: any) => {
              console.error(error);
              this.toastr.error("Failed to update superuser.", "Update Superuser");
            }
          );
        } else {
          const regEmp: SuperuserRegistrationViewModel = new SuperuserRegistrationViewModel();
          
          const empModel: SuperuserViewModel = new SuperuserViewModel();
          empModel.firstName = this.currentSuperuser.first_Name;
          empModel.lastName = this.currentSuperuser.last_Name;
          empModel.phoneNumber = this.currentSuperuser.phoneNumber;
          empModel.idNumber = this.currentSuperuser.iD_Number;

          const regModel: Register = new Register();
          regModel.Title = this.currentSuperuser.title;
          regModel.FirstName = this.currentSuperuser.first_Name;
          regModel.LastName = this.currentSuperuser.last_Name;
          regModel.PhoneNumber = this.currentSuperuser.phoneNumber;
          regModel.IDNumber = this.currentSuperuser.iD_Number;
          regModel.Gender = this.currentSuperuser.gender;
          regModel.DisplayName = this.currentSuperuser.username;
          regModel.Email = this.currentSuperuser.email;
          regModel.Password = "AutoGenerated@API123"
          regModel.EnableTwoFactorAuth = true;

          regEmp.SuperuserModel = empModel;
          regEmp.RegisterModel = regModel;

          console.log(regEmp);

          this.superuserService.AddSuperuser(regEmp).subscribe(data => {
            console.log(data);
            this.superusers.push(data);
            this.toastr.success("A new superuser has been added to the system.", "Add Superuser");
            form.resetForm();
          }, error => {
            console.error(error);
            this.toastr.error("Adding a new superuser failed, please try again later.", "Superuser add failed");
          });
        }
        this.closeSuperuserModal();
        if (!this.editingSuperuser) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Failed response, please contact support.", "Failed Adjustment")
      }
    }
  }

  async deleteSuperuser(): Promise<void> {
    console.log("here");
    if (this.superuserToDelete != null) {
      try {
        this.superuserService.DeleteSuperuser(this.superuserToDelete).subscribe((result: any) => {

        });
        console.log(this.superuserToDelete);
        this.superusers = this.superusers.filter(superuser => superuser.id !== this.superuserToDelete);
        this.toastr.success("The superuser has been deleted.", "Delete Superuser");
      } catch (error) {
        console.error('Error deleting superuser:', error);
        this.toastr.error("Deleting the selected superuser account failed, please try again later.", "Delete Superuser");
      }
      this.closeDeleteSuperuserModal();
    }
  }

  // VALIDATION

  DateValid(): boolean {
    let idMonth = parseInt(this.currentSuperuser.iD_Number.toString().substring(2,4));
    let idDay = parseInt(this.currentSuperuser.iD_Number.toString().substring(4,6));
  
    return !(idDay > 31 || idMonth > 12);
  }
  
  isOlderThan18(): boolean {
    let idYearPrefix = (parseInt(this.currentSuperuser.iD_Number.toString().substring(0,2)) < new Date().getFullYear() % 100) ? 2000 : 1900;
    let idYear = idYearPrefix + parseInt(this.currentSuperuser.iD_Number.toString().substring(0,2));
    let idMonth = parseInt(this.currentSuperuser.iD_Number.toString().substring(2,4));
    let idDay = parseInt(this.currentSuperuser.iD_Number.toString().substring(4,6));
  
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JavaScript
    let currentDay = currentDate.getDate();
  
    let age = currentYear - idYear;
    if (currentMonth < idMonth || (currentMonth === idMonth && currentDay < idDay)) {
      age--;  // This handles if the birthday hasn't occurred yet for the current year
    }
  
    return age >= 18;
  }  
}
