import { WineType } from "./winetype";
import { Varietal } from "./varietal";

export class Wine {
  WineID: number | undefined;
  Name: string | undefined;
  Description: string | undefined;
  Vintage: string | undefined;
  RestockLimit: number | undefined;
  ImageUrl: string | undefined;
  WineTastingNote: string | undefined;
  WinePrice: number | undefined;
  WineTypeID: number | undefined;
  WineType: WineType | undefined;
  VarietalID: number | undefined;
  Varietal: Varietal | undefined;

  constructor(wineID = 0, name = '', description = '', vintage = '', restockLimit = 0, imageUrl = '', wineTastingNote = '', winePrice = 0, wineTypeID = 0, wineType = new WineType(), varietalID = 0, varietal = new Varietal()) {
    this.WineID = wineID;
    this.Name = name;
    this.Description = description;
    this.Vintage = vintage;
    this.RestockLimit = restockLimit;
    this.ImageUrl = imageUrl;
    this.WineTastingNote = wineTastingNote;
    this.WinePrice = winePrice;
    this.WineTypeID = wineTypeID;
    this.WineType = wineType;
    this.VarietalID = varietalID;
    this.Varietal = varietal;
  }

  get WineTypeName(): string | undefined {
    return this.WineType?.name;
  }

  get VarietalName(): string | undefined {
    return this.Varietal?.name;
  }
}
