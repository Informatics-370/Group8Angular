import { Component, OnInit } from '@angular/core';
import { EventTypeService } from '../services/event-type.service';
import { EventType } from 'src/app/Model/eventtype';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.component.html',
  styleUrls: ['./event-type.component.css']
})
export class EventTypeComponent implements OnInit {
  eventTypes: EventType[] = [];
  currentEventType: EventType = new EventType();
  showEventTypeModal: boolean = false;
  editingEventType: boolean = false;
  showDeleteEventTypeModal = false;
  eventTypeToDeleteDetails: any;
  eventTypeToDelete: any = null;

  constructor(private eventTypeService: EventTypeService, private toastr : ToastrService
    , private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService){ }

  ngOnInit(): void {
    this.loadEventTypes();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  async loadEventTypes(): Promise<void> {
    try {
      this.eventTypes = await this.eventTypeService.getEventTypes();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Event Type');
    }
  }

  openAddEventTypeModal() {
    this.editingEventType = false;
    this.currentEventType = new EventType();
    this.showEventTypeModal = true;
  }

  openEditEventTypeModal(id: number) {
    this.editingEventType = true;
    const originalEventType = this.eventTypes.find(eventType => eventType.eventTypeID === id);
    if (originalEventType) {
      this.currentEventType = {...originalEventType};
    }
    this.showEventTypeModal = true;
  }

  closeEventTypeModal() {
    this.showEventTypeModal = false;
  }

  openDeleteEventTypeModal(eventType: any): void {
    this.eventTypeToDelete = eventType.eventTypeID;
    this.eventTypeToDeleteDetails = eventType;
    this.showDeleteEventTypeModal = true;
  }

  closeDeleteEventTypeModal(): void {
    this.showDeleteEventTypeModal = false;
  }

  async submitEventTypeForm(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        if (this.editingEventType) {
          await this.eventTypeService.updateEventType(this.currentEventType.eventTypeID!, this.currentEventType);
          const index = this.eventTypes.findIndex(eventType => eventType.eventTypeID === this.currentEventType.eventTypeID);
          if (index !== -1) {
            this.eventTypes[index] = this.currentEventType;
          }
          this.toastr.success('Successfully updated', 'Update');
        } else {
          const data = await this.eventTypeService.addEventType(this.currentEventType);
          this.eventTypes.push(data);
          this.toastr.success('Successfully added', 'Add');
        }
        this.closeEventTypeModal();
        if (!this.editingEventType) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, please try again');
      }
    }
  }

  async deleteEventType(): Promise<void> {
    if (this.eventTypeToDelete !== null) {
      try {
        await this.eventTypeService.deleteEventType(this.eventTypeToDelete);
        this.eventTypes = this.eventTypes.filter(eventType => eventType.eventTypeID !== this.eventTypeToDelete);
        this.toastr.success('Successfully deleted', 'Delete');
      } catch (error) {
        console.error('Error deleting EventType:', error);
        this.toastr.error('Error, please try again', 'Delete');
      }
      this.closeDeleteEventTypeModal();
    }
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
      'Event Type: ' + (this.editingEventType ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}
