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
    qrCode : qrCode;
  }
  

  export interface qrCode{
    qrId : number;
    qrCodeBase64 : string;
    ticketPurchaseId : number;
    

}