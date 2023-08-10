import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { UserViewModel } from 'src/app/Model/userviewmodel';

@Component({
  selector: 'app-customer-sidenav',
  templateUrl: './customer-sidenav.component.html',
  styleUrls: ['./customer-sidenav.component.css']
})
export class CustomerSidenavComponent {
  loggedOutUser: UserViewModel ={
    email: '',
    username: '',
    token: '',
    roles: []
  };
  showSidebar: boolean = true;

  constructor(private router: Router, private dataService: DataServiceService, private toastr: ToastrService) {}

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

  logOut(){
    this.dataService.LogOut().subscribe((result: any) => {
      if(result.token.tokenValue == ''){
        localStorage.removeItem("Token");
        this.dataService.login(this.loggedOutUser);
        this.toastr.success('Logged out successfully', 'Logout');
        this.router.navigate(['/clienthome']);
      }else{
        console.log("Logout failed, please try again later");
        this.toastr.error('Failed please try again', 'Logout')
      }
    });
  }

}
