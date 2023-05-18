// writeOffReason.ts
export class WriteOffReason {
    writeOff_ReasonID: number | undefined;
    description: string | undefined;
    date_of_last_update: Date | undefined;
  
    constructor() {
      this.writeOff_ReasonID = 0;
      this.description = "";
      this.date_of_last_update = new Date();
    }
  }
  