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



const routes: Routes = [
  { path: '', redirectTo: '/wine', pathMatch: 'full' },
  { path: 'wine', component: WineComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'event', component: EventComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'report', component: ReportComponent },
  { path: 'blacklist', component: BlacklistComponent },
  { path: 'vat', component: VatComponent},
  { path: 'employees', component: EmployeeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
