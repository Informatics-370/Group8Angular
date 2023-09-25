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
import { refresh } from 'aos';
import { Inventory } from 'src/app/Model/inventory';
import { InventoryService } from '../services/inventory.service';
import { WineService } from '../services/wine.service';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css']
})
export class SupplierOrderComponent implements OnInit {
  // SupplierOrders
  supplierOrders: SupplierOrder[] = [];
  selectedOrder?: SupplierOrder | null = null;
  currentOrder: SupplierOrder = new SupplierOrder();
  showDeleteSupplierOrderModal = false;
  supplierOrderToDelete: SupplierOrder | null = null;
  showAddSupplierOrderModal = false;
  showPaidModal: boolean = false;

  //Suppliers
  suppliers: Supplier[] = [];

  //StockTake
  showStockTakeModel = false;
  stocktakes: StockTake[] = [];
  selectedStocktake: any = {};
  QuantityReceived: number = 0;

  //Inventory
  inventories: Inventory[] = [];
  wineNamesMap: Map<number, string> = new Map();

  constructor(private supplierOrderService: SupplierOrderService, private supplierService: SupplierService, private toastr: ToastrService,
    private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService,
    private stocktakeService: StockTakeService, private inventoryService: InventoryService, private wineService: WineService) { 
      this.selectedStocktake = new StockTake();
    }

  ngOnInit(): void {
    this.getSupplierOrders();
    this.getSuppliers();
    this.getInventories();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  //!Load all the necessary information for SupplierOrders
  getSupplierOrders(): void {
    this.supplierOrderService.getSupplierOrders().subscribe(
      orders => {
        this.supplierOrders = orders;
        //console.log("Orders:", this.supplierOrders);
      },
      error => {
        this.toastr.error('Error, failed to connect to the database', 'Supplier Order Table');
      }
    );
    
  }

  getSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
      //console.log("Suppliers:", this.suppliers); // Check output
    });
  }

  getInventories(): void {
    this.inventoryService.getFullInventory().then(async (result: any) => {
      this.inventories = result;

      for (let inventory of this.inventories) {
        let wineName = await this.getWineNameFromInventory(inventory.inventoryID);
        this.wineNamesMap.set(inventory.inventoryID, wineName);
      }
      // /console.log("Inventory:", this.inventories);
    })
  }

  //! Loaded all the neccessary information for SupplierOrders

  async getWineNameFromInventory(id: number): Promise<string> {
    try {
      // Get Inventory object by id
      let inventory = await this.inventoryService.getItemInventory(id);
      
      if (inventory) {
        // Get wineID from the Inventory object
        let wineID = inventory.wineID;
        
        // Get Wine object using wineID
        let wine = await this.wineService.getWine(wineID);
        
        if (wine) {
          // Return wineName from the Wine object
          return wine.name;
        }
      }
      throw new Error('Inventory or Wine not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
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
    order.orderTotal = 0;
    order.supplierOrderStatus = new SupplierOrderStatus(); // Initialize orderStatus
  
    this.supplierOrderService.createSupplierOrder(order).subscribe(
      createdOrder => {
        this.supplierOrders.push(createdOrder);
        console.log(createdOrder);
        this.toastr.success('Successfully added', 'Order');
        this.closeAddSupplierOrderModal(); // Close the Add Supplier Order modal after saving
        this.getSupplierOrders();
      },
      error => {
        this.toastr.error('Failed to add order', 'Order');
        console.error('Error creating order:', error);
      }
    );
  }
  
  updateOrder(order: SupplierOrder, orderTotal: number): void {
    console.log("Current Order:", orderTotal);
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
        orderPrice: orderTotal,
        ordered: order.supplierOrderStatus.ordered,
        paid: order.supplierOrderStatus.paid,
        received: order.supplierOrderStatus.received,
      };
      console.log("StatusDTO:", statusDTO.orderPrice);

      try {
        this.supplierOrderService.updateSupplierOrderStatus(order.supplierOrderID!, statusDTO).subscribe(() => {
          const index = this.supplierOrders.findIndex(o => o.supplierOrderID === order.supplierOrderID);
          if (index !== -1) {
            this.supplierOrders[index] = order;
          }
          this.selectedOrder = null; // clear selection
        });
        this.getSupplierOrders();
        this.toastr.success('Successfully Updated', 'Order');
        this.closePaidModal();
      } catch {
        this.toastr.error('Error occurred please try again', 'Order');
      }
    }
  }

  openPaidModal(id: number){
    let originalOrder = this.supplierOrders.find(x => x.supplierOrderID === id);
    if (originalOrder) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentOrder = {...originalOrder};
    }
    this.showPaidModal = true;
  }

  openStockTakeModal(id: number){
    let originalOrder = this.supplierOrders.find(x => x.supplierOrderID === id);
    if (originalOrder) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentOrder = {...originalOrder};
    }
    this.showStockTakeModel = true;
  }

  closePaidModal() {
    this.showPaidModal = false;
  }

  async submitStocktake(stocktakeForm: NgForm): Promise<void> {

    if (stocktakeForm.valid) {
      console.log('Quantity Received',this.QuantityReceived)
      let newStockTake: StockTake = {
        stocktakeID: 0,
        quantityOrdered: this.currentOrder.quantity_Ordered!,
        quantityReceived: this.QuantityReceived,
        dateDone: new Date(),
        added: false,
        supplierOrderID: this.currentOrder.supplierOrderID!
      };
    console.log(newStockTake);
  
  try{
    await this.stocktakeService.AddStockTake(newStockTake);
    this.getSupplierOrders();
    stocktakeForm.resetForm();
    this.closeStockTakeModal();
  }
    catch{}
  }

}

  closeStockTakeModal(){
    this.showStockTakeModel = false;
  }

  //? AUDIT TRAIL 

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
}