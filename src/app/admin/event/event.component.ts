import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from 'src/app/Model/event';
import { ToastrService } from 'ngx-toastr';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { EventTypeService } from '../services/event-type.service';
import { EventPriceService } from '../services/event-price.service';
import { EarlyBirdService } from '../services/earlybird.service';
import { EventType } from 'src/app/Model/eventtype';
import { EventPrice } from 'src/app/Model/eventprice';
import { EarlyBird } from 'src/app/Model/earlybird';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  selectedFile: File | null = null;

  tempEvent: Event = new Event();
  minDateTime!: string;
  fileUploaded = false;  // Property to track if a file is uploaded



  constructor(private toastr: ToastrService, private eventService: EventService, private eventTypeService: EventTypeService, private eventPriceService: EventPriceService, private earlyBirdService: EarlyBirdService,
    private customerService: CustomersService,
    private auditLogService: AuditlogService,
    private dataService: DataServiceService) { }

  async ngOnInit(): Promise<void> {
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();

    try {
      await this.loadEventData();
      await this.loadDropdownData();
    } catch (error) {
      console.error(error);
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Convert local time to UTC
    this.minDateTime = now.toISOString().slice(0, 16);

    this.filteredEvents = this.events;
    this.currentEvent.earlyBirdID = undefined;
    this.currentEvent.eventTypeID = undefined;
  }

  invalidLeadingZero: boolean = false;

  sanitizeInput(value: number): void {
    const strValue = value.toString();
    if (strValue.startsWith('0')) {
      // Remove leading zeros and set invalid flag
      this.invalidLeadingZero = true;
    } else {
      this.invalidLeadingZero = false;
    }
  }

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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
  currentEventImageURL!: string;
  searchQuery: string = ''; // Variable to capture user input
  filteredEvents: Event[] = [];
  public selectedEventImageURL: string |undefined;

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

  characterCount = 0;

  updateCharacterCount(event: any) {
    this.characterCount = event.target.value.length;
  }


  // Event modal-related methods
  openAddEventModal() {
    this.displayedEventImageURL = "";
    let filePathInput = document.getElementById('eventImage') as HTMLElement;
      if (filePathInput) {
          filePathInput.style.setProperty('--dynamic-content', `"Pick an image file"`); // Note the use of backticks and quotes
      }
    this.editingEvent = false;
    this.currentEvent = new Event();
    this.showEventModal = true;
  }

  openEditEventModal(id: number) {
    this.editingEvent = true;
    // Set the image URL/path of the event being edited.


this.fileUploaded = true;
    let eventToEdit = this.events.find(event => event.eventID === id);
    if (eventToEdit?.filePath) {
      var lastUnderScore = eventToEdit?.filePath.lastIndexOf('_');
        
        // Extract the value after the last "_" and before the last "."
        var extractedValue = eventToEdit?.filePath.substring(lastUnderScore + 1);
        
        // Set this value as the value of the CSS variable for the input field
        let filePathInput = document.getElementById('eventImage') as HTMLInputElement;
        if (filePathInput) {
            filePathInput.style.setProperty('--dynamic-content', `"${extractedValue}"`);
            filePathInput.placeholder = "";  // Clear actual placeholder
        }
  }

    if (eventToEdit) {
      this.selectedEventImageURL = eventToEdit?.filePath;
      this.displayedEventImageURL = this.selectedEventImageURL;
      this.tempEvent = {
        ...eventToEdit,
        filePath: eventToEdit.filePath,
        displayItem: eventToEdit.displayItem

      };
      this.currentEvent = this.tempEvent;
    }
    this.showEventModal = true;
  }

  closeEventModal() {
     if (this.selectedEventImageURL && this.displayedEventImageURL !== this.selectedEventImageURL) {
      this.displayedEventImageURL = this.selectedEventImageURL;
  }
    this.showEventModal = false;
    this.ngOnInit();
    this.fileUploaded = false;
  }

  openDeleteEventModal(event: any): void {
    console.log(event); // add this line
    this.eventToDelete = event.eventID;
    this.eventToDeleteDetails = event;
    this.showDeleteEventModal = true;
  }

  closeDeleteEventModal(): void {
    this.showDeleteEventModal = false;
  }

  getEarlyBirdById(id: number): EarlyBird | undefined {
    var earlyBirdvalue = this.earlyBirds.find(earlyBird => earlyBird.earlyBirdID === id);
    if (earlyBirdvalue === undefined) {
      earlyBirdvalue = new EarlyBird();
    }
    return earlyBirdvalue;
  }


  // CRUD Event
  isSubmitting = false;

  async submitEventForm(form: NgForm): Promise<void> {
    // Check if not currently submitting
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Adjustments for consistency
      // if (this.currentEvent.earlyBird === null) {
      //   this.currentEvent.earlyBird = undefined;
      // }
      if (this.currentEvent.earlyBirdID === null) {
        this.currentEvent.earlyBirdID = 0
      }
      if (this.editingEvent) {
        const pathArray = this.currentEvent.filePath.split('/');
        this.currentEvent.filePath = pathArray[pathArray.length - 1];
      }
      try {
        const formData = new FormData();

        for (const key in this.currentEvent) {
          if (this.currentEvent.hasOwnProperty(key)) {
            formData.append(key, (this.currentEvent as any)[key]);
          }
        }

        // Log formData entries for debugging
        console.log("Logging formData Entries:");
        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        const extractFileName = (path: string): string => {
          const parts = path.split('_');
          return parts[parts.length - 1];
        };

        let oldEventImagePath = this.currentEvent.filePath;
        let oldEventImagePathConvert = extractFileName(oldEventImagePath);
        if (this.selectedFile) {
          formData.delete('File');
          formData.delete('filePath');
          formData.append('filePath', "");

          if (this.selectedFile.name != oldEventImagePathConvert && this.selectedFile.name.length != 0) {
            formData.append('File', this.selectedFile);
          } else {
            formData.append('File', this.selectedFile);
          }
        } else if (this.selectedFile == null) {
          formData.delete('File');
          formData.delete('filePath');
          formData.append('filePath', "");
          formData.append('File', oldEventImagePathConvert);
        }

        if (this.editingEvent) {
          await this.eventService.updateEvent(this.currentEvent.eventID!, formData);
          const updatedEvent = await this.eventService.getEvent(this.currentEvent.eventID);
          const index = this.events.findIndex(event => event.eventID === this.currentEvent.eventID);

          if (index !== -1) {
            this.events[index] = updatedEvent;
          }
          this.toastr.success('Event has been updated successfully.', 'Event Form');
        } else {
          const createdEvent = await this.eventService.addEvent(formData);
          this.events.push(createdEvent);

          // Validate and format eventPrice
          const eventPriceToAdd = new EventPrice();
          eventPriceToAdd.amount = createdEvent.price;
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
      } finally {
        this.isSubmitting = false;  // Set isSubmitting back to false at the end, no matter what happens
      }
    }
  }


  public displayedEventImageURL: string | undefined;

   getObjectURL(file: File): string {
    // Clean up any old blob URLs to prevent memory leak
    if (this.displayedEventImageURL) {
      URL.revokeObjectURL(this.displayedEventImageURL);
    }
    return URL.createObjectURL(file);
  }


  // Add this new variable to track if uploaded file is of invalid type
  invalidFileType: boolean = false;

  onFileSelected(event: any) {
    // Check if any file is selected
    const file = event.target.files && event.target.files[0];
    if (!file) {
      this.fileUploaded = false;
      return;
    }
  
    // Check if the selected file is of a valid image type
    const fileType = file.type;
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(fileType)) {
      this.invalidFileType = true;
      this.fileUploaded = false;
      return;
    }
    this.selectedEventImageURL = this.getObjectURL(file);
  
    // If it's a valid image type, proceed with setting the necessary variables
    this.invalidFileType = false;
    this.selectedFile = file;
    let filePathInput = document.getElementById('eventImage') as HTMLElement;
      if (filePathInput) {
          filePathInput.style.setProperty('--dynamic-content', `"${this.selectedFile?.name}"`); // Note the use of backticks and quotes
      }
    this.currentEvent.filePath = file.name;
  
    // Create and revoke object URLs to prevent memory leak
    if (this.displayedEventImageURL) {
      URL.revokeObjectURL(this.displayedEventImageURL);
    }
  
    this.displayedEventImageURL = URL.createObjectURL(file);
    this.fileUploaded = true; // Mark file as successfully uploaded
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
    } catch (error: any) {
      console.error(error);
      if (error?.status === 400) {
        // Assuming that the server sends the error message in the 'message' field.
        const serverMessage = error?.error?.message ?? 'Event cannot be deleted because tickets have already been purchased';
        this.toastr.warning(serverMessage, 'Delete Event');
      } else if (error?.status) {
        this.toastr.error('Error, please try again', 'Delete Event');
      } else {
        this.toastr.error('An unknown error occurred', 'Delete Event');
      }
    }
  }
  
  




  async onDisplayCheckboxChange(eventToUpdate: Event) {
    try {
      const formData = new FormData();

      for (const key in eventToUpdate) {
        if (eventToUpdate.hasOwnProperty(key)) {
          formData.append(key, (eventToUpdate as any)[key]);
        }
      }

      await this.eventService.updateEvent(eventToUpdate.eventID, formData);
      this.toastr.success('Display setting updated successfully.', 'Event Display Update');

    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Event Display Update');
    }
  }

  async toggleDisplay(event: Event): Promise<void> {
    try {
      // Toggle the display property of the event object
      event.displayItem = !event.displayItem;

      // Update the event using the service method
      await this.eventService.toggleEventDisplay(event.eventID);

      // Optional: Provide a success message
      this.toastr.success('Event display toggled successfully.', 'Toggle Display');

    } catch (error) {
      console.error('Error toggling display:', error);

      // Optional: Provide an error message
      this.toastr.error('An error occurred while toggling the display. Please try again.', 'Toggle Display');
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
      'Event: ' + (this.editingEvent ? 'Updated' : 'Added');
    this.AddAuditLog(auditLogMessage);
  }

  filterEvents(): void {
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, show all events
      this.filteredEvents = this.events;
    } else {
      // If there is a search query, filter events based on it
      const query = this.searchQuery.toLowerCase();
      this.filteredEvents = this.events.filter(event => {
        // Your filter logic here, e.g., searching through all fields
        return (
          event.name.toLowerCase().includes(query) ||
          (event.eventType?.eventTypeName || '').toLowerCase().includes(query) ||
          event.eventDate.toString().toLowerCase().includes(query) ||
          event.tickets_Available.toString().toLowerCase().includes(query) ||
          event.tickets_Sold.toString().toLowerCase().includes(query) ||
          event.price.toString().toLowerCase().includes(query)
          // Add more fields as needed
        );
      });
    }
  }




}
// EarlyBird END