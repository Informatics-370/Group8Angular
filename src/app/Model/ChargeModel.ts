import { LocalPrice } from "./LocalPrice";

export interface ChargeModel {
    name: string;
    description: string;
    pricing_type: string;
    local_price: LocalPrice;
  }