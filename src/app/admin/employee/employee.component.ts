import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from 'src/app/Model/employee';
import { SystemprivilegeService } from '../services/systemprivilege.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  // TODO THIS IS EVERYTHING TO DO WITH EMPLOYEE \\

  employees: Employee[] = [];
  currentEmployee: Employee = new Employee();
  showEmployeeModal: boolean = false;
  editingEmployee: boolean = false;
  showDeleteEmployeeModal = false;
  employeeToDeleteDetails: any;
  employeeToDelete: any = null;
  maxDate!: string;

  constructor(private employeeService: EmployeeService, private toastr : ToastrService){ }

  ngOnInit(): void { 
    this.getEmployees();
    const today = new Date();
    this.maxDate = this.formatDate(today);
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

  openEditEmployeeModal(id: number) {
    console.log('Opening edit early bird modal for ID:', id);
    this.editingEmployee = true;
    // Find the original Employee object
    const originalEmployee = this.employees.find(employee => employee.employeeID === id);
    if (originalEmployee) {
      // Clone the original Employee object and assign it to currentEmployee
      this.currentEmployee = {...originalEmployee};
    }
    this.showEmployeeModal = true;
}

  closeEmployeeModal() {
    this.showEmployeeModal = false;
  }

  openDeleteEmployeeModal(employee: any): void {
    this.employeeToDelete = employee.employeeID;
    console.log("System privilege : ", this.employeeToDelete)
    this.employeeToDeleteDetails = employee;
    this.showDeleteEmployeeModal = true;
  }

  closeDeleteEmployeeModal(): void {
    this.showDeleteEmployeeModal = false;
  }

  async submitEmployeeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingEmployee flag:', this.editingEmployee);
    if (form.valid) {
      try {
        if (this.editingEmployee) {
          await this.employeeService.UpdateEmployee(this.currentEmployee.employeeID!, this.currentEmployee);
          const index = this.employees.findIndex(employee => employee.employeeID === this.currentEmployee.employeeID);
          if (index !== -1) {
            // Update the original Employee object with the changes made to the clone
            this.employees[index] = this.currentEmployee;
            this.toastr.success("Employee updated.", "Update employee");
          }
        } else {
          const data = await this.employeeService.AddEmployee(this.currentEmployee);
          this.employees.push(data);
          this.toastr.success("A new employee has been added to the system.", "Add Employee");
        }
        this.closeEmployeeModal();
        if (!this.editingEmployee) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Adding a new employee failed, please try again later.", "Add Employee")
      }
    }
}

  async deleteEmployee(): Promise<void> {
    if (this.employeeToDelete != null) {
      try {
        await this.employeeService.DeleteEmployee(this.employeeToDelete);
        console.log(this.employeeToDelete);
        this.employees = this.employees.filter(employee => employee.employeeID !== this.employeeToDelete);
        this.toastr.success("The employee has been deleted.", "Delete Employee");
      } catch (error) {
        console.error('Error deleting employee:', error);
        this.toastr.error("Deleting the selected employee account failed, please try again later.", "Delete Employee");
      }
      this.closeDeleteEmployeeModal();
    }
  }

  // TODO WAS EVERYTHING TO DO WITH EMPLOYEE \\


  
}
  