import { Component, OnInit } from '@angular/core';
import { SupplierOrderService } from '../services/supplier-order.service';
import { SupplierOrder } from 'src/app/Model/supplierOrder';
import { Supplier } from 'src/app/Model/supplier';
import { SupplierService } from '../services/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css']
})
export class SupplierOrderComponent implements OnInit {
  supplierOrders: SupplierOrder[] = [];
  selectedOrder?: SupplierOrder | null = null;
  showDeleteSupplierOrderModal = false;
  supplierOrderToDelete: SupplierOrder | null = null;
  showAddSupplierOrderModal = false;
  suppliers: Supplier[] = [];

  constructor(private supplierOrderService: SupplierOrderService, private supplierService: SupplierService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.getSupplierOrders();
    this.getSuppliers();

  }

  getSupplierOrders(): void {
    try{
    this.supplierOrderService.getSupplierOrders().subscribe(orders => {
      this.supplierOrders = orders;
      console.log("Orders:", this.supplierOrders); // Check output
    });}
    catch{
    this.toastr.error('Error, failed to connect to the database', 'Supplier Order Table');
  }
}


  getSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;

      console.log("Suppliers:", this.suppliers); // Check output
    });
  }

  getQuantityOrdered() {
    return this.selectedOrder ? this.selectedOrder.quantity_Ordered : 0;
  }

  getSupplierName(id: number | undefined): string | undefined {
    if (id === undefined) {
      return undefined; // or return any default value you prefer
    }
  
    const supplier = this.suppliers.find(s => s.supplierID === id);
    return supplier?.name;
  }

  // ... (your existing component code)

openAddSupplierOrderModal(): void {
  this.selectedOrder = new SupplierOrder(); // initialize selectedOrder before opening the modal
  this.showAddSupplierOrderModal = true;
}

closeAddSupplierOrderModal(): void {
  this.selectedOrder = null; // clear selectedOrder
  this.showAddSupplierOrderModal = false;
}

createOrder(order: SupplierOrder): void {
  order.dateOrdered = new Date();
  order.orderTotal = order.winePrice! * order.quantity_Ordered!;
  this.supplierOrderService.createSupplierOrder(order).subscribe(createdOrder => {
      this.supplierOrders.push(createdOrder);
      this.closeAddSupplierOrderModal(); // Close the Add Supplier Order modal after saving
  });
  this.toastr.success('Successfully added', 'Order');
}

openDeleteSupplierOrderModal(order: SupplierOrder): void {
  this.supplierOrderToDelete = order;
  this.showDeleteSupplierOrderModal = true;
}

closeDeleteSupplierOrderModal(): void {
  this.showDeleteSupplierOrderModal = false;
}

deleteOrder(): void {
  if (this.supplierOrderToDelete !== null) {
      this.supplierOrderService.deleteSupplierOrder(this.supplierOrderToDelete.supplierOrderID!).subscribe(() => {
          this.getSupplierOrders(); // refresh the orders
          this.selectedOrder = null; // clear selection
          this.closeDeleteSupplierOrderModal(); // Close the Delete Supplier Order modal after deleting
      });
  }
}

updateOrder(order: SupplierOrder): void {
  // if the 'paid' checkbox was unticked, the 'received' checkbox should also be unticked
  if (!order.paid) {
    order.received = false;
  }
  if (!order.ordered) {
    order.paid = false;
    order.received = false;
  }
  
  try{
  this.supplierOrderService.updateSupplierOrder(order.supplierOrderID!, order).subscribe(() => {
    const index = this.supplierOrders.findIndex(o => o.supplierOrderID === order.supplierOrderID);
    if (index !== -1) {
      this.supplierOrders[index] = order;
    }
    this.selectedOrder = null; // clear selection
  });
  this.toastr.success('Successfully Updated', 'Order');
}catch{
  this.toastr.error('Error occurred please try again', 'Order');
}
}
}
