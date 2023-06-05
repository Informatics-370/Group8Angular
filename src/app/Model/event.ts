import { EarlyBird } from "./earlybird";
import { EventType } from "./eventtype";
import { EventPrice } from "./eventprice";
// import { Booking } from "./booking";

export class Event {
    eventID: number;
    eventName: string;
    eventDate: Date;
    tickets_Available: number;
    tickets_Sold: number;
    description: string;
    image_URL: string;
    eventPriceID: number;
    eventPrice: EventPrice;
    eventTypeID: number;
    eventType: EventType;
    // bookings: Booking[];
    earlyBirdID: number | null;
    earlyBird: EarlyBird | null;

    constructor(
        eventID: number = 0,
        eventName: string = '',
        eventDate: Date = new Date(),
        tickets_Available: number = 0,
        tickets_Sold: number = 0,
        description: string = '',
        image_URL: string = '',
        eventPriceID: number = 0,
        eventPrice: EventPrice = new EventPrice(),
        eventTypeID: number = 0,
        eventType: EventType = new EventType(),
        // bookings: Booking[] = [],
        earlyBirdID: number | null = null,
        earlyBird: EarlyBird | null = null,
    ) {
        this.eventID = eventID;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.tickets_Available = tickets_Available;
        this.tickets_Sold = tickets_Sold;
        this.description = description;
        this.image_URL = image_URL;
        this.eventPriceID = eventPriceID;
        this.eventPrice = eventPrice;
        this.eventTypeID = eventTypeID;
        this.eventType = eventType;
        // this.bookings = bookings;
        this.earlyBirdID = earlyBirdID;
        this.earlyBird = earlyBird;
    }

    get eventTypeName(): string | undefined {
        return this.eventType?.eventTypeName;
    }

    get eventPriceAmount(): number | undefined {
        return this.eventPrice?.amount;
    }

    get earlyBirdPercentage(): number | undefined {
        return this.earlyBird?.percentage;
    }
}
