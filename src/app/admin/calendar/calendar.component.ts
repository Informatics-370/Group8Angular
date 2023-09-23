import { Component } from '@angular/core';
import { Event } from 'src/app/Model/event';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  events: Event[] = [];
  currentDate = new Date();
  year = this.currentDate.getFullYear();
  calendarData: { month: string; days: { dayOfMonth: number; events: Event[] }[] }[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth = this.months[this.currentDate.getMonth()] + ' ' + this.year;

  monthIndex = this.currentDate.getMonth();
  calendarWeeks: { days: { dayOfMonth: number; events: Event[] }[] }[] = [];

  constructor( private eventService: EventService) {}

  async ngOnInit(): Promise<void> {
      await this.loadEventData();
      this.generateCalendarData();
  }

  async loadEventData(): Promise<void> {
    this.events = await this.eventService.getEvents();
  }

  generateCalendarData() {
    this.calendarWeeks = [];
  
    const daysInMonth = new Date(this.year, this.monthIndex + 1, 0).getDate();
    let currentWeek: { days: { dayOfMonth: number; events: Event[] }[] } = { days: [] };
  
    const firstDayOfMonth = new Date(this.year, this.monthIndex, 1);
    const offset = firstDayOfMonth.getDay(); 
  
    for (let i = 0; i < offset; i++) {
      currentWeek.days.push({ dayOfMonth: 0, events: [] });
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      let dayData: { dayOfMonth: number; events: Event[] } = {
        dayOfMonth: day,
        events: []
      };
  
      for (let event of this.events) {
        let eventDate = new Date(event.eventDate);
        if (
          eventDate.getFullYear() === this.year &&
          eventDate.getMonth() === this.monthIndex &&
          eventDate.getDate() === day
        ) {
          dayData.events.push(event);
        }
      }
  
      currentWeek.days.push(dayData);

      if (currentWeek.days.length === 7 || day === daysInMonth) {
        this.calendarWeeks.push(currentWeek);
        currentWeek = { days: [] };
      }
    }
  }

  showEvents(day: { dayOfMonth: number; events: Event[] }): void {
    console.log('Events for day ' + day.dayOfMonth, day.events);
  }

  prevMonth(): void {
    // Logic to go to the previous month
    if (this.monthIndex > 0) {
      this.monthIndex--;
    } else {
      this.monthIndex = 11; // Go to December if currently in January
      this.year--; // Decrement the year
    }
    this.selectedMonth = this.months[this.monthIndex] + ' ' + this.year; // Set selectedMonth
    this.generateCalendarData();
  }
  
  nextMonth(): void {
    // Logic to go to the next month
    if (this.monthIndex < 11) {
      this.monthIndex++;
    } else {
      this.monthIndex = 0; // Go to January if currently in December
      this.year++; // Increment the year
    }
    this.selectedMonth = this.months[this.monthIndex] + ' ' + this.year; // Set selectedMonth
    this.generateCalendarData();
  }

  showEventModal: boolean = false;
  currentEvent: Event = new Event();


  openEventModal(event: any) {
    this.currentEvent = event;
    this.showEventModal = true;
  }

  closeEventModal() {
    this.showEventModal = false;
  }
  
 
}
