import { Component } from '@angular/core';
import { AuditlogService } from '../services/auditlog.service';


@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent {
  selectedTab: string = 'tab1';

  constructor (private auditLogService: AuditlogService){}

}
