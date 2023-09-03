import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from 'src/app/Model/employee';
import { ToastrService } from 'ngx-toastr';
import { Register } from 'src/app/Model/register';
import { EmployeeRegistrationViewModel } from 'src/app/Model/employeeRegisterViewModel';
import { EmployeeViewModel } from 'src/app/Model/employeeViewModel';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {

  @ViewChild('employeeForm') employeeForm!: NgForm;
  isSubmitting: boolean = false;
  employees: Employee[] = [];
  currentEmployee: Employee = new Employee();
  showEmployeeModal: boolean = false;
  editingEmployee: boolean = false;
  showDeleteEmployeeModal = false;
  employeeToDeleteDetails: any;
  employeeToDelete: any = null;
  maxDate!: string;
  deleteConfirmationText: string = '';
  searchTerm: string = '';
  filteredEmployees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private toastr : ToastrService,
    private customerService: CustomersService,
    private auditLogService: AuditlogService,
    private dataService: DataServiceService){ }

  ngOnInit(): void { 
    this.getEmployees();
    const today = new Date();
    this.maxDate = this.formatDate(today);
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getEmployees(){
    this.employeeService.GetEmployees().subscribe(
      (result: Employee[]) => {
        this.employees = result;
        this.filteredEmployees = this.employees;
        console.log(this.employees);
      },
      (error: any) => {
        console.error(error);
        this.toastr.error("Unable to load employee data");
      }
    );
  }

  openAddEmployeeModal() {
    this.editingEmployee = false;
    this.currentEmployee = new Employee();
    this.showEmployeeModal = true;
  }

  openEditEmployeeModal(id: string) {
    console.log('Opening edit employee modal for ID:', id);
    this.editingEmployee = true;
    // Find the original Employee object
    const originalEmployee = this.employees.find(employee => employee.id === id);
    if (originalEmployee) {
      // Clone the original Employee object and assign it to currentEmployee
      this.currentEmployee = {...originalEmployee};
    }
    this.showEmployeeModal = true;
  }

  closeEmployeeModal() {
    this.showEmployeeModal = false;
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.controls[key];
      control.markAsUntouched();
      control.markAsPristine();
    });
  }

  openDeleteEmployeeModal(employee: any): void {
    this.employeeToDelete = employee.id;
    console.log("Employee ID to delete: ", this.employeeToDelete)
    this.employeeToDeleteDetails = employee;
    this.showDeleteEmployeeModal = true;
  }

  closeDeleteEmployeeModal(): void {
    this.showDeleteEmployeeModal = false;
  }

  async submitEmployeeForm(form: NgForm): Promise<void> {
    this.isSubmitting = true;
    console.log('Submitting form with editingEmployee flag:', this.editingEmployee);
    if (form.valid) {
      try {
        if (this.editingEmployee) {
          this.employeeService.UpdateEmployee(this.currentEmployee.id!, this.currentEmployee).subscribe(
            (data: Employee) => {
              const index = this.employees.findIndex(employee => employee.id === this.currentEmployee.id);
              if (index !== -1) {
                // Update the original Employee object with the changes made to the clone
                this.employees[index] = data;
                this.toastr.success("Employee updated.", "Update employee");
                this.isSubmitting = false;
              }
              this.closeEmployeeModal();
            },
            (error: any) => {
              console.error(error);
              this.toastr.error("Failed to update superuser.", "Update Superuser");
              this.isSubmitting = false;
            }
          );
        } else {
          const regEmp: EmployeeRegistrationViewModel = new EmployeeRegistrationViewModel();
          
          const empModel: EmployeeViewModel = new EmployeeViewModel();
          empModel.firstName = this.currentEmployee.first_Name;
          empModel.lastName = this.currentEmployee.last_Name;
          empModel.phoneNumber = this.currentEmployee.phoneNumber;
          empModel.idNumber = this.currentEmployee.iD_Number;

          const regModel: Register = new Register();
          regModel.Title = this.currentEmployee.title;
          regModel.FirstName = this.currentEmployee.first_Name;
          regModel.LastName = this.currentEmployee.last_Name;
          regModel.PhoneNumber = this.currentEmployee.phoneNumber;
          regModel.IDNumber = this.currentEmployee.iD_Number;
          regModel.Gender = this.currentEmployee.gender;
          regModel.DisplayName = this.currentEmployee.username;
          regModel.Email = this.currentEmployee.email;
          regModel.Password = "AutoGenerated@API123"
          regModel.EnableTwoFactorAuth = true;

          regEmp.EmployeeModel = empModel;
          regEmp.RegisterModel = regModel;

          console.log(regEmp);

          this.employeeService.AddEmployee(regEmp).subscribe(data => {
            console.log(data);
            this.employees.push(data);
            this.toastr.success("A new employee has been added to the system.", "Add Employee");
            this.getEmployees();
            this.closeEmployeeModal();
            this.isSubmitting = false;
          }, error => {
            console.error(error);
            this.toastr.error("Adding a new employee failed, please try again later.", "Employee add failed");
            this.isSubmitting = false;
          });
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Failed response, please contact support.", "Failed adjustment")
      }
    }
  }

  async deleteEmployee(): Promise<void> {
    if (this.employeeToDelete != null) {
      try {
        this.employeeService.DeleteEmployee(this.employeeToDelete).subscribe((result: any) => {
          this.employees = this.employees.filter(employee => employee.id !== this.employeeToDelete);
          this.toastr.success("The employee has been deleted.", "Delete Employee");
          this.getEmployees();
          this.closeDeleteEmployeeModal();
        }, (error) => {
          console.error('Error deleting employee:', error);
          console.log('Error Response Body:', error.error);
          this.toastr.error("Deleting the selected employee account failed, please try again later.", "Delete Employee");
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        this.toastr.error("An unexpected error occurred, please try again later.", "Delete Employee");
      }
    }
}


  clearConfirmationInput(): void {
    this.deleteConfirmationText = ''; // Clear the input field
  }


  searchEmployees() {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees; // If no search term, show all superusers
      return;
    }
  
    const lowercasedTerm = this.searchTerm.toLowerCase();
  
    this.filteredEmployees = this.employees.filter(emp => 
      (emp.first_Name && emp.first_Name.toLowerCase().includes(lowercasedTerm)) ||
      (emp.last_Name && emp.last_Name.toLowerCase().includes(lowercasedTerm)) ||
      (emp.email && emp.email.toLowerCase().includes(lowercasedTerm)) ||
      (emp.phoneNumber && emp.phoneNumber.toString().toLowerCase().includes(lowercasedTerm)) ||
      (emp.iD_Number && emp.iD_Number.toString().toLowerCase().includes(lowercasedTerm)) ||
      (emp.hire_Date && emp.hire_Date.toString().toLowerCase().includes(lowercasedTerm))
    );
  }

  // VALIDATION

  DateValid(): boolean {
    let idMonth = parseInt(this.currentEmployee.iD_Number.toString().substring(2,4));
    let idDay = parseInt(this.currentEmployee.iD_Number.toString().substring(4,6));
  
    return !(idDay > 31 || idMonth > 12);
  }
  
  isOlderThan18(): boolean {
    let idYearPrefix = (parseInt(this.currentEmployee.iD_Number.toString().substring(0,2)) < new Date().getFullYear() % 100) ? 2000 : 1900;
    let idYear = idYearPrefix + parseInt(this.currentEmployee.iD_Number.toString().substring(0,2));
    let idMonth = parseInt(this.currentEmployee.iD_Number.toString().substring(2,4));
    let idDay = parseInt(this.currentEmployee.iD_Number.toString().substring(4,6));
  
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
      'Employee Account: ' + (this.editingEmployee ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}
