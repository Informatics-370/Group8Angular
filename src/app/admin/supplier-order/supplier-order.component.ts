import { Component, OnInit } from '@angular/core';
import { SupplierOrderService } from '../services/supplier-order.service';
import { SupplierOrder, SupplierOrderStatus  } from 'src/app/Model/supplierOrder';
import { Supplier } from 'src/app/Model/supplier';
import { SupplierService } from '../services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateSupplierOrderStatusDTO } from '../../Model/UpdateSupplierOrderStatusDTO';

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
    this.supplierOrderService.getSupplierOrders().subscribe(
      orders => {
        this.supplierOrders = orders;
        console.log("Orders:", this.supplierOrders);
      },
      error => {
        this.toastr.error('Error, failed to connect to the database', 'Supplier Order Table');
      }
    );
    
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
    const supplier = this.suppliers.find(s => s.supplierID === id);
    return supplier?.name;
  }

  openAddSupplierOrderModal(): void {
    this.selectedOrder = new SupplierOrder();
    this.showAddSupplierOrderModal = true;
  }

  closeAddSupplierOrderModal(): void {
    this.selectedOrder = null;
    this.showAddSupplierOrderModal = false;
  }

  createOrder(order: SupplierOrder): void {
    order.dateOrdered = new Date();
    order.orderTotal = order.winePrice! * order.quantity_Ordered!;
    order.supplierOrderStatus = new SupplierOrderStatus(); // Initialize orderStatus
  
    this.supplierOrderService.createSupplierOrder(order).subscribe(
      createdOrder => {
        this.supplierOrders.push(createdOrder);
        this.closeAddSupplierOrderModal(); // Close the Add Supplier Order modal after saving
        this.toastr.success('Successfully added', 'Order');
      },
      error => {
        this.toastr.error('Failed to add order', 'Order');
        console.error('Error creating order:', error);
      }
    );
  }
  

  openDeleteSupplierOrderModal(order: SupplierOrder): void {
    this.supplierOrderToDelete = order;
    this.showDeleteSupplierOrderModal = true;
  }

  closeDeleteSupplierOrderModal(): void {
    this.showDeleteSupplierOrderModal = false;
  }

  deleteOrder(): void {
    if (this.supplierOrderToDelete) {
      this.supplierOrderService.deleteSupplierOrder(this.supplierOrderToDelete.supplierOrderID!).subscribe(() => {
        this.getSupplierOrders();
        this.selectedOrder = null;
        this.closeDeleteSupplierOrderModal();
      });
    }
  }

  updateOrder(order: SupplierOrder): void {
    if (order.supplierOrderStatus) {
      if (!order.supplierOrderStatus.paid) {
        order.supplierOrderStatus.received = false;
      }
      if (!order.supplierOrderStatus.ordered) {
        order.supplierOrderStatus.paid = false;
        order.supplierOrderStatus.received = false;
      }

      const statusDTO: UpdateSupplierOrderStatusDTO = {
        supplierOrderID: order.supplierOrderID!, // Assuming supplierOrderID is a non-null field
        supplierOrderStatusID: order.supplierOrderStatus.supplierOrderStatusID!,
        ordered: order.supplierOrderStatus.ordered,
        paid: order.supplierOrderStatus.paid,
        received: order.supplierOrderStatus.received,
      };

      try {
        this.supplierOrderService.updateSupplierOrderStatus(order.supplierOrderID!, statusDTO).subscribe(() => {
          const index = this.supplierOrders.findIndex(o => o.supplierOrderID === order.supplierOrderID);
          if (index !== -1) {
            this.supplierOrders[index] = order;
          }
          this.selectedOrder = null; // clear selection
        });

        this.toastr.success('Successfully Updated', 'Order');
      } catch {
        this.toastr.error('Error occurred please try again', 'Order');
      }
    }
  }
  
}

