import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataServiceService } from './customer/services/data-service.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private dataService: DataServiceService, 
        private router: Router, 
        private toastr: ToastrService) {}

canActivate(
route: ActivatedRouteSnapshot,
state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const viewportWidth = window.innerWidth;

    if (viewportWidth < 500) { // Adjust this value as per your need
      this.router.navigate(['/access-restricted']);
      return false;
    }

const roles = this.dataService.userValue?.roles;

if (roles && roles.some(role => ['Admin', 'Superuser', 'Employee'].includes(role))) {
return true;
}

// User not authorized, show toastr and remain on the same page
this.toastr.error('User needs to log in with the correct user roles to access Admin side', 'Unauthorized');
this.router.navigate(['/clienthome']);
return false;
}
  }