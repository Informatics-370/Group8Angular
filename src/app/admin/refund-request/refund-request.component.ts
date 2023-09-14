import { Component } from '@angular/core';
import { RefundItem, RefundRequest } from 'src/app/Model/RefundRequest';
import { RefundService } from '../services/refund.service';
import { OrderService } from 'src/app/customer/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { RefundReponseViewModel } from 'src/app/Model/refundResponseViewModel';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.css'],
})
export class RefundRequestComponent {
  refundRequests: RefundRequest[] = [];
  refundReponses: any[] = [];
  selectedRefund: RefundRequest = {
    refundRequestId: 0,
    wineOrderId: 0,
    requestDate: new Date(),
    status: '',
    refundItems: [],
  };
  refundItems: RefundItem[] = [];
  responseViewModel: RefundReponseViewModel[] = [];
  showRefundsModal: boolean = false;
  showConfirmModal: boolean = false;
  showOnlyIncomplete: boolean = false;
  statuses: string[] = ['In Progress', 'Not Approved', 'Approved'];
  wineDetails: any[] = [];
  orderRefNumMapping: { [key: number]: string } = {};
  refundStatusMapping: { [refundRequestId: number]: string } = {};
  confirmText: string = '';

  constructor(
    private refundService: RefundService,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.loadRefunds();
    this.loadRefundResponses();
  }

  loadRefunds() {
    this.refundService.getAllRefunds().subscribe((data) => {
      this.refundRequests = data;
      console.log('loadRefunds', this.refundRequests);

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
            //console.log('Item:', item);
            item.response = responseMapping[item.status!] || 'Unknown Status';
          });
        }
      });
    });
  }

  loadRefundResponses() {
    this.refundService.getAllResponses().subscribe((data) => {
      this.refundReponses = data;
      console.log('loadRefundResponses:', this.refundReponses);
    });
  }

  getRefundItemResponse(id: number) {
    this.refundService.getResponseById(id).subscribe((result: any) => {
      this.responseViewModel = result;
      console.log("ResponseViewModel:", result);
    })
  }

  toggleIncompleteRefunds(): void {
    this.showOnlyIncomplete = !this.showOnlyIncomplete;
  }

  get displayedRefunds() {
    if (this.showOnlyIncomplete) {
      return this.refundRequests.filter(
        (refund) => refund.status === 'Incomplete'
      );
    }
    return this.refundRequests;
  }

  editRefund(refund: RefundRequest): void {
    this.selectedRefund = { ...refund };
  
    if (refund.refundRequestId !== undefined) {
      this.refundService.getResponseById(this.selectedRefund.refundRequestId!)
        .pipe(
          switchMap((result: any) => {
            this.responseViewModel = result;
            return this.refundService.getRefundItems(refund.refundRequestId!);
          })
        )
        .subscribe((data: any) => {
          this.wineDetails = data;
          console.log("WineDetails before match:",this.wineDetails);
          console.log("RefundResponseViewModel:",this.responseViewModel);
          this.wineDetails.forEach((wine, index) => {
            wine.hasDescription = true; // By default, assume it has a description
            if(this.responseViewModel[index] && this.responseViewModel[index].description){
              wine.status = this.responseViewModel[index].description;
            } else {
              wine.status = '';
              wine.hasDescription = false; // Flagging that there's no description
            }
          });
          console.log("wineDetails:", this.wineDetails);
          this.showRefundsModal = true;
        });
    }
  }
  

  saveChanges(): void {
    if (this.selectedRefund.refundRequestId !== undefined) {
      let itemsStatuses = this.wineDetails.map((wine, index) => {
        let matchingRefundItem = this.selectedRefund.refundItems[index]; // Using index to map

        return {
          RefundItemId: matchingRefundItem?.refundItemId,
          Status: wine.status,
        };
      });

      // console.log("Mapped Item Statuses:", itemsStatuses);

      this.refundService
        .updateRefundStatus(this.selectedRefund.refundRequestId, itemsStatuses)
        .subscribe(
          (response) => {
            // console.log('Status updated successfully');
            // console.log("Response from updateRefundStatus", response);
            this.loadRefunds();
            this.toastr.success('Updated refund status');
          },
          (error) => {
            console.error('Error updating status:', error);
          }
        );
    }
    this.showRefundsModal = false;
    this.showConfirmModal = false;
  }

  isAnyStatusEmpty(): boolean {
    return this.wineDetails.some(wine => !wine.status || wine.status.trim() === '');
}


  openModal(id: number): void {
    this.showRefundsModal = true;
  }

  closeModal(): void {
    this.showRefundsModal = false;
    this.selectedRefund.status = '';
  }

  openConfirmModal(): void {
    this.confirmText = '';
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.confirmText = '';
    this.showConfirmModal = false;
  }
}
