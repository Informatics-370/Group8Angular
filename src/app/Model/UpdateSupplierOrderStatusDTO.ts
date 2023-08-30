export interface UpdateSupplierOrderStatusDTO {
    supplierOrderID: number;
    supplierOrderStatusID: number;
    ordered: boolean;
    paid: boolean;
    received: boolean;
  }
  