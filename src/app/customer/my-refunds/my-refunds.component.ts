import { Component } from '@angular/core';
import { RefundRequest, RefundStatus } from 'src/app/Model/RefundRequest';
import { RefundService } from '../../admin/services/refund.service';
import { WineService } from 'src/app/admin/services/wine.service';
import { DecodedToken } from '../services/data-service.service';
import { Wine } from 'src/app/Model/wine';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-my-refunds',
  templateUrl: './my-refunds.component.html',
  styleUrls: ['./my-refunds.component.css']
})
export class MyRefundsComponent {
  refundRequests: RefundRequest[] = [];
  wines: Wine[] = [];
  email: string | null = null;
  private intervalId: any;

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

    this.intervalId = setInterval(() => {
      if (this.email) {
        this.getUserRefundRequests(this.email);
      }
    }, 5000);
}

ngOnDestroy(): void {
  // Stop polling when the component is destroyed
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

statusDisplayNames = {
  [RefundStatus.InProgress]: 'In Progress',
  [RefundStatus.Approved]: 'Approved',
  [RefundStatus.NotApproved]: 'Not Approved',
};



getStatusName(status: RefundStatus): string {
  return this.statusDisplayNames[status];
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

