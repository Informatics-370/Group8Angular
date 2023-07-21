import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environment';
import { Event } from 'src/app/Model/event';
import { Observable, switchMap, throwError } from 'rxjs';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.baseApiUrl}api/Payment/CreatePayment`;
  private payfastUrl = 'https://www.payfast.co.za/eng/process';

  constructor(private http: HttpClient, public dataService: DataServiceService) { }

  initiatePayment(event: Event): Observable<any>{
    // Fetch the user's email and phone number
    const user = this.dataService.userValue;
    if (user) {
      return this.dataService.getUser(user.email).pipe(
        switchMap((result: any) => {
          const userDetails = result.user;
          return this.http.post(this.apiUrl, {
            amount: event.eventPrice,
            item_name: event.eventName,
            email_address: userDetails.email,
            cell_number: userDetails.phoneNumber // assuming the property name is phoneNumber
          });
        })
      );
    } else {
      // Handle the case where the user details are not available...
      // You need to return an Observable here too. For now, let's return an Observable that immediately errors.
      return throwError('User details are not available');
    }
  }
}
