import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-customer-sidenav',
  templateUrl: './customer-sidenav.component.html',
  styleUrls: ['./customer-sidenav.component.css']
})
export class CustomerSidenavComponent {

  showSidebar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // List of routes where the sidenav should be visible
        const sidenavRoutes = [
          '/userinformation',
          '/orders',
          '/myrefunds',
          '/tickets',
          '/usernameandpassword',
          '/wishlist',
          '/refundrequest',
        ];
    
        // Check if the new URL is part of the sidenav routes
        this.showSidebar = sidenavRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });
  }

}
