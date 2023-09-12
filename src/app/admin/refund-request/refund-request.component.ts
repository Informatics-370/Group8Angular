import { Component } from '@angular/core';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { RefundService } from '../services/refund.service';
import { Wine } from 'src/app/Model/wine';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.css']
})
export class RefundRequestComponent {
  refundRequests: RefundRequest[] = [];
  selectedRefund: RefundRequest = {
    refundRequestId: 0,
    wineOrderId: 0,
    requestDate: new Date(),
    status: '',
    refundItems: []
  };
  showRefundsModal: boolean = false;
  statuses: string[] = ['In Progress', 'Not Approved', 'Approved'];
  wineDetails: any[] = [];

  constructor(private refundService: RefundService) { }
  ngOnInit(): void {
    this.refundService.getAllRefunds().subscribe(data => {
      this.refundRequests = data;
    });
  }

  saveChanges(): void {
    console.log("Saved");
  }


  editRefund(refund: RefundRequest): void {
    this.selectedRefund = refund;
    if(refund.refundRequestId == undefined){
      console.log("NO go");
    }else{
    this.refundService.getWineDetailsForRefund(refund.refundRequestId).subscribe((data:any) => {
      this.wineDetails = data;
      this.showRefundsModal = true;
  });
  }
}

  openModal(id: number): void {
    this.showRefundsModal = true;
  }

  closeModal(): void {
    this.showRefundsModal = false;
    this.selectedRefund.status = '';
  }
}

