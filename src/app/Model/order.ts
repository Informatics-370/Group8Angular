

import {OrderItem} from './orderItem';
 
// order.model.ts
export interface Order {
    wineOrderId: number;
    orderTotal: number;
    orderRefNum: string;
    customerId: string;
    orderDate: Date;
    received : boolean;
    orderItems: OrderItem[];
    isRefunded: boolean;
  }