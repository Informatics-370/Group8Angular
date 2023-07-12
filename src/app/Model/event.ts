import { EarlyBird } from "./earlybird";
// import { EventType } from "./eventtype";
import { EventPrice } from "./eventprice";
// import { Booking } from "./booking";

export class Event {
    eventID: number;
    eventName: string;
    eventDate: Date;
    tickets_Available: number;
    tickets_Sold: number;
    description: string;
    eventPrice : number;
    imagePath: string;

    constructor(
        eventID: number = 0,
        eventName: string = '',
        eventDate: Date = new Date(),
        tickets_Available: number = 0,
        tickets_Sold: number = 0,
        description: string = '',
        eventPrice : number= 0,
        imagePath: string = ''
    ) {
        this.eventID = eventID;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.tickets_Available = tickets_Available;
        this.tickets_Sold = tickets_Sold;
        this.description = description;
        this.eventPrice = eventPrice;
        this.imagePath = imagePath;

    }
}
