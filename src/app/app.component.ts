import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataServiceService } from './customer/services/data-service.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { UserViewModel } from './Model/userviewmodel';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  logoutTimer: any;
  loggedOutUser: UserViewModel ={
    email: '',
    username: '',
    token: '',
    roles: []
  };
  isAdmin = false;
  showCustomerSideNav = false;

  ngOnInit(){
    this.checkAndSetLogoutTimer();
  }


  constructor(private router: Router, private dataService: DataServiceService, private toastr: ToastrService) {
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
          '/writeoff',
          '/auditlogs',
          '/charts'
        ];

        const custroutes = [
          '/userinformation',
          '/orders',
          '/tickets',
          '/myrefunds',
          '/refundrequest',
          '/wishlist',
          '/usernameandpassword',
          '/userrefunds',
          '/chatbot'

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

  showChat = false;

  toggleChat() {
    this.showChat = !this.showChat;
  }

  checkAndSetLogoutTimer() {
    const storedExpiry = localStorage.getItem('TokenExpiration');
    if (storedExpiry) {
      const now = new Date().getTime();
      const duration = new Date(JSON.parse(storedExpiry)).getTime() - now;
      if (duration > 0) {
        this.scheduleAutoLogout(duration);
      } else {
        this.dataService.LogOut();
      }
    }
  }

  scheduleAutoLogout(duration: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = setTimeout(() => {
      this.dataService.LogOut().subscribe((result: any) => {
        if(result.token.tokenValue == '') {
          this.toastr.show('Please note, logout commencing', 'Logout');
          localStorage.removeItem("Token");
          this.dataService.login(this.loggedOutUser);
          localStorage.removeItem("TokenExpiration");
          this.router.navigate(['/clienthome']);
        } else {
          console.log("Logout failed, please try again later");
          this.toastr.error('Failed, please try again', 'Logout');
        }
      });
    }, duration);
  }
}
