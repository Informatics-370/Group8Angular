import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';
import { Inventory } from 'src/app/Model/inventory';
import { InventoryService } from '../services/inventory.service';
import { Event } from 'src/app/Model/event';
import { SupplierOrder } from 'src/app/Model/supplierOrder';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  constructor(private toastr: ToastrService,
    private dataService: ReportService,
    private pdfService: PdfService,
    private inventoryService: InventoryService,) { }
  showRefundsModal: boolean = false;
  currentDate = new Date();
  beginDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // First day of the current month
  endDate: Date = new Date();
  allRefunds: RefundRequest[] = [];
  allSuppOrders: SupplierOrder[] = [];
  inventory: Inventory[] = [];
  allEvents: Event[] = []; // Add this property to store fetched events
  currentReportType: 'REFUNDS' | 'EVENTS' | null = null;




  ngOnInit(): void {
    this.loadInventory();
  }

  async loadInventory(): Promise<void> {
    try {
      this.inventory = await this.inventoryService.getFullInventory();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Inventory Table');
    }
  };



  showModal(reportType: 'REFUNDS' | 'EVENTS'): void {
    this.currentReportType = reportType;
    this.showRefundsModal = true;
  }

  closeRefundsModal() {
    this.showRefundsModal = false;
    this.currentReportType = null;
  }


  generateReport(): void {
    if (this.currentReportType === 'REFUNDS') {
      this.generateRefundReport(this.beginDate, this.endDate);
    } else if (this.currentReportType === 'EVENTS') {
      this.generateEventsReport(this.beginDate, this.endDate);
    }
  }

  showToastr(message: string) {
    this.toastr.info(`Haha, you thought... this ain't coded yet! :)`, message);
    this.showRefundsModal = true;
  }



  generateRefundReport(beginDate: Date, endDate: Date) {
    this.dataService.getRefunds(beginDate, endDate).subscribe((result: any) => {
      this.allRefunds = result;
      console.log(this.allRefunds);
      this.pdfService.generateRefundsPdf(this.allRefunds, beginDate, endDate);
      this.closeRefundsModal(); // Optionally, close the modal after generating the report
    });
  }

  generateEventsReport(beginDate: Date, endDate: Date) {
    this.dataService.getEventsReport(beginDate, endDate).subscribe((result: any) => {
      this.allEvents = result.map((event: { revenue: number; ticketsSold: number; price: number; }) => {
          event.revenue = event.ticketsSold * event.price;
          return event;
      });
      console.log(this.allEvents);
      this.pdfService.generateEventsPdf(this.allEvents, beginDate, endDate); 
      this.closeRefundsModal();
  });
  
  }

  getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  exportToPdf(): void {
    const currentDate = this.getCurrentDateFormatted(); // Get the current date
    this.pdfService.generatePdf(this.inventory, currentDate);
  }

  async downloadEventsReport() {
    try {
      const reportData = await this.dataService.getEventsReport(this.beginDate, this.endDate).toPromise();
      // Handle the response, maybe save it as a file, or display it.
      // This is a basic outline and you may need to adjust based on your needs.
    } catch (error) {
      this.toastr.error('Error fetching event report.', 'Download Report');
    }
  }


  openRefundsModal(){
    this.showRefundsModal = true;
}


generateSupplierOrderReport(){
  this.dataService.getSupplierOrder().subscribe((result) => {
    console.log(result);
    this.allSuppOrders = result;
    console.log(this.allSuppOrders);
    this.pdfService.generateSupplierOrdersPdf(this.allSuppOrders);
  })
}

}