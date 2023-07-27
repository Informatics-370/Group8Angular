

import {OrderItem} from './orderItem';
 
// order.model.ts
export interface Order {
    id: string;
    customerId: string;
    orderDate: Date;
    orderItems: OrderItem[];
  }