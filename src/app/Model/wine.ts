import { WineType } from "./winetype";
import { Varietal } from "./varietal";

export class Wine {
  wineID: number;
  name: string;
  vintage: string;
  filePath: string; 
  wineTastingNote: string;
  price: number;
  wineTypeID: number;
  wineType: WineType;
  varietalID: number;
  varietal: Varietal;
  displayItem: boolean;
  [key: string]: any; // Adding index signature


  constructor(
    wineID: number = 0,
    name: string = "",
    vintage: string = "",
    filePath: string = "",
    wineTastingNote: string = "",
    price: number = 0,
    wineTypeID: number = 0,
    wineType: WineType = new WineType(),
    varietalID: number = 0,
    varietal: Varietal = new Varietal(),
    displayItem: boolean = false
  ) {
    this.wineID = wineID;
    this.name = name;
    // this.description = description;
    this.vintage = vintage;
    // this.restockLimit = restockLimit;
    this.filePath = filePath;
    this.wineTastingNote = wineTastingNote;
    this.price = price;
    this.wineTypeID = wineTypeID;
    this.wineType = wineType;
    this.varietalID = varietalID;
    this.varietal = varietal;
    this.displayItem = displayItem;
  }

  get wineTypeName(): string | undefined {
    return this.wineType?.name;
  }

  get varietalName(): string | undefined {
    return this.varietal?.name;
  }
}