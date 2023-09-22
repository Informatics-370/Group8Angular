import { Component } from '@angular/core';
import { DonationsService } from '../services/donations.service';
import jwt_decode from 'jwt-decode';
import { ChargeModel } from 'src/app/Model/ChargeModel';
import { ChargeResponseModel } from 'src/app/Model/ChargeResponseModel';
import { ToastRef, ToastrService } from 'ngx-toastr';

interface DecodedToken {
  sub: string;
}

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})


export class DonationsComponent {

  amount: number | null = null;
  email: string | null = null;
  hostedUrl: string | null = null;

  constructor(private donationService: DonationsService, private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    this.email = decodedToken.sub;
  }

  makeDonation(): void {
    if (this.amount === null || this.amount <= 0) {
      this.toastr.error('Please enter an amount greater than zero.');  // <-- Toastr error
      return;
    }
    const chargeData: ChargeModel = {
      name: this.email ?? 'Anonymous',
      description: 'Charity donation payment',
      pricing_type: 'fixed_price',
      local_price: {
        amount: this.amount ?? 0,
        currency: 'ZAR'
      }
    };

    this.donationService.createCharge(chargeData).subscribe(
      (response: ChargeResponseModel) => {
        console.log('Charge created:', response);
        if (response.hostedUrl) {
          // Redirect to the Coinbase's payment URL
          window.location.href = response.hostedUrl;
        }
      },
      error => {
        console.error('There was an error:', error);
      }
    );
  }
}
