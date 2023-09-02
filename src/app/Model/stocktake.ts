export class StockTake {
    stocktakeID: number;
    wineName: string;
    quantityOrdered: number;
    quantityReceived: number;

    constructor() {
        this.stocktakeID = 0;
        this.wineName = '';
        this.quantityOrdered = 0;
        this.quantityReceived = 0;
      }
}