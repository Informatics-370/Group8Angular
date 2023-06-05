import { Component, OnInit } from '@angular/core';
import { EventTypeService } from '../services/event-type.service';
import { EventType } from 'src/app/Model/eventtype';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private eventTypeService: EventTypeService, private toastr : ToastrService){ }

  ngOnInit(): void {
    this.loadEventTypes();
  }

  async loadEventTypes(): Promise<void> {
    try {
      this.eventTypes = await this.eventTypeService.getEventTypes();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Event Type Table');
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
}
