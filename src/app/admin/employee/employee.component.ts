import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from 'src/app/Model/employee';
import { SystemprivilegeService } from '../services/systemprivilege.service';
import { SystemPrivilege } from 'src/app/Model/systemprivilege';
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

  constructor(private employeeService: EmployeeService, private privilegeService: SystemprivilegeService){ }

  ngOnInit(): void { 
    this.getEmployees();
    this.getSystemPrivileges();
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
          }
        } else {
          const data = await this.employeeService.AddEmployee(this.currentEmployee);
          this.employees.push(data);
        }
        this.closeEmployeeModal();
        if (!this.editingEmployee) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
}

  async deleteEmployee(): Promise<void> {
    if (this.employeeToDelete != null) {
      try {
        await this.employeeService.DeleteEmployee(this.employeeToDelete);
        console.log(this.employeeToDelete);
        this.employees = this.employees.filter(employee => employee.employeeID !== this.employeeToDelete);
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
      this.closeDeleteEmployeeModal();
    }
  }

  // TODO WAS EVERYTHING TO DO WITH EMPLOYEE \\


  // ? EVERYTHING TO DO WITH SYSTEMPRIVILEGES \\
  
  systemPrivileges: SystemPrivilege[] = [];
  currentSystemPrivilege: SystemPrivilege = new SystemPrivilege();
  showSystemPrivilegeModal: boolean = false;
  editingSystemPrivilege: boolean = false;
  showDeleteSystemPrivilegeModal = false;
  systemPrivilegeToDeleteDetails: any;
  systemPrivilegeToDelete: any = null;



  getSystemPrivileges(){
    this.privilegeService.GetSystemPrivileges().subscribe(
      (result: SystemPrivilege[]) => {
        this.systemPrivileges = result;
        console.log(this.systemPrivileges);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  openAddSystemPrivilegeModal() {
    this.editingSystemPrivilege = false;
    this.currentSystemPrivilege = new SystemPrivilege();
    this.showSystemPrivilegeModal = true;
  }

  openEditSystemPrivilegeModal(id: number) {
    console.log('Opening edit early bird modal for ID:', id);
    this.editingSystemPrivilege = true;
    // Find the original SystemPrivilege object
    const originalSystemPrivilege = this.systemPrivileges.find(systemPrivilege => systemPrivilege.systemPrivilegeID === id);
    if (originalSystemPrivilege) {
      // Clone the original SystemPrivilege object and assign it to currentSystemPrivilege
      this.currentSystemPrivilege = {...originalSystemPrivilege};
    }
    this.showSystemPrivilegeModal = true;
}

  closeSystemPrivilegeModal() {
    this.showSystemPrivilegeModal = false;
  }

  openDeleteSystemPrivilegeModal(systemPrivilege: any): void {
    this.systemPrivilegeToDelete = systemPrivilege.systemPrivilegeID;
    console.log("System privilege : ", this.systemPrivilegeToDelete)
    this.systemPrivilegeToDeleteDetails = systemPrivilege;
    this.showDeleteSystemPrivilegeModal = true;
  }

  closeDeleteSystemPrivilegeModal(): void {
    this.showDeleteSystemPrivilegeModal = false;
  }

  async submitSystemPrivilegeForm(form: NgForm): Promise<void> {
    console.log('Submitting form with editingSystemPrivilege flag:', this.editingSystemPrivilege);
    if (form.valid) {
      try {
        if (this.editingSystemPrivilege) {
          await this.privilegeService.UpdateSystemPrivilege(this.currentSystemPrivilege.systemPrivilegeID!, this.currentSystemPrivilege);
          const index = this.systemPrivileges.findIndex(systemPrivilege => systemPrivilege.systemPrivilegeID === this.currentSystemPrivilege.systemPrivilegeID);
          if (index !== -1) {
            // Update the original SystemPrivilege object with the changes made to the clone
            this.systemPrivileges[index] = this.currentSystemPrivilege;
          }
        } else {
          const data = await this.privilegeService.AddSystemPrivilege(this.currentSystemPrivilege);
          this.systemPrivileges.push(data);
        }
        this.closeSystemPrivilegeModal();
        if (!this.editingSystemPrivilege) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
      }
    }
}

  async deleteSystemPrivilege(): Promise<void> {
    if (this.systemPrivilegeToDelete != null) {
      try {
        await this.privilegeService.DeleteSystemPrivilege(this.systemPrivilegeToDelete);
        console.log(this.systemPrivilegeToDelete);
        this.systemPrivileges = this.systemPrivileges.filter(SystemPrivilege => SystemPrivilege.systemPrivilegeID !== this.systemPrivilegeToDelete);
      } catch (error) {
        console.error('Error deleting SystemPrivilege:', error);
      }
      this.closeDeleteSystemPrivilegeModal();
    }
  }

}
