import { Component } from '@angular/core';
import { EarlyBirdService } from 'src/app/admin/services/earlybird.service';
import { EventService } from 'src/app/admin/services/event.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { Event } from 'src/app/Model/event';
import { PaymentService } from '../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../services/data-service.service';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})
export class ClientEventsComponent {

  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];

  constructor(private eventService: EventService, private earlyBirdService: EarlyBirdService,  private paymentService: PaymentService, private toastr: ToastrService, private loginService: DataServiceService ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadEventData();
      await this.loadEarlyBirdData();
    } catch (error) {
      console.error(error);
    }
  }

  async loadEventData(): Promise<void> {
    this.events = await this.eventService.getEvents();
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

}
