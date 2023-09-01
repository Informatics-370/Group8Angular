import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';
import { Inventory } from 'src/app/Model/inventory';
import { InventoryService } from '../services/inventory.service';
import { WineService } from '../services/wine.service';
import { SalesService } from '../services/sales.service';
import * as html2pdf from 'html2pdf.js';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Event } from 'src/app/Model/event';
import { Blacklist } from 'src/app/Model/blacklist';
import { Wine } from 'src/app/Model/wine';
import { SuppOrderAndVATViewModel } from 'src/app/Model/SupplierOrdersVATs';
import { SupplierOrder } from 'src/app/Model/supplierOrder';
import { VAT } from 'src/app/Model/vat';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})

export class ReportComponent {


  constructor(private toastr: ToastrService,
    private dataService: ReportService,
    private pdfService: PdfService,
    private inventoryService: InventoryService,
    private salesService: SalesService,
    private wineService: WineService) { }

  showRefundsModal: boolean = false;
  currentDate = new Date();
  beginDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // First day of the current month
  endDate: Date = new Date();
  allRefunds: RefundRequest[] = [];
  allSuppOrders: SuppOrderAndVATViewModel[] = [];
  supplierOrders: SupplierOrder | undefined;
  vaTs: VAT | undefined;
  inventory: Inventory[] = [];
  wines: Wine[] = [];
  allEvents: Event[] = []; // Add this property to store fetched events
  currentReportType: 'REFUNDS' | 'EVENTS' | 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES' | null = null;
  blacklistData: Blacklist[] = [];
  showBlacklistModal: boolean = false;

  ngOnInit(): void {
    this.loadInventory();
    this.loadWines();
  }

