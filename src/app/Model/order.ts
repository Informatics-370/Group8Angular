

import {OrderItem} from './orderItem';
 
// order.model.ts
export interface Order {
    wineOrderId: number;
    orderTotal: number;
    customerId: string;
    orderDate: Date;
    received : boolean;
    orderItems: OrderItem[];
  }