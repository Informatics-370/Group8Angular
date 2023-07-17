import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { ClientHomeComponent } from './client-home/client-home.component';
import { ClientEventsComponent } from './client-events/client-events.component';
import { ClientProductsComponent } from './client-products/client-products.component';
import { MyRefundsComponent } from './my-refunds/my-refunds.component';
import { OrdersComponent } from './orders/orders.component';
import { RefundRequestComponent } from './refund-request/refund-request.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UserInformationComponent } from './user-information/user-information.component';
import { UsernameAndPasswordComponent } from './username-and-password/username-and-password.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { CustomerFaqComponent } from './customer-faq/customer-faq.component';


const routes: Routes = [
  {path: 'clienthome', component: ClientHomeComponent},
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
  {path: 'customerfaq', component: CustomerFaqComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
