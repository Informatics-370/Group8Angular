import { Component } from '@angular/core';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { DecodedToken } from 'src/app/customer/services/data-service.service';
import { OrderService } from 'src/app/customer/services/order.service';
import { RefundService } from 'src/app/customer/services/refund.service';
import { WineService } from '../services/wine.service';
import { Wine } from 'src/app/Model/wine';

@Component({
  selector: 'app-refund-requests',
  templateUrl: './refund-requests.component.html',
  styleUrls: ['./refund-requests.component.css']
})
export class RefundRequestsComponent {
  refundRequests: RefundRequest[] = [];
  wines: Wine[] = [];
  email: string | null = null;

  constructor(private refundService: RefundService, private wineService : WineService) { }

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    this.email = decodedToken.sub;
    try {
        await this.loadWines();
        if (this.email) {
          await this.getUserRefundRequests(this.email);
        }
    } catch (error) {
        console.error('Error:', error);
        // Consider adding an alert or notification to inform the user about the error.
    }
}

  async getUserRefundRequests(email: string): Promise<void> {
    this.refundRequests = await this.refundService.getUserRefundRequests(email).toPromise() || [];
    console.log(this.refundRequests);
  }

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error('Error:', error);
      // Consider adding an alert or notification to inform the user about the error.
    }
  }

  getWineName(wineId: number): string {
    const wine = this.wines.find(w => w.wineID === wineId);
    return wine ? wine.name : 'Unknown';
  }
}
function jwt_decode(token: string): DecodedToken {
  throw new Error('Function not implemented.');

}
