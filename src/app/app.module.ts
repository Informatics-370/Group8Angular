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
import { HttpClientModule } from '@angular/common/http';
import { SystemprivilegesComponent } from './admin/systemprivileges/systemprivileges.component';
import { EmployeeComponent } from './admin/employee/employee.component';

import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarietalComponent } from './admin/varietal/varietal.component';
import { TypeComponent } from './admin/type/type.component';
import { DiscountComponent } from './admin/discount/discount.component';
import { EarlyBirdComponent } from './admin/early-bird/early-bird.component';
import { EventTypeComponent } from './admin/event-type/event-type.component';
import { EventPriceComponent } from './admin/event-price/event-price.component';


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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
