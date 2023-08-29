import { Wine } from "./wine";

export interface OrderItem {
  id: string;
  wineId: number;
  wine?: Wine;  // this is optional, can be loaded later
  quantity: number;
}
