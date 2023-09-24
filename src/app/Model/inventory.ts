import { WineType } from "./winetype";
import { Varietal } from "./varietal";
import { Wine } from "./wine";
import { SupplierOrder } from "./supplierOrder";
export class Inventory {
  inventoryID: number;
  wineID: number;
  wine: Wine | undefined;
  varietalID: number;
  varietal: Varietal | undefined;
  wineTypeID: number;
  wineType: WineType | undefined;
  stockLimit: number;
  quantityOnHand: number;
  winePrice: number;
  supplierOrders: SupplierOrder[] | undefined; // Added property for SupplierOrders

  constructor(
    inventoryID: number = 0,
    wineID: number = 0,
    varietalID: number = 0,
    wineTypeID: number = 0,
    stockLimit: number = 0,
    quantityOnHand: number = 0,
    winePrice: number = 0
  ) {
    this.inventoryID = inventoryID;
    this.wineID = wineID;
    this.varietalID = varietalID;
    this.wineTypeID = wineTypeID;
    this.stockLimit = stockLimit;
    this.quantityOnHand = quantityOnHand;
    this.winePrice = winePrice;
  }
}
