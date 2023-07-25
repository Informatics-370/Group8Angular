import { Component } from '@angular/core';
import { EarlyBirdService } from 'src/app/admin/services/earlybird.service';
import { EventService } from 'src/app/admin/services/event.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { Event } from 'src/app/Model/event';
import { PaymentService } from '../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../services/data-service.service';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})
export class ClientEventsComponent {

  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];
  purchasedEvents: string[] = [];

  constructor(private eventService: EventService, private earlyBirdService: EarlyBirdService,  private paymentService: PaymentService, private toastr: ToastrService, private loginService: DataServiceService ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadEventData();
      await this.loadEarlyBirdData();
  
      // Check if the user is logged in
      if (this.loginService.userValue?.email) {
        this.purchasedEvents = (await this.paymentService.getUserPurchases(this.loginService.userValue.email).toPromise()) ?? [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loadEventData(): Promise<void> {
    this.events = await this.eventService.getEvents();
  }

  isPurchased(eventId: string): boolean {
    return this.purchasedEvents.includes(eventId);
  }

  formatDate(eventDate: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return eventDate.toLocaleDateString('en-US', options);
  }

  async loadEarlyBirdData(): Promise<void> {
    this.earlyBirds = await this.earlyBirdService.getEarlyBirds();

    // associate Early Bird data with Event data
    this.events.forEach(event => {
      event.earlyBird = this.earlyBirds.find(earlyBird => earlyBird.earlyBirdID === event.earlyBirdID) || new EarlyBird();
    });
  }







  async onBuyTicket(event: Event) {
    // Get current user
    const isUserLoggedIn = this.loginService.isUserLoggedIn(); 
  
    // If there is no user, show toastr notification and return
    if (!isUserLoggedIn) {
      this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
      return;
    }
  
  // Check ticket availability and calculate the price
  try {
    const purchaseResponse = await this.eventService.purchaseTicket(event.eventID);
    if (!purchaseResponse.success) {
      this.toastr.error(purchaseResponse.message, 'Purchase');
      return;
    }
  
    // Find the EarlyBird object based on earlyBirdID
  const earlyBird = event.earlyBird;
  
    // Start the payment process with the final price
    if (event.earlyBird) {
      if (typeof event.earlyBird.limit !== 'undefined' && event.tickets_Sold < event.earlyBird.limit) {
        if (typeof event.earlyBird.percentage !== 'undefined') {
          // Apply early bird discount
          event.eventPrice = purchaseResponse.price * (1 - event.earlyBird.percentage / 100);
           // Add Toastr notification for early bird discount
           this.toastr.success(`Congrats! You qualify for an EarlyBird discount of ${event.earlyBird.percentage}%`, 'Discount');
        }
      } else {
        // Regular price
        event.eventPrice = purchaseResponse.price;
      }
    }
  } catch (error) {
    console.error(error);
    this.toastr.error('An error occurred, please try again.', 'Purchase');
    return;
  }
      // start the payment process with the final price
  const ticketPurchase: TicketPurchase = {
    userEmail: this.loginService.userValue?.email ?? '',
    eventId: event.eventID,
    eventDate: event.eventDate,
    purchaseDate: new Date(),
    ticketPrice: event.eventPrice,
    eventName: event.eventName,  // New field
    description: event.description,  // New field
  };

  

      this.paymentService.initiatePayment(event).subscribe(
        (payfastRequest: any) => {
          // Create a form
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://sandbox.payfast.co.za/eng/process';
          form.target = '_self';
    
          // Add the form fields
          for (const key in payfastRequest) {
            if (payfastRequest.hasOwnProperty(key)) {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = key;
              hiddenField.value = payfastRequest[key];
              form.appendChild(hiddenField);
            }
          }
    
          // Add the form to the page and submit it
          document.body.appendChild(form);
          form.submit();
          
        },
        (error: HttpErrorResponse) => {
          // It's better to handle "User is not logged in" error in payment service
          // But if for some reason it comes here, then show toastr notification as well
          if (error.error === 'User is not logged in') {
            this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
            console.error('User is not logged in');
          } else {
            console.error(error);
          }
        }
      );
      
    }
  



    saveTicketPurchase(event: Event) {
 // Ensure eventDate is a Date object
 event.eventDate = new Date(event.eventDate);

 // Get the event's date
 const eventDate = event.eventDate;

 // Create a new date object with only the year, month, and day
 const dateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

      // Start the payment process with the final price
      const ticketPurchase: TicketPurchase = {
        userEmail: this.loginService.userValue?.email ?? '',
        eventId: event.eventID,
        eventDate: dateOnly,
        purchaseDate: new Date(),
        ticketPrice: event.eventPrice,
        eventName: event.eventName,  // New field
        description: event.description,  // New field
      };
    
      // Save the ticket purchase
      this.paymentService.saveTicketPurchase(ticketPurchase).subscribe(
        (response) => {
          // Handle the success response, such as navigating the user to another page
          console.log(response);
          this.toastr.success('Ticket purchase saved successfully.', 'Purchase');
        },
        (error: HttpErrorResponse) => {
          // Handle the error response
          console.error(error);
          this.toastr.error('An error occurred while saving ticket purchase, please try again.', 'Purchase');
        }
      );
    }





  async purchaseTicket(eventID: number): Promise<void> {
    try {
      const response = await this.eventService.purchaseTicket(eventID);
      if (response.success) {
        this.toastr.success('Ticket purchased successfully.', 'Purchase');
      } else {
        this.toastr.error(response.message, 'Purchase');
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Purchase');
    }
  }


  async handleTicketPurchase(event: Event) {
    const isUserLoggedIn = this.loginService.isUserLoggedIn(); 
  
    // If there is no user, show toastr notification and return
    if (!isUserLoggedIn) {
      this.toastr.warning('Please log in to purchase a ticket.', 'Warning');
      return;
    }
  
    try {
      await this.onBuyTicket(event); // Buying ticket process
  
      // After successful buying process, save the ticket purchase in the database
      this.saveTicketPurchase(event);
    } catch (error) {
      console.error(error);
      this.toastr.error('An error occurred, please try again.', 'Purchase');
      return;
    }
  }
  
  
}
