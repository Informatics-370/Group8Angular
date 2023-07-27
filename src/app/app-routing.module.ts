import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WineComponent } from './admin/wine/wine.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { EventComponent } from './admin/event/event.component';
import { FaqComponent } from './admin/faq/faq.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { ReportComponent } from './admin/report/report.component';
import { BlacklistComponent } from './admin/blacklist/blacklist.component';
import { VatComponent } from './admin/vat/vat.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { VarietalComponent } from './admin/varietal/varietal.component';
import { TypeComponent } from './admin/type/type.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { EarlyBirdComponent } from './admin/early-bird/early-bird.component';
import { EventTypeComponent } from './admin/event-type/event-type.component';
import { EventPriceComponent } from './admin/event-price/event-price.component';
import { SupplierOrderComponent } from './admin/supplier-order/supplier-order.component';

//Client side
import { ClientHomeComponent } from './customer/client-home/client-home.component';
import { ClientEventsComponent } from './customer/client-events/client-events.component';
import { ClientProductsComponent } from './customer/client-products/client-products.component';
import { MyRefundsComponent } from './customer/my-refunds/my-refunds.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { RefundRequestComponent } from './customer/refund-request/refund-request.component';
import { TicketsComponent } from './customer/tickets/tickets.component';
import { UserInformationComponent } from './customer/user-information/user-information.component';
import { UsernameAndPasswordComponent } from './customer/username-and-password/username-and-password.component';
import { WishlistComponent } from './customer/wishlist/wishlist.component';
import { CartComponent } from './customer/cart/cart.component';
import { CustomerFaqComponent } from './customer/customer-faq/customer-faq.component';
import { SystemprivilegesComponent } from './admin/systemprivileges/systemprivileges.component';
import { SuperuserComponent } from './admin/superuser/superuser.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ClientAboutComponent } from './customer/client-about/client-about.component';
import { ClientContactComponent } from './customer/client-contact/client-contact.component';






const routes: Routes = [
  { path: '', redirectTo: '/clienthome', pathMatch: 'full' },
  { path: 'wine', component: WineComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'event', component: EventComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'report', component: ReportComponent },
  { path: 'blacklist', component: BlacklistComponent },
  { path: 'vat', component: VatComponent},
  { path: 'employees', component: EmployeeComponent},
  { path: 'systemprivileges', component: SystemprivilegesComponent},
  { path: 'superuser', component: SuperuserComponent},
  { path: 'customers', component: CustomersComponent},
  { path: 'users', component: UserManagementComponent},
  {path: 'varietal', component: VarietalComponent},
  {path: 'type', component: TypeComponent},
  {path: 'discount', component: DiscountComponent},
  {path: 'earlybird', component: EarlyBirdComponent},
  {path: 'eventtype', component:EventTypeComponent},
  {path: 'eventprice', component: EventPriceComponent}, //FROM HERE WE HAVE THE CLIENT SIDE COMPONENTS
  {path: 'clienthome', component: ClientHomeComponent},
  {path: 'clientabout', component: ClientAboutComponent },
  {path: 'clientcontact', component: ClientContactComponent },
  {path: 'clientevents', component: ClientEventsComponent},
  {path: 'clientproducts', component: ClientProductsComponent},
  {path: 'myrefunds', component: MyRefundsComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'refundrequest', component: RefundRequestComponent},
  {path: 'tickets', component: TicketsComponent},
  {path: 'userinformation', component: UserInformationComponent},
  {path: 'usernameandpassword', component: UsernameAndPasswordComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'cart', component: CartComponent},
  {path: 'customerfaq', component: CustomerFaqComponent},
  {path: 'cart', component: CartComponent},
  {path: 'supplierOrder', component : SupplierOrderComponent},
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
