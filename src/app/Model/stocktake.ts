export class StockTake {
    stocktakeID: number;
    wineName: string;
    dateDone: Date;
    quantityOrdered: number;
    quantityReceived: number;
    added: boolean;

    constructor() {
        this.stocktakeID = 0;
        this.dateDone = new Date();
        this.wineName = '';
        this.quantityOrdered = 0;
        this.quantityReceived = 0;
        this.added = false;
      }
}