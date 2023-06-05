import { Component, OnInit } from '@angular/core';
import { EventPriceService } from '../services/event-price.service';
import { EventPrice } from 'src/app/Model/eventprice';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private eventPriceService: EventPriceService, private toastr : ToastrService){ }

  ngOnInit(): void {
    this.loadEventPrices();
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
}
