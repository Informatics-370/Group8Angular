export enum RefundStatus {
  InProgress = 0,
  Approved = 1,
  NotApproved = 2,
}

export interface RefundRequest {
    id: number;
    wineId: number;
    orderId: number;
    email: string;
    requestedOn: Date;
    cost: number;
    description: string;
    status: RefundStatus;
    orderRefNum: string;
}