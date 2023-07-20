import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
  user: any; // Define a variable to hold the user data
  userDetails: any;
  constructor(private dataService: DataServiceService, private toastr: ToastrService, private router: Router) {}

  ngOnInit() {
    this.userDetails = this.dataService.getUserFromToken();
    this.loadUserData();
  }

  loadUserData() {
    const userEmail = this.userDetails?.email;

    if (userEmail != null) {
      this.dataService.getUser(userEmail).subscribe(
        (result: any) => {
          console.log(result);
          this.user = result.user; // Assign the user data to the variable
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load user data.');
          this.router.navigate(['/clienthome']); // Redirect to home or login page if error occurs
        }
      );
    }
  }
}
