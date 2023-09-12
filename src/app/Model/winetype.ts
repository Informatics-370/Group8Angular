import { Varietal } from './varietal';  // make sure the path is correct

export class WineType {
  wineTypeID: number|undefined;
  name: string|undefined;
  description: string|undefined;
  varietals: Varietal[];  // An array to hold Varietal objects that belong to this WineType

  constructor() {
    this.wineTypeID = 0;
    this.name = '';
    this.description = '';
    this.varietals = [];  // initialize as an empty array
  }
}
