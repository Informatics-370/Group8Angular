import { Component } from '@angular/core';
import { EarlyBirdService } from 'src/app/admin/services/earlybird.service';
import { EventService } from 'src/app/admin/services/event.service';
import { EarlyBird } from 'src/app/Model/earlybird';
import { Event } from 'src/app/Model/event';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})
export class ClientEventsComponent {

  events: Event[] = [];
  earlyBirds: EarlyBird[] = [];

  constructor(private eventService: EventService, private earlyBirdService: EarlyBirdService ) { }

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

}
