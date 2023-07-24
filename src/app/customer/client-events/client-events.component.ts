import { Component } from '@angular/core';
import { EarlyBirdService } from 'src/app/admin/services/earlybird.service';
import { EventService } from 'src/app/admin/services/event.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { Event } from 'src/app/Model/event';
import { PaymentService } from '../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})
export class ClientEventsComponent {

  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];

  constructor(private eventService: EventService, private earlyBirdService: EarlyBirdService,  private paymentService: PaymentService ) { }

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

  onBuyTicket(event: Event) {
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
        if (error.error === 'User is not logged in') {
          console.error('User is not logged in');
        } else {
          console.error(error);
        }
      }
    );
  }
  
}
