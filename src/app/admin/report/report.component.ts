import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';
import { Inventory } from 'src/app/Model/inventory';
import { InventoryService } from '../services/inventory.service';


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
}