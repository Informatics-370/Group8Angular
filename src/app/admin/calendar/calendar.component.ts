import { Component } from '@angular/core';
import { Event } from 'src/app/Model/event';
import { EventService } from '../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';
import { DataServiceService } from 'src/app/customer/services/data-service.service';



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

  showRefundsModal: boolean = false;

  currentReportType: 'REFUNDS' | 'EVENTS' | 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES' | null = null;

  beginDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // First day of the current month
  endDate: Date = new Date();



  constructor( 
    private eventService: EventService,    
    private reportService: ReportService, 
    private pdfService: PdfService, 
    private toastr: ToastrService,
    private auditLogService: AuditlogService, 
    private customerService: CustomersService,
    private dataService: DataServiceService,
    private router: Router

    ) {}

  async ngOnInit(): Promise<void> {
      await this.loadEventData();
      this.generateCalendarData();
      this.userDetails = this.dataService.getUserFromToken();
      this.loadUserData();
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


  closeRefundsModal() {
    this.showRefundsModal = false;
    this.currentReportType = null;
  }

  showDateModal(reportType: 'REFUNDS' | 'EVENTS'): void {
    this.currentReportType = reportType;
    this.showRefundsModal = true;
  }

  OpenDateReports(): void {
    if (this.currentReportType === 'REFUNDS') {
      // this.generateRefundReport(this.beginDate, this.endDate);
    } else if (this.currentReportType === 'EVENTS') {
      this.generateEventsReport();
    }
  }

  DownloadDateReports(): void {
    if (this.currentReportType === 'REFUNDS') {
      // this.generateRefundReport(this.beginDate, this.endDate);
    } else if (this.currentReportType === 'EVENTS') {
      this.generateEventsReportpdf(this.beginDate, this.endDate);
    }
  }

  generateEventsReportpdf(beginDate: Date, endDate: Date) {
    if (!this.beginDate || !this.endDate) {
      this.toastr.error('Both start and end dates are required.', 'Date Error');
      return;
    }

    if (this.endDate < this.beginDate) {
      this.toastr.error('Invalid date range selected.', 'Date Error');
      return;
    }

    this.reportService.getEventsReport(beginDate, endDate).subscribe((result: any) => {
      this.events = result.map((event: { revenue: number; ticketsSold: number; price: number; }) => {
        event.revenue = event.ticketsSold * event.price;
        return event;
      });
      console.log(this.events);
      this.pdfService.generateEventsPdf(this.events, beginDate, endDate);
      this.closeRefundsModal();
    });
  }


  async generateEventsReport() {
    let eD = new Date(this.endDate);
    let bD = new Date(this.beginDate);
    console.log('Begin date', bD);
    console.log('End date', eD);
    if (eD < bD) {
      this.toastr.error('The time period you selected is invalid, please try again', 'Selected dates')
    } else {

      try {
        const result: any = await this.reportService.getEventsReport(this.beginDate, this.endDate).toPromise();
        console.log('Result:', result);

        if (result !== undefined) {
          this.events = result;
          const currentDate = this.getCurrentDateFormatted();

          // Generate the PDF Blob using event data and current date
          const pdfBlob: Blob = await this.pdfService.generateEventsReport(this.events, this.beginDate, this.endDate, currentDate);

          const blobUrl = URL.createObjectURL(pdfBlob);
          const newTab = window.open(blobUrl, '_blank');
          if (!newTab) {
            console.error('Failed to open new tab for PDF');
          }
        } else {
          console.error('Received undefined or invalid event data');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    }
  }

  getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }


  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;

  
  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    console.log("START ", this.user)
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
    console.log("END ", this.user)
  }

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

  goToPage4() {
    this.router.navigate(['/help/3']);
  }

  
 
}
