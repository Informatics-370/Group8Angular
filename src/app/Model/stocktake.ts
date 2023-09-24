import { SupplierOrder } from "./supplierOrder";

export class StockTake {
  stocktakeID: number;
  dateDone: Date;
  quantityOrdered: number;
  quantityReceived: number;
  added: boolean | null;
  supplierOrderID: number;
  supplierOrder?: SupplierOrder;

  constructor() {
      this.stocktakeID = 0;
      this.dateDone = new Date();
      this.quantityOrdered = 0;
      this.quantityReceived = 0;
      this.added = null; // default value set to null
      this.supplierOrderID = 0;
  }
}