import { Supplier } from './supplier';

export class SupplierOrderStatus {
  supplierOrderStatusID: number | undefined;
  ordered: boolean = false;
  paid: boolean = false;
  received: boolean = false;
}

export class SupplierOrder {
  supplierOrderID: number | undefined;
  quantity_Ordered: number | undefined;
  dateOrdered: Date | undefined;
  wineName: string | undefined;
  wineYear: string | undefined;
  wineType: string | undefined;
  winePrice: number | undefined;
  orderTotal: number | undefined;
  supplierID: number | undefined;
  supplier: Supplier | undefined;
  supplierOrderStatus: SupplierOrderStatus | undefined;
}
