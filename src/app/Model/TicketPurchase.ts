export interface TicketPurchase {
    id?: number;
    userId: string;
    purchaseDate: Date;
    eventDate?: Date;
    cost: number;
    email: string;
    eventId: number;
    success?: boolean; // add this line
}