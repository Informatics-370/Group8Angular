export interface UpdateSupplierOrderStatusDTO {
    supplierOrderID: number;
    supplierOrderStatusID: number;
    orderPrice: number;
    ordered: boolean;
    paid: boolean;
    received: boolean;
  }
  