import { WineType } from "./winetype";

export class Varietal {
    varietalID: number|undefined;
    name: string|undefined;
    description: string|undefined;
    wineTypeID : number|undefined;
    wineType : WineType|undefined;
    blend : boolean|undefined;
  
    constructor() {
      this.varietalID = 0;
      this.name = '';
      this.description = '';
      this.wineTypeID = 0;
      this.blend = false;
    }
  }