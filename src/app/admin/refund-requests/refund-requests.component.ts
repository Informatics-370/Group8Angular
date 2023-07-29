import { Component } from '@angular/core';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { OrderService } from 'src/app/customer/services/order.service';
import { RefundService } from 'src/app/customer/services/refund.service';

@Component({
  selector: 'app-refund-requests',
  templateUrl: './refund-requests.component.html',
  styleUrls: ['./refund-requests.component.css']
})
export class RefundRequestsComponent {

  refundRequests: RefundRequest[] = [];

  constructor(private refundService: RefundService) { }

  ngOnInit(): void {
    this.getRefundRequests();
  }

  getRefundRequests(): void {
    this.refundService.getRefundRequests().subscribe(requests => this.refundRequests = requests);
  }
}
