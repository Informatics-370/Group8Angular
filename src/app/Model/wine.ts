import { WineType } from "./winetype";
import { Varietal } from "./varietal";

export class Wine {
  wineID: number;
  name: string;
  // description: string;
  vintage: string;
  // restockLimit: number;
  filePath: string; 
  wineTastingNote: string;
  winePrice: number;
  wineTypeID: number;
  wineType: WineType;
  varietalID: number;
  varietal: Varietal;

  constructor(
    wineID: number = 0,
    name: string = "",
    description: string = "",
    vintage: string = "",
    restockLimit: number = 0,
    filePath: string = "",
    wineTastingNote: string = "",
    winePrice: number = 0,
    wineTypeID: number = 0,
    wineType: WineType = new WineType(),
    varietalID: number = 0,
    varietal: Varietal = new Varietal()
  ) {
    this.wineID = wineID;
    this.name = name;
    // this.description = description;
    this.vintage = vintage;
    // this.restockLimit = restockLimit;
    this.filePath = filePath;
    this.wineTastingNote = wineTastingNote;
    this.winePrice = winePrice;
    this.wineTypeID = wineTypeID;
    this.wineType = wineType;
    this.varietalID = varietalID;
    this.varietal = varietal;
  }

  get wineTypeName(): string | undefined {
    return this.wineType?.name;
  }

  get varietalName(): string | undefined {
    return this.varietal?.name;
  }
}