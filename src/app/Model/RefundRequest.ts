export interface RefundRequest {
    id: number;
    wineId: number;
    orderId: number;
    email: string;
    requestedOn: Date;
    cost: number;
    description: string; // Add this
  }