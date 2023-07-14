import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {
  images = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg'];

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpbmRhLmJsb2VtQHByb21lbmFkZS5jb20iLCJqdGkiOiIwMTY1ZWMwMi00YWNhLTQ2MDQtODFhNC1mNGY1ZTgxYjYxZjIiLCJ1bmlxdWVfbmFtZSI6Ik1hcmluZGEiLCJyb2xlcyI6WyJTdXBlcnVzZXIiLCJDdXN0b21lciJdLCJleHAiOjE2ODk0NjMyMDEsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.cF8hLz97Hk3AtIG5One0NWYHKTXiehpfo4sLMa-KBVw";
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
   

    // Output the extracted information to the console
    console.log(this.userRole);
    console.log(this.email);
    
  }
}
