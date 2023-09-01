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
}
