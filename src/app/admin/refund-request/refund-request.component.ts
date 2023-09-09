import { Component } from '@angular/core';
import { RefundRequest, RefundStatus } from 'src/app/Model/RefundRequest';
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

refundStatuses = ["In Progress", "Approved", "Not Approved"];

async getRefundRequests(): Promise<void> {
  this.refundRequests = await this.refundService.getRefundRequests().toPromise() || [];
  this.refundRequests.forEach(request => this.selectedStatuses[request.id] = this.refundStatuses[request.status]);
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

  ////////////////////////////REFUND STATUS/////////////////////////////////////
 
  selectedStatuses: { [id: number]: string } = {};

 

  async updateStatus(id: number, status: string): Promise<void> {
    try {
      const statusAsNumber = this.refundStatuses.indexOf(status);
      const request = this.refundRequests.find(r => r.id === id);
      if (statusAsNumber === -1 || !request) {
        throw new Error(`Invalid status or request: ${status}`);
      }
  
      await this.refundService.updateStatus(id, statusAsNumber, request.orderRefNum).toPromise();
  
      // After updating the status on the server, update it locally
      if (request) {
        request.status = statusAsNumber;
      }
    } catch (error) {
      console.error('Error:', error);
      // Display an error message to the user
    }
  }
  
  
  
}

