import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';
import { Inventory } from 'src/app/Model/inventory';
import { InventoryService } from '../services/inventory.service';
import { OrderService } from 'src/app/customer/services/order.service';
import { SalesService } from '../services/sales.service';
import * as html2pdf from 'html2pdf.js';
import { Order } from 'src/app/Model/order';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

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
               private order : OrderService,
               private salesService: SalesService) { }

  showRefundsModal: boolean = false;
  currentDate = new Date();
  beginDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // First day of the current month
  endDate: Date = new Date();
  allRefunds: RefundRequest[] = [];
  inventory: Inventory[] = [];


  ngOnInit(): void {
  this.loadInventory();   
  }

  showToastr(message: string) {
    this.toastr.info(`Haha, you thought... this ain't coded yet! :)`, message);
    this.showRefundsModal = true;
  }

  closeRefundsModal() {
    this.showRefundsModal = false;
  }

  generateRefundReport(beginDate: Date, endDate: Date) {
    this.dataService.getRefunds(beginDate, endDate).subscribe((result: any) => {
      this.allRefunds = result;
      console.log(this.allRefunds);
      this.pdfService.generateRefundsPdf(this.allRefunds, beginDate, endDate);
      this.closeRefundsModal(); // Optionally, close the modal after generating the report
    });
}

async loadInventory(): Promise<void> {
  try {
    this.inventory = await this.inventoryService.getFullInventory();
  } catch (error) {
    console.error(error);
    this.toastr.error('Error, please try again', 'Inventory Table');
  }
  };


exportToPdf(): void {
  const currentDate = this.getCurrentDateFormatted(); // Get the current date
  this.pdfService.generatePdf(this.inventory, currentDate);
}



getCurrentDateFormatted(): string {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

////////////////////////////////////////////////////////////////////////////////////////////Marco//////////////////////////////////////////////////////////////////////////////////////////
chart: Chart | undefined;
showSalesModal: boolean = false;

// Method to close sales report modal
closeSalesModal() {
  this.showSalesModal = false;
}

// Update the method to open the sales report modal
generateReport() {
  this.showSalesModal = true;
}

generateSalesChartAndPDF() {
  // Parse the begin and end dates as Date objects
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

