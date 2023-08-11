import { Wine } from "./wine";

export interface OrderItem {
  id: string;
  wineId: number;
  wine?: Wine;
  quantity: number;
}
