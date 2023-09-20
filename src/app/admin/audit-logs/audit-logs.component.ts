import { Component } from '@angular/core';
import { AuditlogService } from '../services/auditlog.service';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { ToastrService } from 'ngx-toastr';

import { Customer } from 'src/app/Model/customer';
import { CustomersService } from 'src/app/admin/services/customers.service';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
})
export class AuditLogsComponent {
  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;
  currentPage: number = 1; // Current page
  pageSize: number = 10; // Items per page
  filteredAuditTrails: AuditTrail[] = [];
  searchQuery: string = '';
  searchInput: string = '';

  constructor(
    private auditLogService: AuditlogService,
    private toastr: ToastrService,
    private customerService: CustomersService,
    private dataService: DataServiceService
  ) {}

  ngOnInit(): void {
    this.loadAuditLog();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
    this.filteredAuditTrails = [...this.AuditTrail];
  }

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

  loadAuditLog() {
    try {
      this.auditLogService.getAuditLog().subscribe((result: any) => {
        this.AuditTrail = result;
        console.log(this.AuditTrail);
      });
    } catch (error) {
      console.error(error);
      this.toastr.error(
        'Error, failed to connect to the database',
        'AuditLog Table'
      );
    }
  }

  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    this.currentAudit.quantity = 1;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
  }


  


  async search(): Promise<void> {
    const searchText = this.searchInput.toLowerCase();
    
    if (!searchText) {
      // If the search input is empty, reset the table to show all data
      this.loadAuditLog();
      return;
    }
  
    try {
      // Fetch the full audit log
      const result: AuditTrail[] = await this.auditLogService.getAuditLog().toPromise();
      
      // Filter the AuditTrail array based on the search input
      this.AuditTrail = result.filter((audit) => {
        return (
          audit.transactionDate?.toString().toLowerCase().includes(searchText) ||
          audit.userName?.toLowerCase().includes(searchText) ||
          audit.userEmail?.toLowerCase().includes(searchText) ||
          audit.buttonPressed?.toLowerCase().includes(searchText)
        );
      });
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, failed to connect to the database', 'AuditLog Table');
    }
  }

  // filterAuditTrails() {
  //   if (this.searchQuery.trim() === '') {
  //     this.filteredAuditTrails = [...this.AuditTrail]; // If the search query is empty, show all wines
  //   } else {
  //     const searchTerm = this.searchQuery.toLowerCase().trim();
  //     this.filteredAuditTrails = this.AuditTrail.filter(audit =>
  //       audit.transactionDate?.toString().toLowerCase().includes(searchTerm) ||
  //       audit.userName?.toLowerCase().includes(searchTerm) ||
  //       audit.userEmail?.toLowerCase().includes(searchTerm) ||
  //       audit.buttonPressed?.toLowerCase().includes(searchTerm)
  //     );
  //   }
  // }

  // get paginatedAuditTrails(): AuditTrail[] {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   return this.filteredAuditTrails.slice(startIndex, endIndex);
  // }

  // changePage(page: number) {
  //   this.currentPage = page;
  // }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.changePage(this.currentPage - 1);
  //   }
  // }

  // nextPage() {
  //   const totalPages = Math.ceil(this.filteredAuditTrails.length / this.pageSize);
  //   if (this.currentPage < totalPages) {
  //     this.changePage(this.currentPage + 1);
  //   }
  // }

  // get totalPages(): number {
  //   return Math.ceil(this.filteredAuditTrails.length / this.pageSize);
  // }
}
