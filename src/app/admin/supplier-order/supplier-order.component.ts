import { Component, EventEmitter, OnInit } from '@angular/core';
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
import { ReportService } from '../services/report.service';
import { PdfService } from '../services/pdf.service';
import { SuppOrderAndVATViewModel } from 'src/app/Model/SupplierOrdersVATs';

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
  originalSupplierOrders: SupplierOrder[] = []; 

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
  vintageMap: Map<number, string> = new Map();

  constructor(private supplierOrderService: SupplierOrderService, private supplierService: SupplierService, private toastr: ToastrService,
    private customerService: CustomersService,private auditLogService: AuditlogService, private dataService: DataServiceService,
    private stocktakeService: StockTakeService, private inventoryService: InventoryService, private wineService: WineService, private reportService: ReportService,
    private pdfService: PdfService) { 
      this.selectedStocktake = new StockTake();
    }

  ngOnInit(): void {
    this.getSupplierOrders();
    this.getSuppliers();
    this.getInventories();
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
    this.totalPages = Math.ceil(this.supplierOrders.length / this.pageSize);
    

    this.originalSupplierOrders = [...this.supplierOrders]; // Initialize original orders

    this.updateDisplayedOrders();
    this.calculateTotalPages();
  }

  getSupplierOrders(): void {
    this.supplierOrderService.getSupplierOrders().subscribe(
      orders => {
        console.log('Fetched Orders:', orders);  // Debug line
        this.supplierOrders = orders;
        this.originalSupplierOrders = [...this.supplierOrders];
        console.log('Original Supplier Orders:', this.originalSupplierOrders);  // Additional Debug line
        this.calculateTotalPages();
        this.updateDisplayedOrders();
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
        let vintage = await this.getWineVintageFromInventory(inventory.inventoryID);
        this.vintageMap.set(inventory.inventoryID, vintage);
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

  async getWineVintageFromInventory(id: number): Promise<string> {
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
          return wine.vintage;
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



  // REPORT:
  currentReportType: 'REFUNDS' | 'EVENTS' | 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES' | null = null;
  showBlacklistModal: boolean = false;

  showModal(reportType: 'BLACKLIST' | 'INVENTORY' | 'SUPPLIER ORDER' | 'WINES'): void {
    this.currentReportType = reportType;
    this.showBlacklistModal = true;
  }

  closeBlacklistModal() {
    this.showBlacklistModal = false;
    this.currentReportType = null;
  }

  OpenReports(): void {
   
    if (this.currentReportType === 'SUPPLIER ORDER') {
      this.generateSupplierOrderReport();
    } 
  }

  DownloadReports(): void {
    if (this.currentReportType === 'SUPPLIER ORDER') {
      this.generateSupplierOrderReportpdf();
    }
  }

  async generateSupplierOrderReportpdf() {
    let suppOrderAndVATData!: SuppOrderAndVATViewModel;

    // Wait for the supplier order data to be fetched
    await new Promise<void>((resolve, reject) => {
      this.reportService.getSupplierOrder().subscribe(result => {
        // Assuming result now returns an object with supplierOrders and vaTs properties
        suppOrderAndVATData = result;
        console.log('SuppOrderAndVAT Data', suppOrderAndVATData);
        resolve();
      }, error => reject(error));
    });

    // Ensure that we have data before proceeding
    if (!suppOrderAndVATData || !suppOrderAndVATData.supplierOrders) {
      console.error('Received undefined or invalid supplier order data');
      return;
    }
    this.pdfService.generateSupplierOrdersPdf([suppOrderAndVATData]);
  }

  async generateSupplierOrderReport(): Promise<void> {
    try {
      let suppOrderAndVATData!: SuppOrderAndVATViewModel;

      // Wait for the supplier order data to be fetched
      await new Promise<void>((resolve, reject) => {
        this.reportService.getSupplierOrder().subscribe(result => {
          // Assuming result now returns an object with supplierOrders and vaTs properties
          suppOrderAndVATData = result;
          console.log('SuppOrderAndVAT Data', suppOrderAndVATData);
          resolve();
        }, error => reject(error));
      });

      // Ensure that we have data before proceeding
      if (!suppOrderAndVATData || !suppOrderAndVATData.supplierOrders) {
        console.error('Received undefined or invalid supplier order data');
        return;
      }
      const pdfBlob = await this.pdfService.generateSupplierOrders([suppOrderAndVATData]);
      const blobUrl = URL.createObjectURL(pdfBlob);
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab for PDF');
      }
    } catch (error) {
      console.error('Error generating inventory report:', error);
    }
  }


  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10; // Items per page
  pageChange: EventEmitter<number> = new EventEmitter();
  displayedOrders: SupplierOrder[] = []; // Orders to be displayed based on pagination
  searchQuery: string = ''; // Variable to hold search query
  showReceivedOrders: boolean = true; // Show received orders by default





  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedOrders();
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedOrders();
      this.pageChange.emit(this.currentPage);
    }
  }

  updateDisplayedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedOrders = this.supplierOrders.slice(start, end);
  }
  
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.supplierOrders.length / this.pageSize);
  }

  filterOrders() {
    this.supplierOrders = this.originalSupplierOrders.filter(order => {
  
      // Filter based on showReceivedOrders and SupplierOrderStatus.received
      if (!this.showReceivedOrders && order.supplierOrderStatus?.received) {
        return false;
      }
  
      if (this.searchQuery) {
        const attributesConcatenated = [
          order.supplierOrderRefNum,
          order.quantity_Ordered,
          order.dateOrdered,
          order.orderTotal,
          order.isBackOrder,
          order.supplier?.name,
          order.supplierOrderStatus?.supplierOrderStatusID,
          order.supplierOrderStatus?.ordered,
          order.supplierOrderStatus?.paid,
          order.supplierOrderStatus?.received
        ].map(String).join(' ').toLowerCase();
  
        return attributesConcatenated.includes(this.searchQuery.toLowerCase());
      }
  
      return true;
    });
  
    this.calculateTotalPages();
    this.currentPage = 1;
    this.updateDisplayedOrders();
  }
  
  get pagedSupplierOrders(): SupplierOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.supplierOrders.slice(start, end);
  }

  toggleReceivedOrders() {
    this.showReceivedOrders = !this.showReceivedOrders;
    this.filterOrders(); // Re-filter the orders based on the new setting
  }
  
  
  

 
  
}

