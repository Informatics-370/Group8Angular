export interface TicketPurchase {
    userEmail: string;
    eventId: number;
    eventDate: Date;
    purchaseDate: Date;
    ticketPrice: number;
    eventName: string;  // New field
    description: string;  // New field
}