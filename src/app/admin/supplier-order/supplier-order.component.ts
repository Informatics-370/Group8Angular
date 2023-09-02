import { Component, OnInit } from '@angular/core';
import { SupplierOrderService } from '../services/supplier-order.service';
import { SupplierOrder, SupplierOrderStatus  } from 'src/app/Model/supplierOrder';
import { Supplier } from 'src/app/Model/supplier';
import { SupplierService } from '../services/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateSupplierOrderStatusDTO } from '../../Model/UpdateSupplierOrderStatusDTO';
import { AuditTrail } from 'src/app/Model/audit-trail';
import { Customer } from 'src/app/Model/customer';
import { AuditlogService } from '../services/auditlog.service';
import { CustomersService } from '../services/customers.service';
import { delay, timeout } from 'rxjs';
import { DataServiceService } from 'src/app/customer/services/data-service.service';
import { StockTake } from 'src/app/Model/stocktake';
import { StockTakeService } from '../services/stocktake.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css']
})
export class SupplierOrderComponent implements OnInit {
  supplierOrders: SupplierOrder[] = [];
  selectedOrder?: SupplierOrder | null = null;
  currentOrder: SupplierOrder = new SupplierOrder();
  showDeleteSupplierOrderModal = false;
  supplierOrderToDelete: SupplierOrder | null = null;
  showAddSupplierOrderModal = false;
  suppliers: Supplier[] = [];
  showStockTakeModel = false;
  stocktakes: StockTake[] = [];
  selectedStocktake: any = {};

  constructor(private supplierOrderService: SupplierOrderService, private supplierService: SupplierService, private toastr: ToastrService,
    private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService,
    private stocktakeService: StockTakeService) { 
      this.selectedStocktake = new StockTake();
    }

  ngOnInit(): void {
    this.getSupplierOrders();
    this.getSuppliers();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
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
    console.log('Hallo Dihan', order);
    order.dateOrdered = new Date();
    order.orderTotal = order.winePrice! * order.quantity_Ordered!;
    order.supplierOrderStatus = new SupplierOrderStatus(); // Initialize orderStatus
  
    this.supplierOrderService.createSupplierOrder(order).subscribe(
      createdOrder => {
        this.supplierOrders.push(createdOrder);
        this.closeAddSupplierOrderModal(); // Close the Add Supplier Order modal after saving
        console.log(createdOrder);
        this.toastr.success('Successfully added', 'Order');
      },
      error => {
        this.toastr.error('Failed to add order', 'Order');
        console.error('Error creating order:', error);
      }
    );
  }
  
  Stocktake(order: SupplierOrder, form: NgForm): void{
    let wineName = order.wineName;
    let quantityOrdered = order.quantity_Ordered;
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

      if (order.supplierOrderStatus.received){
        console.log('Big brain on its way', order);
        this.showStockTakeModel = true;
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

  AuditTrail: AuditTrail[] = [];
  currentAudit: AuditTrail = new AuditTrail();
  user: Customer | undefined;
  userDetails: any;

  loadUserData() {
    const userEmail = this.userDetails?.email;

    if (userEmail != null) {
      this.customerService.GetCustomer(userEmail).subscribe(
        (result: any) => {
          console.log(result);
          // Access the user object within the result
          this.user = result.user; // Assign the user data to the variable
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load user data.');
        }
      );
    }
  }

  async AddAuditLog(button: string): Promise<void> {
    this.loadUserData();
    this.currentAudit.buttonPressed = button;
    this.currentAudit.userName = this.user?.first_Name;
    this.currentAudit.userEmail = this.user?.email;
    console.log(this.currentAudit);
    const data = await this.auditLogService.addAuditLog(this.currentAudit);
    this.AuditTrail.push(data);
  }


  // openStockTakeModal() {
  //   this.showStockTakeModel = true;
  // }

  // closeStockTakeModal() {
  //   this.showStockTakeModel = false;
  // }





  // async submitStocktake(stocktakeForm: NgForm): Promise<void> {
  //   if (stocktakeForm.valid) {
  //     try {
  //       const stocktakeData = stocktakeForm.value;
  //       console.log('EK sukkel', stocktakeData);
  
  //       // Assuming you have a stocktakeService to add a new stocktake
  //       const submittedStocktake: StockTake = await this.stocktakeService.AddStockTake(stocktakeData).toPromise();
        
  //       this.stocktakes.push(submittedStocktake);
  //       this.closeStockTakeModal();
  //       stocktakeForm.resetForm();
  //       console.log(submittedStocktake);
        
  //       this.toastr.success('Stocktake entry added successfully', 'Stocktake');
  //     } catch (error) {
  //       console.error(error);
  //       this.toastr.error('Failed to add stocktake', 'Stocktake');
  //       this.closeStockTakeModal();
  //     }
  //   }
  // }


  

  openStockTakeModal(stocktake: StockTake) {
    this.selectedStocktake = stocktake;
    this.showStockTakeModel = true;
    console.log(this.selectedStocktake);
  }

  closeStockTakeModal() {
    this.selectedStocktake = null;
    this.showStockTakeModel = false;
  }

  async submitStocktake(stocktakeForm: NgForm): Promise<void> {
    if (stocktakeForm.valid && this.selectedStocktake) {
      try {
        const updatedData = {
          stocktakeID: this.selectedStocktake.stocktakeID,
          wineName: this.selectedStocktake.wineName,
          quantityOrdered: this.selectedStocktake.quantityOrdered,
          quantityReceived: stocktakeForm.value.quantityReceived,
        };
  
        const updatedStocktake: StockTake = await this.stocktakeService
          .AddStockTake(updatedData)
          .toPromise();
  
        // Update the selectedStocktake with the updated data
        this.selectedStocktake.quantityReceived = updatedStocktake.quantityReceived;
  
        this.closeStockTakeModal();
        stocktakeForm.resetForm();
        this.toastr.success('Stocktake entry updated successfully', 'Stocktake');
      } catch (error) {
        console.error(error);
        this.toastr.error('Failed to update stocktake', 'Stocktake');
        this.closeStockTakeModal();
      }
    }
  }

}
