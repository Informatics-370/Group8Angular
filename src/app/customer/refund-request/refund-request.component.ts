import { Component } from '@angular/core';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { OrderService } from '../services/order.service';
import { RefundService } from '../services/refund.service';
import { Wine } from 'src/app/Model/wine';
import { WineService } from 'src/app/admin/services/wine.service';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.css']
})
export class RefundRequestComponent {
  refundRequests: RefundRequest[] = [];
  wines: Wine[] = [];

  constructor(private refundService: RefundService, private wineService : WineService) { }

  async ngOnInit(): Promise<void> {
    try {
        await this.loadWines();
        await this.getRefundRequests();
    } catch (error) {
        console.error('Error:', error);
        // Consider adding an alert or notification to inform the user about the error.
    }
}

async getRefundRequests(): Promise<void> {
  this.refundRequests = await this.refundService.getRefundRequests().toPromise() || [];
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
