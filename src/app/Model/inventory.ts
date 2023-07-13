import { WineType } from "./winetype";
import { Varietal } from "./varietal";

export class Inventory {
  inventoryID: number;
  wineID: number;
  name: string;
  varietalID: number;
  varietal: Varietal;
  wineTypeID: number;
  wineType: WineType;
  winePrice: number;
  stockLimit: number;
  quantityOnHand: number;
  

  constructor(
    inventoryID: number =0,
    wineID: number = 0,
    name: string = "",
    varietalID: number = 0,
    varietal: Varietal = new Varietal(),
    wineTypeID: number = 0,
    wineType: WineType = new WineType(),
    winePrice: number = 0,
    stockLimit: number = 0,
    quantityOnHand: number =0    
  ) {
    this.inventoryID = inventoryID;
    this.wineID = wineID;
    this.name = name;
    this.winePrice = winePrice;
    this.wineTypeID = wineTypeID;
    this.wineType = wineType;
    this.varietalID = varietalID;
    this.varietal = varietal;
    this.stockLimit = stockLimit;
    this.quantityOnHand = quantityOnHand;
  }

  get wineTypeName(): string | undefined {
    return this.wineType?.name;
  }

  get varietalName(): string | undefined {
    return this.varietal?.name;
  }
}