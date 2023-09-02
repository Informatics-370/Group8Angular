import { EarlyBird } from "./earlybird";
import { EventType } from "./eventtype";


export class Event {
    eventID: number;
    name: string;
    eventDate: Date;
    tickets_Available: number;
    tickets_Sold: number;
    description: string;
    price: number;
    filePath: string;
    displayItem:  boolean | undefined;
    earlyBirdID?: number;
    earlyBird?: EarlyBird = new EarlyBird();

    eventTypeID?: number;
    eventType?: EventType;
   


    constructor(
        eventID: number = 0,
        name: string = '',
        eventDate: Date = new Date(),
        tickets_Available: number = 0,
        tickets_Sold: number = 0,
        description: string = '',
        price: number = 0,
        filePath: string = '',
        displayItem: boolean = true,  // Corrected this line
        earlyBirdID?: number, // Made this parameter optional
        earlyBird?: EarlyBird, // Added this parameter

        eventTypeID?: number, // Add this line
        eventType?: EventType  // Add this line

    ) {
        this.eventID = eventID;
        this.name = name;
        this.eventDate = eventDate;
        this.tickets_Available = tickets_Available;
        this.tickets_Sold = tickets_Sold;
        this.description = description;
        this.price = price;
        this.filePath = filePath;
        this.displayItem = displayItem;
        this.earlyBirdID = earlyBirdID;
        this.earlyBird = earlyBird; // Assigned the parameter value

        this.eventTypeID = eventTypeID;  // Add this line
        this.eventType = eventType;      // Add this line

    }
}
