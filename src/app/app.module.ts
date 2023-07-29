import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WineComponent } from './admin/wine/wine.component';
import { EventComponent } from './admin/event/event.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { FaqComponent } from './admin/faq/faq.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { ReportComponent } from './admin/report/report.component';
import { BlacklistComponent } from './admin/blacklist/blacklist.component';

//Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidenavComponent } from './admin/sidenav/sidenav.component';
import { VatComponent } from './admin/vat/vat.component';

//ClientModule
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SystemprivilegesComponent } from './admin/systemprivileges/systemprivileges.component';
import { EmployeeComponent } from './admin/employee/employee.component';

//Successfull and error message popups
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarietalComponent } from './admin/varietal/varietal.component';
import { TypeComponent } from './admin/type/type.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { EarlyBirdComponent } from './admin/early-bird/early-bird.component';
import { EventTypeComponent } from './admin/event-type/event-type.component';
import { EventPriceComponent } from './admin/event-price/event-price.component';
import { SpinnerComponent } from './admin/spinner/spinner.component';
import { HttpInterceptorInterceptor } from './admin/http.interceptor';
import { SpinnerService } from './admin/services/spinner.service';
import { ClientHomeComponent } from './customer/client-home/client-home.component';
import { ClientProductsComponent } from './customer/client-products/client-products.component';
import { ClientEventsComponent } from './customer/client-events/client-events.component';
import { UserInformationComponent } from './customer/user-information/user-information.component';
import { UsernameAndPasswordComponent } from './customer/username-and-password/username-and-password.component';
import { OrdersComponent } from './customer/orders/orders.component';
import { TicketsComponent } from './customer/tickets/tickets.component';
import { RefundRequestComponent } from './customer/refund-request/refund-request.component';
import { MyRefundsComponent } from './customer/my-refunds/my-refunds.component';
import { WishlistComponent } from './customer/wishlist/wishlist.component';
import { NavbarComponent } from './customer/navbar/navbar.component';
import { CustomerSidenavComponent } from './customer/customer-sidenav/customer-sidenav.component';
import { CartComponent } from './customer/cart/cart.component';
import { CustomerFaqComponent } from './customer/customer-faq/customer-faq.component';
import { SuperuserComponent } from './admin/superuser/superuser.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { SupplierOrderComponent } from './admin/supplier-order/supplier-order.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { RefundsComponent } from './admin/refunds/refunds.component';
import { ClientAboutComponent } from './customer/client-about/client-about.component';
import { ClientContactComponent } from './customer/client-contact/client-contact.component';
import { RefundRequestsComponent } from './admin/refund-requests/refund-requests.component';



@NgModule({
  declarations: [
    AppComponent,
    WineComponent,
    EventComponent,
    InventoryComponent,
    FaqComponent,
    SupplierComponent,
    ReportComponent,
    BlacklistComponent,
    SidenavComponent,
    VatComponent,
    SystemprivilegesComponent,
    EmployeeComponent,
    VarietalComponent,
    TypeComponent,
    DiscountComponent,
    EarlyBirdComponent,
    EventTypeComponent,
    EventPriceComponent,
    SpinnerComponent,
    ClientHomeComponent,
    ClientProductsComponent,
    ClientEventsComponent,
    UserInformationComponent,
    UsernameAndPasswordComponent,
    OrdersComponent,
    TicketsComponent,
    RefundRequestComponent,
    MyRefundsComponent,
    WishlistComponent,
    NavbarComponent,
    CustomerSidenavComponent,
    CartComponent,
    CustomerFaqComponent,
    SuperuserComponent,
    CustomersComponent,
    UserManagementComponent,
    SupplierOrderComponent,
    AdminOrdersComponent,
    RefundsComponent,
    ClientAboutComponent,
    ClientContactComponent,
    RefundRequestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({ // ToastrModule options
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,}),
    BrowserAnimationsModule
  ],
  providers: [
    SpinnerService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptorInterceptor,
        multi: true
    }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
