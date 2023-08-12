

import {OrderItem} from './orderItem';
 
// order.model.ts
export interface Order {
  wineOrderId: number;
  orderTotal: number;
  orderRefNum: string;
  customerId: string;
  orderDate: Date;
  collectedDate: Date;
  orderStatus: number; // renamed from 'received' to 'orderStatus'
  orderItems: OrderItem[];
  isRefunded: boolean;
  wineId: number;
}
