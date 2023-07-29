import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  isAdmin = false;
  showCustomerSideNav = false;


  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // List of admin routes
        const adminRoutes = [
          '/wine',
          '/inventory',
          '/event',
          '/faq',
          '/supplier',
          '/report',
          '/blacklist',
          '/vat',
          '/employees',
          '/systemprivileges',
          '/varietal',
          '/type',
          '/discount',
          '/earlybird',
          '/eventtype',
          '/eventprice',
          '/superuser',
          '/customers',
          '/users',
          '/adminOrder',
          '/refunds',
          '/refundrequests',

        ];

        const custroutes = [
          '/userinformation',
          '/orders',
          '/tickets',
          '/myrefunds',
          '/refundrequest',
          '/wishlist',
          '/usernameandpassword',
          '/userrefunds'

        ]

        // Check if the new URL is part of the admin system
        this.isAdmin = adminRoutes.some(route => event.urlAfterRedirects.startsWith(route));

        // Check if the new URL is '/userinformation'
        this.showCustomerSideNav = custroutes.some(route => event.urlAfterRedirects.startsWith(route));

      }
    });
  }


  toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
  }
}
