import { Component } from '@angular/core';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';

import { DataServiceService } from '../services/data-service.service';
import { PaymentService } from '../services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  purchasedTickets: TicketPurchase[] = [];

  constructor(private paymentService: PaymentService, private toastr : ToastrService) { }

  ngOnInit() {
    this.loadUserTickets();
  }

  loadUserTickets() {
    this.paymentService.getPurchasedTickets().subscribe(
      (tickets: TicketPurchase[]) => {
        this.purchasedTickets = tickets;
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );
  }

  getEventTime(eventDate: string | Date): string {
    const date = new Date(eventDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // padStart is used to ensure that hours and minutes less than 10 start with a '0'
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

onDeleteTicket(ticketId: number | undefined): void {
  if (ticketId === undefined) {
    this.toastr.error('Ticket ID is not available, cannot delete the ticket.');
    return;
  }

  this.paymentService.deletePurchasedTicket(ticketId).subscribe(
    () => {
      this.toastr.success('Ticket deleted successfully');
      // Reload the tickets by calling the loadUserTickets method again
      this.loadUserTickets();
    },
    (error) => {
      this.toastr.error('Failed to delete the ticket');
      console.error(error);
    }
  );
}


}
