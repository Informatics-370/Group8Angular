export class EventPrice {
    eventPriceID: number | undefined;
    amount: number | undefined;
    date: Date | undefined;

    constructor() {
        this.eventPriceID = 0;
        this.amount = 0;
        this.date = new Date();
    }
}
