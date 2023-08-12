import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { PdfService } from '../services/pdf.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  constructor(private toastr: ToastrService, private dataService: ReportService, private pdfService: PdfService) { }
  showRefundsModal: boolean = false;
  currentDate = new Date();
  beginDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // First day of the current month
  endDate: Date = new Date();
  allRefunds: RefundRequest[] = [];


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
}