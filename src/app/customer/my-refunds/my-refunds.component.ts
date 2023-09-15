import { Component } from '@angular/core';
import { RefundService } from '../../admin/services/refund.service';
import { DecodedToken } from '../services/data-service.service';
import jwt_decode from 'jwt-decode';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { RefundReponseViewModel } from 'src/app/Model/refundResponseViewModel';
import { OrderService } from '../services/order.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-my-refunds',
  templateUrl: './my-refunds.component.html',
  styleUrls: ['./my-refunds.component.css'],
})
export class MyRefundsComponent {
  refundRequests: RefundRequest[] = [];
  refundReponses: any[] = [];
  selectedRefund: RefundRequest = {
    refundRequestId: 0,
    wineOrderId: 0,
    requestDate: new Date(),
    status: '',
    refundItems: [],
  };
  responseViewModel: RefundReponseViewModel[] = [];
  showRefundsModal: boolean = false;
  wineDetails: any[] = [];
  orderRefNumMapping: { [key: number]: string } = {};
  confirmText: string = '';

  email: string | null = null;

  constructor(
    private refundService: RefundService,
    private orderService: OrderService
  ) {}

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    this.email = decodedToken.sub;

    try {
      if (this.email) {
        if (this.email) {
          this.loadRefundsForCustomer(this.email);
          this.loadRefundResponses(); // If these responses are global and not customer-specific, keep them here.
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Consider adding an alert or notification to inform the user about the error.
    }
  }

  loadRefundsForCustomer(email: string) {
    this.refundService.getCustomerRefund(email).subscribe((data: any) => {
      this.refundRequests = data;

      let responseMapping: { [responseValue: string]: string } = {};
      this.refundReponses.forEach((response) => {
        responseMapping[response.responseValue] = response.description;
      });

      this.refundRequests.forEach((element) => {
        this.orderService
          .getOrder(element.wineOrderId)
          .subscribe((result: any) => {
            this.orderRefNumMapping[element.wineOrderId] = result.orderRefNum;
          });

        if (element.refundItems) {
          element.refundItems.forEach((item) => {
            item.response = responseMapping[item.status!] || 'Unknown Status';
          });
        }
      });
    });
  }

  loadRefundResponses() {
    this.refundService.getAllResponses().subscribe((data) => {
      this.refundReponses = data;
    });
  }

  editRefund(refund: RefundRequest): void {
    this.selectedRefund = { ...refund };

    if (refund.refundRequestId !== undefined) {
      this.refundService
        .getResponseById(this.selectedRefund.refundRequestId!)
        .pipe(
          switchMap((result: any) => {
            this.responseViewModel = result;
            return this.refundService.getRefundItems(refund.refundRequestId!);
          })
        )
        .subscribe((data: any) => {
          this.wineDetails = data;
          // console.log("WineDetails before match:",this.wineDetails);
          // console.log("RefundResponseViewModel:",this.responseViewModel);
          this.wineDetails.forEach((wine, index) => {
            wine.hasDescription = true; // By default, assume it has a description
            if (
              this.responseViewModel[index] &&
              this.responseViewModel[index].description
            ) {
              wine.status = this.responseViewModel[index].description;
            } else {
              wine.status = '';
              wine.hasDescription = false; // Flagging that there's no description
            }
          });
          //console.log("wineDetails:", this.wineDetails);
          this.showRefundsModal = true;
        });
    }
  }

  closeModal(): void {
    this.showRefundsModal = false;
    this.selectedRefund.status = '';
  }
}
