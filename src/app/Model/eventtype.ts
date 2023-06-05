export class EventType {
    eventTypeID: number | undefined;
    eventTypeName: string | undefined;
    eventDescription: string | undefined;

    constructor() {
        this.eventTypeID = 0;
        this.eventTypeName = "";
        this.eventDescription = "";
    }
}
