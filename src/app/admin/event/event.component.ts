import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from 'src/app/Model/event';
import { ToastrService } from 'ngx-toastr';
import { FormControl,NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { EventTypeService } from '../services/event-type.service';
import { EventPriceService } from '../services/event-price.service';
import { EarlyBirdService } from '../services/earlybird.service';
import { EventType } from 'src/app/Model/eventtype';
import { EventPrice } from 'src/app/Model/eventprice';
import { EarlyBird } from 'src/app/Model/earlybird';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  selectedFile: File | null = null;

  tempEvent: Event = new Event();
  constructor(private toastr: ToastrService, private eventService: EventService, private eventTypeService: EventTypeService, private eventPriceService: EventPriceService, private earlyBirdService: EarlyBirdService) { }
  
  async ngOnInit(): Promise<void> {
    try {
      await this.loadEventData();
      await this.loadDropdownData();
    } catch (error) {
      console.error(error);
    }
  }

  async loadEventData(): Promise<void> {
    this.events = await this.eventService.getEvents();
  }

  async loadDropdownData(): Promise<void> {
    this.eventTypes = await this.eventTypeService.getEventTypes();
    this.eventPrices = await this.eventPriceService.getEventPrices();
    this.earlyBirds = await this.earlyBirdService.getEarlyBirds();
  }


  events: Event[] = [];
  eventTypes: EventType[] = [];
  eventPrices: EventPrice[] = [];
  earlyBirds: EarlyBird[] = [];
  currentEvent: Event = new Event();
  showEventModal: boolean = false;
  editingEvent: boolean = false;
  showDeleteEventModal = false;
  eventToDeleteDetails: any;
  eventToDelete: any = null;
  
  //--------------------------------------------------------------------------------------------------------------------------------
 // Methods to load and get event-related information
async loadEvents(): Promise<void> {
  try {
    this.events = await this.eventService.getEvents();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Event Table');
  }
}

getEventTypeName(eventTypeID: number): string {
  const eventType = this.eventTypes.find(e => e.eventTypeID === eventTypeID);
  return eventType?.eventTypeName || 'Unknown';
}

getEventPriceAmount(eventPriceID: number): number {
  const eventPrice = this.eventPrices.find(e => e.eventPriceID === eventPriceID);
  return eventPrice?.amount || 0;
}

getEarlyBirdPercentage(earlyBirdID: number): number {
  const earlyBird = this.earlyBirds.find(e => e.earlyBirdID === earlyBirdID);
  return earlyBird?.percentage || 0;
}

// Event modal-related methods
openAddEventModal() {
  this.editingEvent = false;
  this.currentEvent = new Event();
  this.showEventModal = true;
}

openEditEventModal(id: number) {
  this.editingEvent = true;
  let eventToEdit = this.events.find(event => event.eventID === id);
  if (eventToEdit) {
    this.tempEvent = {
      ...eventToEdit,
      imagePath: eventToEdit.imagePath,
    };
    this.currentEvent = this.tempEvent;
    this.currentEvent = this.tempEvent;
  }
  this.showEventModal = true;
}

closeEventModal() {
  this.showEventModal = false;
  this.ngOnInit();
}

openDeleteEventModal(event: any): void {
  this.eventToDelete = event.eventID;
  this.eventToDeleteDetails = event;
  this.showDeleteEventModal = true;
}

closeDeleteEventModal(): void {
  this.showDeleteEventModal = false;
}

// CRUD Event
async submitEventForm(form: NgForm): Promise<void> {
  if (form.valid) {
    try {
      const formData = new FormData();

      for (const key in this.currentEvent) {
        if (this.currentEvent.hasOwnProperty(key)) {
          formData.append(key, (this.currentEvent as any)[key]);
        }
      }

      if (this.selectedFile) {
        formData.append('ImagePath', this.selectedFile, this.selectedFile.name);
    }

      if (this.editingEvent) {
        await this.eventService.updateEvent(this.currentEvent.eventID, formData);
        const updatedEvent = await this.eventService.getEvent(this.currentEvent.eventID); // Fetch the updated event.
        const index = this.events.findIndex(event => event.eventID === this.currentEvent.eventID);
        if (index !== -1) {
          this.events[index] = updatedEvent; // Update the event in the events array.
        }
        this.toastr.success('Event has been updated successfully.', 'Event Form');
      } else {
        console.log(this.currentEvent);
        const createdEvent = await this.eventService.addEvent(formData);
        this.events.push(createdEvent);

        // Validate and format eventPrice
        const eventPriceToAdd = new EventPrice();
        eventPriceToAdd.amount = createdEvent.eventPrice;
        eventPriceToAdd.date = createdEvent.eventDate;

        const addedEventPrice = await this.eventPriceService.addEventPrice(eventPriceToAdd);
        this.eventPrices.push(addedEventPrice);

        this.toastr.success('Event has been added successfully.', 'Event Form');
      }

      this.closeEventModal();
      form.resetForm();
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Event Form');
    }
  }
}

getObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

onFileSelected(event: any) {
  if (event.target.files && event.target.files[0]) {
    this.selectedFile = event.target.files[0];
    this.currentEvent.imagePath = this.selectedFile?.name ?? '';
  }
}

async deleteEvent(): Promise<void> {
  try {
    await this.eventService.deleteEvent(this.eventToDelete);
    const index = this.events.findIndex(event => event.eventID === this.eventToDelete);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
    this.toastr.success('Event has been deleted successfully.', 'Delete Event');
    this.closeDeleteEventModal();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Delete Event');
  }
}

}
// EarlyBird END