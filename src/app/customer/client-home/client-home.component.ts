import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css'],
    animations: [
      trigger('floatUp', [
        transition(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ])
      ])
    ]
})
export class ClientHomeComponent implements OnInit {
  images = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg'];

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpbmRhLmJsb2VtQHByb21lbmFkZS5jb20iLCJqdGkiOiI3NTExMTA5NS03NmY3LTQ5YjgtYjljMy1kYWQxNDdjN2RiZWUiLCJ1bmlxdWVfbmFtZSI6Ik1hcmluZGEiLCJyb2xlcyI6WyJTdXBlcnVzZXIiLCJDdXN0b21lciJdLCJleHAiOjE2ODk5MzU0OTMsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.OGJ1EVWGUnV-OcVsRdmo1zFA9ENa1xYPB9QTkBA1LsA";
  decodedToken: any;
  userRole: string | undefined;
  email: string | undefined;
  userName: string | undefined;


  ngOnInit() {
    // Decode the JWT token
    this.decodedToken = jwt_decode(this.token);

    // Extract user information from the decoded token
    this.email = this.decodedToken.sub; // Assuming the email claim is named 'sub'
    this.userRole = this.decodedToken.roles;
    this.userName = this.decodedToken.unique_name;
   
    // Output the extracted information to the console
    console.log(this.userRole);
    console.log(this.email);
    console.log(this.userName);
    
  }
  
}
