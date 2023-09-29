import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/Model/order';
import jwt_decode from 'jwt-decode';
import { DataServiceService, DecodedToken } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { WineService } from 'src/app/admin/services/wine.service';
import { Wine } from 'src/app/Model/wine';
import { RefundService } from '../../admin/services/refund.service';
import { NgForm } from '@angular/forms';
import { RefundItem } from 'src/app/Model/RefundRequest';
import { delay } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  wines: Wine[] = [];
  currentOrderId: number | null = null;
  currentWineId: number | null = null;
  phoneNumber: string = '';
  searchQuery: string = '';
  allOrders: Order[] = [];
  selectedTimeFrame: string = 'all';

  //Refunds
  showRefundModal: boolean = false;
  currentRefundDescription: string = '';
  referenceNumber: string = '';
  currentOrderItems: any[] = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private wineService: WineService,
    private refundService: RefundService,
    private dataService: DataServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    this.phoneNumber = decodedToken.phoneNumber;
    console.log('Phone Number:', this.phoneNumber);
    await this.loadOrders(email);
    await this.loadWines();
    this.filterOrdersByTimeFrame();
  }

  async loadOrders(email: string): Promise<void> {
    console.log( "Hello" + this.allOrders);
    try {
      this.allOrders =
        (await this.orderService.getOrdersForUser(email).toPromise()) || [];
        this.filterOrders();
      console.log(this.orders);
      
    } catch (error) {
      console.error('Error:', error);
      // this.toastr.error('Could not load order history.', 'Error');
    }
  }

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error('Error:', error);
      // this.toastr.error('Could not load wines.', 'Error');
    }
  }

  getWineName(wineId: number): string {
    const wine = this.wines.find((w) => w.wineID === wineId);
    //console.log('WineId and Found wine:', wineId, wine);  // Add this line
    return wine ? wine.name : 'Unknown';
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  openRefundModal(order: Order): void {
    this.currentOrderItems = order.orderItems.map(item => ({
      wineId: item.wineId,
      wine: item.wine,
      quantity: item.quantity,
      refundQuantity: 0,
      refundReason: ''
    }));
    this.currentOrderId = order.wineOrderId;
    this.showRefundModal = true;
  }

  closeRefundModal(): void {
    this.showRefundModal = false;
    this.currentRefundDescription = ''; // Clear the description
    this.currentOrderItems = [];
  }

  async submitRefundForm(form: NgForm): Promise<void> {
    if (form.invalid) return;

    const email = this.dataService.getUserFromToken()?.email;
    if (!email) return;

    try {
        const userOrders = await this.orderService.getOrdersForUser(email).toPromise();
        if (!userOrders) {
          console.error('User orders not found.');
          return;
      }
        const currentOrder = userOrders.find(order => order.wineOrderId === this.currentOrderId);

        if (!currentOrder) {
            console.error('Current order not found in user orders.');
            return;
        }

        const refundItems = this.extractRefundItems(currentOrder);

        if (refundItems.length > 0) {
            this.sendRefundRequest(refundItems);
            this.loadOrders(email);
        }
        this.loadOrders(email);
        delay(1234);

    } catch (error) {
        console.error('Error:', error);
        this.toastr.error('Could not process refund.', 'Error');
        this.loadOrders(email);
    }
    this.loadOrders(email);
}

extractRefundItems(currentOrder: any): RefundItem[] {
    return this.currentOrderItems
        .filter(item => item.refundReason && +item.refundQuantity > 0)
        .flatMap(item => {
            const matchingOrderItem = currentOrder.orderItems.find((oi: any) => oi.wineId === item.wineId);

            if (!matchingOrderItem) {
                console.error(`No matching order item found for wineId: ${item.wineId || item.wineID}`);
                return [];
            }

            return [{
                wineOrderItemId: matchingOrderItem.wineOrderItemId,
                quantity: +item.refundQuantity,
                reason: item.refundReason
            }];
        });
}


async sendRefundRequest(refundItems: RefundItem[]): Promise<void> {
    if (this.currentOrderId === null) {
        console.error('currentOrderId is null.');
        this.toastr.error('An error occurred. Please try again.', 'Error');
        return;
    }
    console.log('Here', this.currentOrderId);
    const email = this.dataService.getUserFromToken()?.email;
    if (!email) return;
    try {
        await this.refundService.requestRefund(this.currentOrderId, "", refundItems).toPromise();
        this.toastr.success('Refund request has been sent.', 'Success');
        this.loadOrders(email);
        this.closeRefundModal();
    } catch (error) {
        console.error('Error:', error);
        this.toastr.error('Could not send refund request.', 'Error');
    }
}




  checkRefundAvailability(order: Order): boolean {
    const orderDate = new Date(order.collectedDate);
    const currentTime = new Date();
    const timeDifferenceInMilliseconds =
      currentTime.getTime() - orderDate.getTime();
    let sevenDaysInMillisecond = 7 * 24 * 60 * 60 * 1000;

    if (timeDifferenceInMilliseconds <= sevenDaysInMillisecond) {
      return true;
    } else {
      return false;
    }
  }

  filterOrders(): void {
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      this.orders = this.allOrders.filter(order =>
        order.orderRefNum.toLowerCase().includes(query) ||
        this.getWineName(order.wineOrderId).toLowerCase().includes(query) ||
        order.orderTotal.toString().toLowerCase().includes(query)
      );
    } else {
      this.orders = [...this.allOrders];
    }
  }

  generateYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
  
    for (let i = 0; i < 4; i++) {
      years.push(currentYear - i);
    }
  
    return years;
  }

  filterOrdersByTimeFrame(): void {
    const currentYear = new Date().getFullYear();
    
    if (this.selectedTimeFrame === 'all') {
      // Show all orders
      this.orders = [...this.allOrders];
    } else if (this.selectedTimeFrame === '3') {
      // Filter for the past 3 months
      const filterDate = new Date();
      filterDate.setMonth(filterDate.getMonth() - 3);
      this.filterOrdersByDateRange(filterDate, new Date());
    } else if (this.selectedTimeFrame === '6') {
      // Filter for the past 6 months
      const filterDate = new Date();
      filterDate.setMonth(filterDate.getMonth() - 6);
      this.filterOrdersByDateRange(filterDate, new Date());
    } else {
      // Filter for a specific year
      const selectedYear = parseInt(this.selectedTimeFrame, 10);
      const filterDate = new Date(selectedYear, 0, 1); // Set to the first day of the selected year
      const endOfYear = new Date(selectedYear + 1, 0, 1);
      this.filterOrdersByDateRange(filterDate, endOfYear);
    }
  }
  
  filterOrdersByDateRange(startDate: Date, endDate: Date): void {
    // Filter orders based on the selected time frame
    this.orders = this.allOrders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate >= startDate && orderDate < endDate
      );
    });
  }
  
}