export interface TicketPurchase {
    id?: number;
    userEmail: string;
    eventId: number;
    eventDate: Date;
    purchaseDate: Date;
    ticketPrice: number;
    eventName: string;  // New field
    description: string;  // New field
    eventDeleted: boolean;
}