import { TicketPurchasedStatus } from "./TicketPurchasedStatus";

export interface TicketPurchase {
    id?: number;
    userEmail: string;
    eventId: number;
    eventDate: Date;
    purchaseDate: Date;
    ticketPrice: number;
    eventName: string;
    description: string;
    ticketPurchasedStatus?: TicketPurchasedStatus; // Added this line
  }
  