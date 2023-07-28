import { Component } from '@angular/core';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../services/data-service.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  purchasedTickets: TicketPurchase[] = [];

  constructor(private paymentService: PaymentService) { }

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

}
