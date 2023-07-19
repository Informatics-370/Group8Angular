import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {
  images = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg'];

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtY2xhcmVubWFyY285OThAZ21haWwuY29tIiwianRpIjoiYmRmODVjN2YtYWZkYi00OTczLTk4NTktYTViYzkyOGZmNDZhIiwidW5pcXVlX25hbWUiOiJNYXJjbyIsInJvbGVzIjoiQ3VzdG9tZXIiLCJleHAiOjE2ODk4NjQ4NDIsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.6ph8NX99myRHXhw9XlV6Q6tZNdk6I0aAuFM9IonExzY";
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
