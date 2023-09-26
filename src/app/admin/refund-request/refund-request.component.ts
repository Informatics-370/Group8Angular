import { Component } from '@angular/core';
import { RefundItem, RefundRequest } from 'src/app/Model/RefundRequest';
import { RefundService } from '../services/refund.service';
import { OrderService } from 'src/app/customer/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { RefundReponseViewModel } from 'src/app/Model/refundResponseViewModel';
import { switchMap } from 'rxjs';
import { Discount } from 'src/app/Model/discount';
import { DiscountService } from '../services/discount.service';
import { compileNgModule } from '@angular/compiler';

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
  searchTerm: string = '';
  displayedRefundsForSearch: RefundRequest[] = [];


  constructor(
    private refundService: RefundService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private discountService: DiscountService
  ) {}
  ngOnInit(): void {
    this.loadRefunds();
    this.loadRefundResponses();
  }

  searchRefunds() {
    let filteredRefunds = [...this.refundRequests];
  
    // If we're only showing incomplete refunds, filter those first
    if (this.showOnlyIncomplete) {
      filteredRefunds = filteredRefunds.filter(refund => refund.status !== 'Completed');
    }
  
    // If there's a search term, further filter the results
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filteredRefunds = filteredRefunds.filter(refund => {
        return (
          (this.orderRefNumMapping[refund.wineOrderId] && this.orderRefNumMapping[refund.wineOrderId].toLowerCase().includes(lowerCaseSearchTerm)) ||
          (refund.requestDate && refund.requestDate.toString().includes(this.searchTerm)) ||
          (refund.status && refund.status.toLowerCase().includes(lowerCaseSearchTerm))
        );
      });
    }
  
    this.displayedRefundsForSearch = filteredRefunds;
  }
  


  loadRefunds() {
    this.refundService.getAllRefunds().subscribe((data) => {
      this.refundRequests = data;
      console.log('loadRefunds', this.refundRequests);
      this.displayedRefundsForSearch = [...this.refundRequests];

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
    this.searchRefunds();
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
        let matchingRefundItem = this.selectedRefund.refundItems[index];
        return {
          RefundItemId: matchingRefundItem?.refundItemId,
          Status: wine.status,
        };
      });
  
      // Initialize discountCode as null
      let discountCode: string | null = null;
  
      // Check if any item has an 'Approved' status
      if (itemsStatuses.some(item => item.Status === 'Approved')) {
        // Generate a unique discount code
        discountCode = this.generateUniqueCode();
        
        // Calculate the total amount to be refunded
        let totalRefundAmount = 0;
        this.wineDetails.forEach(element => {
          totalRefundAmount += element.cost;  // Assuming 'cost' is a number
        });
        
        // Create a new Discount object
        const discount = new Discount();
        discount.discountCode = discountCode;
        discount.discountDescription = 'Refund';
        discount.discountAmount = totalRefundAmount;
  
        // Call the addDiscount method to create a new discount
        this.discountService.addDiscount(discount).then((newDiscount) => {
          this.toastr.success('Discount code generated: ' + newDiscount.discountCode);
        }).catch(error => {
          console.error('Error generating discount code:', error);
        });
      }
  
      // Check if all items have a 'Not Approved' status
      const allNotApproved = itemsStatuses.every(item => item.Status === 'Not Approved');
  
      // Call the API
      if (discountCode) {
        this.refundService.updateRefundStatus(this.selectedRefund.refundRequestId, itemsStatuses, discountCode, allNotApproved)
          .subscribe(
            (response) => {
              this.loadRefunds();
              this.toastr.success('Updated refund status');
            },
            (error) => {
              console.error('Error updating status:', error);
            }
          );
      } else {
        this.refundService.updateRefundStatus(this.selectedRefund.refundRequestId, itemsStatuses, '', allNotApproved)
          .subscribe(
            (response) => {
              this.loadRefunds();
              this.toastr.success('Updated refund status');
            },
            (error) => {
              console.error('Error updating status:', error);
            }
          );
      }
    }
    this.showRefundsModal = false;
    this.showConfirmModal = false;
  }
  
  
  generateUniqueCode() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const randomLetter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const timestampLast3Digits = Date.now().toString().slice(-3);
    return randomLetter1 + randomLetter2 + '-' + timestampLast3Digits;
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
