import { Component } from '@angular/core';
import { EventService } from 'src/app/admin/services/event.service';
import { Event } from 'src/app/Model/event';

@Component({
  selector: 'app-client-events',
  templateUrl: './client-events.component.html',
  styleUrls: ['./client-events.component.css']
})
export class ClientEventsComponent {

  events: Event[] = [];

  constructor(private eventService: EventService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.loadEventData();
    } catch (error) {
      console.error(error);
    }
  }

  async loadEventData(): Promise<void> {
    this.events = await this.eventService.getEvents();
  }

}