  async loadInventory(): Promise<void> {
    try {
      this.inventory = await this.inventoryService.getFullInventory();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Inventory Table');
    }
  }

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error(error);
      this.toastr.error('Error, please try again', 'Wine Table');
    }
  }

  async generateInventoryReport() {
    try {
      let result: Inventory[] | undefined = this.inventory; // Use the fetched inventory data
      console.log('Result:', result);

      // Rest of your code...
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // Handle error if needed
    }
  }

  showDateModal(reportType: 'REFUNDS' | 'EVENTS'): void {
    this.currentReportType = reportType;
    this.showRefundsModal = true;
  }

  showModal(reportType: 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES'): void {
    this.currentReportType = reportType;
    this.showBlacklistModal = true;
  }

  closeRefundsModal() {
    this.showRefundsModal = false;
    this.currentReportType = null;
  }

  closeBlacklistModal() {
    this.showBlacklistModal = false;
    this.currentReportType = null;
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

  OpenReports(): void {
    if (this.currentReportType === 'BLACKLIST') {
      this.generateBlacklistReport();
    } else if (this.currentReportType === 'INVENTORY') {
      this.ViewInventory();
    } else if (this.currentReportType === 'SUPPLIER ORDER') {
      this.generateSupplierOrderReport();
    } else if (this.currentReportType === 'WINES') {
      this.ViewWines();
    }
  }

  DownloadReports(): void {
    if (this.currentReportType === 'BLACKLIST') {
      this.generateBlacklistReportpdf();
    } else if (this.currentReportType === 'INVENTORY') {
      this.exportInventoryToPdf();
    } else if (this.currentReportType === 'SUPPLIER ORDER') {
      this.generateSupplierOrderReportpdf();
    } else if (this.currentReportType === 'WINES') {
      this.generateWineReportpdf();
    }
  }

  showToastr(message: string) {
    this.toastr.info(`Haha, you thought... this ain't coded yet! :)`, message);
    this.showRefundsModal = true;
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


  async generateEventsReport() {
    let eD = new Date(this.endDate);
    let bD = new Date(this.beginDate);
    console.log('Begin date', bD);
    console.log('End date', eD);
    if (eD < bD) {
      this.toastr.error('The time period you selected is invalid, please try again', 'Selected dates')
    } else {

      try {
        const result: any = await this.dataService.getEventsReport(this.beginDate, this.endDate).toPromise();
        console.log('Result:', result);

        if (result !== undefined) {
          this.allEvents = result;
          const currentDate = this.getCurrentDateFormatted();

          // Generate the PDF Blob using event data and current date
          const pdfBlob: Blob = await this.pdfService.generateEventsReport(this.allEvents, this.beginDate, this.endDate, currentDate);

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

  exportInventoryToPdf(): void {
    const currentDate = this.getCurrentDateFormatted(); // Get the current date
    this.pdfService.generateInventoryPdf(this.inventory, currentDate);
  }

  async ViewInventory(): Promise<void> {
    try {
      const currentDate = this.getCurrentDateFormatted(); // Get the current date
      const pdfBlob = await this.pdfService.generateInventoryReport(this.inventory, currentDate);
      const resolvedPdfBlob = await pdfBlob;
      // Create a Blob URL and open it in a new tab
      const blobUrl = URL.createObjectURL(resolvedPdfBlob);
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab for PDF');
      } else {
        console.error('Received undefined or invalid inventory data');
      }
    } catch (error) {
      console.error('Error generating inventory report:', error);
    }
  }


  async ViewWines(): Promise<void> {
    try {
      const currentDate = this.getCurrentDateFormatted(); // Get the current date
      console.log(this.wines)
      const pdfBlob = await this.pdfService.generateWinesReport(this.wines, currentDate);

      const resolvedPdfBlob = await pdfBlob;

      // Create a Blob URL and open it in a new tab
      const blobUrl = URL.createObjectURL(resolvedPdfBlob);
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab for PDF');
      } else {
        console.error('Received undefined or invalid Wine data');
      }
    } catch (error) {
      console.error('Error generating Wine report:', error);
    }
  }


  async generateWineReportpdf() {
    try {
      let result: Wine[] | undefined = await this.wineService.getWines();
      console.log('Result:', result); // Add this line
      if (result !== undefined) {
        this.wines = result;
        let currentDate = this.getCurrentDateFormatted();
        this.pdfService.generateWinesReportpdf(this.wines, currentDate);
        // Do any additional processing or actions here if needed
      } else {
        console.error('Received undefined or invalid wine data');
        this.toastr.error('Error, failed to download Wines Report', 'Wines Report');
        // Handle the case where the returned data is undefined or invalid
      }
    } catch (error) {
      console.error('Error fetching wine data:', error);
      this.toastr.error('Error, failed to retrieve Wine Data', 'Wines Report');
      // Handle error if needed
    }
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

  async generateSupplierOrderReportpdf() {
    let suppOrderAndVATData!: SuppOrderAndVATViewModel;

    // Wait for the supplier order data to be fetched
    await new Promise<void>((resolve, reject) => {
      this.dataService.getSupplierOrder().subscribe(result => {
        // Assuming result now returns an object with supplierOrders and vaTs properties
        suppOrderAndVATData = result;
        console.log('SuppOrderAndVAT Data', suppOrderAndVATData);
        resolve();
      }, error => reject(error));
    });

    // Ensure that we have data before proceeding
    if (!suppOrderAndVATData || !suppOrderAndVATData.supplierOrders) {
      console.error('Received undefined or invalid supplier order data');
      return;
    }
    this.pdfService.generateSupplierOrdersPdf([suppOrderAndVATData]);
  }

  async generateSupplierOrderReport(): Promise<void> {
    try {
      let suppOrderAndVATData!: SuppOrderAndVATViewModel;

      // Wait for the supplier order data to be fetched
      await new Promise<void>((resolve, reject) => {
        this.dataService.getSupplierOrder().subscribe(result => {
          // Assuming result now returns an object with supplierOrders and vaTs properties
          suppOrderAndVATData = result;
          console.log('SuppOrderAndVAT Data', suppOrderAndVATData);
          resolve();
        }, error => reject(error));
      });

      // Ensure that we have data before proceeding
      if (!suppOrderAndVATData || !suppOrderAndVATData.supplierOrders) {
        console.error('Received undefined or invalid supplier order data');
        return;
      }
      const pdfBlob = await this.pdfService.generateSupplierOrders([suppOrderAndVATData]);
      const blobUrl = URL.createObjectURL(pdfBlob);
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab for PDF');
      }
    } catch (error) {
      console.error('Error generating inventory report:', error);
    }
  }

  async generateBlacklistReportpdf() {
    try {
      let result: Blacklist[] | undefined = await this.dataService.getBlacklist();
      console.log('Result:', result); // Add this line
      if (result !== undefined) {
        this.blacklistData = result;
        let currentDate = this.getCurrentDateFormatted();
        this.pdfService.generateBlacklistPdf(this.blacklistData, currentDate);
      } else {
        console.error('Received undefined or invalid blacklist data');
        this.toastr.error('Error, failed to download Blacklist Report', 'Blacklist Report');
      }
    } catch (error) {
      console.error('Error fetching blacklist data:', error);
      this.toastr.error('Error, failed to retrieve Blacklist Data', 'Blacklist Report');
    }
  }


  async generateBlacklistReport() {
    try {
      let result: Blacklist[] | undefined = await this.dataService.getBlacklist();
      console.log('Result:', result);

      if (result !== undefined) {
        this.blacklistData = result;
        let currentDate = this.getCurrentDateFormatted();

        const pdfBlob = await this.pdfService.generateBlacklist(this.blacklistData, currentDate);

        // Await the promise and get the resolved Blob
        const resolvedPdfBlob = await pdfBlob;

        // Create a Blob URL and open it in a new tab
        const blobUrl = URL.createObjectURL(resolvedPdfBlob);
        const newTab = window.open(blobUrl, '_blank');
        if (!newTab) {
          console.error('Failed to open new tab for PDF');
          // Handle error if new tab cannot be opened
        }

        // Do any additional processing or actions here if needed
      } else {
        console.error('Received undefined or invalid blacklist data');
        // Handle the case where the returned data is undefined or invalid
      }
    } catch (error) {
      console.error('Error fetching blacklist data:', error);
      // Handle error if needed
    }
  }

  chart: Chart | undefined;
  showSalesModal: boolean = false;

  closeSalesModal() {
    this.showSalesModal = false;
  }

  generateSalesReportModal(): void {
    this.showSalesModal = true;
  }

  generateSalesChartAndPDF() {
    const startDate = new Date(this.beginDate);
    const endDate = new Date(this.endDate);

    console.log('Parsed Begin Date:', startDate); // Log the parsed begin date
    console.log('Parsed End Date:', endDate); // Log the parsed end date

    this.showSalesModal = false; // Close the modal

    this.salesService.getSalesReport(startDate, endDate).subscribe(orders => {
      // Create the chart
      const dates = orders.map(order => order.orderDate);
      const sales = orders.map(order => order.orderTotal);

      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d');

      if (context) {
        if (this.chart) {
          this.chart.destroy(); // Destroy the existing chart if there is one
        }
        this.chart = new Chart(context, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Total Sales',
                data: sales,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          }
        });

        // Download the chart as a PDF
        const element = document.getElementById('chart-container');
        if (element) {
          html2pdf().from(element).save();
        }
      }
    });
  }
}



