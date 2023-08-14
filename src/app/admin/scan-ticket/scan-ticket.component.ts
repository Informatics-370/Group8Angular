import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment';

@Component({
  selector: 'app-scan-ticket',
  templateUrl: './scan-ticket.component.html',
  styleUrls: ['./scan-ticket.component.css']
})
export class ScanTicketComponent implements OnInit {
  token!: string | null;
  ticketStatus: 'scanned' | 'notScanned' | 'alreadyScanned' = 'notScanned';
  url!: string;  // Just declare the variable, initialization will be done in ngOnInit.

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');  
    console.log("Fetched token:", this.token);
    
    
    if (this.token) {
      this.url = `${environment.baseApiUrl}api/TicketPurchases/Scan/${this.token}`;  // Initialize the URL here

      this.http.post(this.url, {})
        .subscribe(
          (response: any) => {
            this.ticketStatus = 'scanned';
            this.toastr.success(response.message);
            console.log(this.token)
          },
          error => {
            if (error && error.error && error.error.message) {
              if (error.error.message.includes('already scanned')) {
                this.ticketStatus = 'alreadyScanned';
              } else {
                this.ticketStatus = 'notScanned';
              }
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('An unexpected error occurred.');
            }
          }
        );
    } else {
      this.toastr.error('Invalid ticket token.');
    }
  }
}
