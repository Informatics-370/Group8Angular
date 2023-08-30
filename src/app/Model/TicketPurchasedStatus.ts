export interface TicketPurchasedStatus {
  eventDeleted: boolean;
  isScanned: boolean;
  scannedAt: Date | null;
  scanningToken: string | "";
}
