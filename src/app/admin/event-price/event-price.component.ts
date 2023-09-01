import { Component, OnInit } from '@angular/core';
import { EventPriceService } from '../services/event-price.service';
import { EventPrice } from 'src/app/Model/eventprice';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-event-price',
  templateUrl: './event-price.component.html',
  styleUrls: ['./event-price.component.css']
})
export class EventPriceComponent implements OnInit {
  eventPrices: EventPrice[] = [];
  currentEventPrice: EventPrice = new EventPrice();
  showEventPriceModal: boolean = false;
  editingEventPrice: boolean = false;
  showDeleteEventPriceModal = false;
  eventPriceToDeleteDetails: any;
  eventPriceToDelete: any = null;

  constructor(private eventPriceService: EventPriceService, private toastr : ToastrService,
    private customerService: CustomersService,
    private auditLogService: AuditlogService,
    private dataService: DataServiceService){ }

  ngOnInit(): void {
    this.loadEventPrices();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  async loadEventPrices(): Promise<void> {
    try {
      this.eventPrices = await this.eventPriceService.getEventPrices();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Event Price Table');
    }
  }

  openAddEventPriceModal() {
    this.editingEventPrice = false;
    this.currentEventPrice = new EventPrice();
    this.showEventPriceModal = true;
  }

  openEditEventPriceModal(id: number) {
    this.editingEventPrice = true;
    const originalEventPrice = this.eventPrices.find(eventPrice => eventPrice.eventPriceID === id);
    if (originalEventPrice) {
      this.currentEventPrice = {...originalEventPrice};
    }
    this.showEventPriceModal = true;
  }

  closeEventPriceModal() {
    this.showEventPriceModal = false;
  }

  openDeleteEventPriceModal(eventPrice: any): void {
    this.eventPriceToDelete = eventPrice.eventPriceID;
    this.eventPriceToDeleteDetails = eventPrice;
    this.showDeleteEventPriceModal = true;
  }

  closeDeleteEventPriceModal(): void {
    this.showDeleteEventPriceModal = false;
  }

  async submitEventPriceForm(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        if (this.editingEventPrice) {
          await this.eventPriceService.updateEventPrice(this.currentEventPrice.eventPriceID!, this.currentEventPrice);
          const index = this.eventPrices.findIndex(eventPrice => eventPrice.eventPriceID === this.currentEventPrice.eventPriceID);
          if (index !== -1) {
            this.eventPrices[index] = this.currentEventPrice;
          }
          this.toastr.success('Successfully updated', 'Update');
        } else {
          const data = await this.eventPriceService.addEventPrice(this.currentEventPrice);
          this.eventPrices.push(data);
          this.toastr.success('Successfully added', 'Add');
        }
        this.closeEventPriceModal();
        if (!this.editingEventPrice) {
          form.resetForm();
        }
      } catch (error) {
        console.error(error);
        this.toastr.error('Error, please try again');
      }
    }
  }

  async deleteEventPrice(): Promise<void> {
    if (this.eventPriceToDelete !== null) {
      try {
        await this.eventPriceService.deleteEventPrice(this.eventPriceToDelete);
        this.eventPrices = this.eventPrices.filter(eventPrice => eventPrice.eventPriceID !== this.eventPriceToDelete);
        this.toastr.success('Successfully deleted', 'Delete');
      } catch (error) {
        console.error('Error deleting EventPrice:', error);
        this.toastr.error('Error, please try again', 'Delete');
      }
      this.closeDeleteEventPriceModal();
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
      'Event Price: ' + (this.editingEventPrice ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }
}
