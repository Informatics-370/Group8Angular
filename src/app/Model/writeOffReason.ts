// writeOffReason.ts
export class WriteOffReason {
    writeOff_ReasonID: number | undefined;
    description: string | undefined;
    date_of_last_update: Date | undefined;
    timesUsed: number | undefined;
    bottelsLost: number | undefined;
  
    constructor() {
      this.writeOff_ReasonID = 0;
      this.description = "";
      this.date_of_last_update = new Date();
      this.timesUsed = 0;
      this.bottelsLost =0;
    }
  }
  