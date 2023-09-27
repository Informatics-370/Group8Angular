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
  pageSize: number = 15; // Items per page
  filteredAuditTrails: AuditTrail[] = [];
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

    setTimeout(() => {
      console.log("OnInit: ", this.filteredAuditTrails);
      this.filteredAuditTrails = [...this.AuditTrail];
      this.filterAuditTrails();
      this.sortTable(this.sortBy);
    }, 200);
    
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
        console.log('LOAD AUDIT ',this.AuditTrail);
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


  


  // async search(): Promise<void> {
  //   const searchText = this.searchInput.toLowerCase();
    
  //   if (!searchText) {
  //     // If the search input is empty, reset the table to show all data
  //     this.loadAuditLog();
  //     return;
  //   }
  
  //   try {
  //     // Fetch the full audit log
  //     const result: AuditTrail[] = await this.auditLogService.getAuditLog().toPromise();
      
  //     // Filter the AuditTrail array based on the search input
  //     this.AuditTrail = result.filter((audit) => {
  //       return (
  //         audit.transactionDate?.toString().toLowerCase().includes(searchText) ||
  //         audit.userName?.toLowerCase().includes(searchText) ||
  //         audit.userEmail?.toLowerCase().includes(searchText) ||
  //         audit.buttonPressed?.toLowerCase().includes(searchText)
  //       );
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.toastr.error('Error, failed to connect to the database', 'AuditLog Table');
  //   }
  // }

  filterAuditTrails() {
    if (this.searchInput.trim() === '') {
      this.filteredAuditTrails = [...this.AuditTrail]; // If the search query is empty, show all wines
    } else {
      const searchTerm = this.searchInput.toLowerCase().trim();
      this.filteredAuditTrails = this.AuditTrail.filter(audit =>
        audit.transactionDate?.toString().toLowerCase().includes(searchTerm) ||
        audit.userName?.toLowerCase().includes(searchTerm) ||
        audit.userEmail?.toLowerCase().includes(searchTerm) ||
        audit.buttonPressed?.toLowerCase().includes(searchTerm)
      );
    }
  }

  get paginatedAuditTrails(): AuditTrail[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAuditTrails.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredAuditTrails.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAuditTrails.length / this.pageSize);
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.filterAuditTrails(); 
    this.sortDirection = 'asc';
    this.sortTable(this.sortBy);
  }


  sortBy: string = 'transactionDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortTable(column: string) {
    if (this.sortBy === column) {
      // Reverse the sorting direction if the same column is clicked again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column to sort by and reset sorting direction to ascending
      this.sortBy = column;
      this.sortDirection = 'desc'; // Set default sorting direction to descending
    }

    // Sort the filteredAuditTrails based on the selected column and direction
    this.filteredAuditTrails.sort((a, b) => {
      const aValue = a[this.sortBy as keyof AuditTrail];
      const bValue = b[this.sortBy as keyof AuditTrail];

      // Check if aValue or bValue is undefined and handle it
      if (aValue === undefined || bValue === undefined) {
        // Place undefined values at the end when sorting ascending, and at the beginning when sorting descending
        if (this.sortDirection === 'asc') {
          return aValue === undefined ? 1 : -1;
        } else {
          return aValue === undefined ? -1 : 1;
        }
      }

      // For string columns (userName and userEmail), use localeCompare for sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (this.sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }

      // For date columns (transactionDate), parse and compare as dates
      if (this.sortBy === 'transactionDate') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);

        if (this.sortDirection === 'asc') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      }

      // For numeric columns (quantity), compare as numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (this.sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      // Default: no special handling, compare as-is
      if (this.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

}
