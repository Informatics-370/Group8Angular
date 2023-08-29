import { OrderStatusEnum } from './OrderStatusEnum';
import {OrderItem} from './orderItem';
 
// order.model.ts
export interface Order {
  wineOrderId: number;
  orderTotal: number;
  orderRefNum: string;
  customerId: string;
  orderDate: Date;
  collectedDate: Date;
  orderStatusId: OrderStatusEnum;  // Make sure to use the enum type
  orderItems: OrderItem[];
  isRefunded: boolean;
  wineId: number;  // If this is still relevant, keep it. Otherwise, remove.
}