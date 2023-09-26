import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataServiceService } from './customer/services/data-service.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { UserViewModel } from './Model/userviewmodel';
import { CartService } from './customer/services/cart.service';
import { timer } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from './customer/services/data-service.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  logoutTimer: any;
  isAccessRestricted = false;

  loggedOutUser: UserViewModel ={
    email: '',
    username: '',
    token: '',
    roles: []
  };
  isAdmin = false;
  showCustomerSideNav = false;
  lastActivityTimestamp = Date.now();

  ngOnInit(){
    this.checkAndSetLogoutTimer();
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    this.cartService.getCart(email).subscribe();
  }


  constructor( private cartService: CartService , private router: Router, private dataService: DataServiceService, private toastr: ToastrService) {
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
          '/refundrequest',
          '/writeoff',
          '/auditlogs',
          '/charts',
          '/help',
          'access-restricted',
          '/calendar'
        ];

        const custroutes = [
          '/userinformation',
          '/orders',
          '/tickets',
          '/myrefunds',
          '/wishlist',
          '/usernameandpassword',
          '/userrefunds',
          '/chatbot',

        ]

        // Check if the new URL is part of the admin system
        this.isAdmin = adminRoutes.some(route => event.urlAfterRedirects.startsWith(route));

        // Check if the new URL is '/userinformation'
        this.showCustomerSideNav = custroutes.some(route => event.urlAfterRedirects.startsWith(route));

        this.isAccessRestricted = event.urlAfterRedirects.startsWith('/access-restricted');
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
    // const storedExpiry = localStorage.getItem('TokenExpiration');
    let user = localStorage.getItem('Token');
    if (user) {
      var duration = 1800000 - (Date.now() - this.lastActivityTimestamp);
      if (duration > 0) {
        this.scheduleAutoLogout(duration);
      } else {
        this.dataService.LogOut();
      }
    }else{
      localStorage.removeItem('TokenExpiration');
    }
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  resetInactivityTimer(){
    this.lastActivityTimestamp = Date.now();
    var timeRemaining = 1800000 - (Date.now() - this.lastActivityTimestamp);
    localStorage.setItem('TokenExpiration', timeRemaining.toString());
    var loginToken = localStorage.getItem('Token');
    if(loginToken != ""){
      this.checkAndSetLogoutTimer(); // timeRemaining 1800000ms
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
