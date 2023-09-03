import { Inventory } from "./inventory";

// writeOffs.ts
export class WriteOffs {
    writeOffID: number | undefined;
    writeOff_Reason: string | undefined;
    writeOff_Date: Date | undefined;
    wineName: string | undefined;
    quantity: number;
  
    constructor() {
      this.writeOffID = 0;
      this.writeOff_Reason = '';
      this.writeOff_Date = new Date();
      this.wineName = '';
      this.quantity =0;
    }
  }
  