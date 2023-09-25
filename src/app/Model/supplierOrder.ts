import { Supplier } from './supplier';
import { Inventory } from './inventory'; // Import Inventory model

export class SupplierOrderStatus {
  supplierOrderStatusID: number | undefined;
  ordered: boolean = false;
  paid: boolean = false;
  received: boolean = false;
}

export class SupplierOrder {
  supplierOrderID: number | undefined;
  supplierOrderRefNum: string | undefined;
  quantity_Ordered: number | undefined;
  dateOrdered: Date | undefined;
  orderTotal: number | undefined;
  supplierID: number | undefined;
  supplier: Supplier | undefined;
  inventoryID: number | undefined; // Added InventoryID property
  inventory: Inventory | undefined; // Added Inventory property
  supplierOrderStatus: SupplierOrderStatus | undefined;
  isBackOrder: boolean | undefined;
}
