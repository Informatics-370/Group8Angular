import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environment';
import { Event } from 'src/app/Model/event';
import { Observable, switchMap, throwError } from 'rxjs';
import { DataServiceService } from './data-service.service';
import { ToastrService } from 'ngx-toastr';
import { TicketPurchase } from 'src/app/Model/TicketPurchase';
import { WinePurchase } from 'src/app/Model/WinePurchase';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.baseApiUrl}api/Payment/CreatePayment`;
  private payfastUrl = 'https://sandbox.payfast.co.za/eng/process';
  httpClient: any;
  headers: any;

  constructor(private http: HttpClient, public dataService: DataServiceService, private toastr: ToastrService, private loginService: DataServiceService) { }

  initiatePayment(event: Event): Observable<any>{
    if (!this.dataService.userValue) {
      // If the user is not logged in, display an error message.
      this.toastr.error('Please login to make a payment.');
      return throwError('User is not logged in');
    }

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


  buyTicket(ticket: any): Observable<any> {
    // use the baseApiUrl from your environment
    const apiUrl = `${environment.baseApiUrl}api/Tickets`;

    return this.httpClient.post(apiUrl, ticket, {headers: this.headers});
}

  saveTicketPurchase(ticketPurchase: TicketPurchase) {
    // use the baseApiUrl from your environment
    const apiUrl = `${environment.baseApiUrl}api/TicketPurchases`;

    return this.http.post<TicketPurchase>(apiUrl, ticketPurchase);
}

getUserPurchases(userEmail: string): Observable<string[]> {
  const apiUrl = `${environment.baseApiUrl}api/TicketPurchases/User/${userEmail}`;

  return this.http.get<string[]>(apiUrl);
}

getPurchasedTickets(): Observable<TicketPurchase[]> {
  const userEmail = this.loginService.userValue?.email;
  if (!userEmail) {
    this.toastr.warning('Please log in to view purchased tickets.', 'Warning');
    return throwError('User is not logged in');
  }

  const apiUrl = `${environment.baseApiUrl}api/TicketPurchases/User/${userEmail}`;
  return this.http.get<TicketPurchase[]>(apiUrl);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// initiateWinePayment(winePurchase: WinePurchase): Observable<any>{
//   if (!this.dataService.userValue) {
//     this.toastr.error('Please login to make a payment.');
//     return throwError('User is not logged in');
//   }

//   const user = this.dataService.userValue;
//   if (user) {
//     return this.dataService.getUser(user.email).pipe(
//       switchMap((result: any) => {
//         const userDetails = result.user;
//         return this.http.post(this.apiUrl, {
//           amount: winePurchase.ticketPrice,
//           item_name: winePurchase.productName,
//           email_address: userDetails.email,
//           cell_number: userDetails.phoneNumber
//         });
//       })
//     );
//   } else {
//     return throwError('User details are not available');
//   }
// }

initiateWinePayment(winePurchase: WinePurchase): Observable<any> {
  if (!this.dataService.userValue) {
    // If the user is not logged in, display an error message.
    this.toastr.error('Please login to make a payment.');
    return throwError('User is not logged in');
  }

  // Fetch the user's email and phone number
  const user = this.dataService.userValue;
  if (user) {
    return this.dataService.getUser(user.email).pipe(
      switchMap((result: any) => {
        const userDetails = result.user;
        return this.http.post(this.apiUrl, {
          amount: winePurchase.ticketPrice,
          item_name: winePurchase.productName,
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

deletePurchasedTicket(ticketId: number): Observable<any> {
  const apiUrl = `${environment.baseApiUrl}api/TicketPurchases/CheckAndDelete/${ticketId}`;
  
  return this.http.delete(apiUrl);
}

scanTicket(token: string): Observable<any> {
  const apiUrl = `${environment.baseApiUrl}api/Tickets/Scan/${token}`;
  return this.http.post<any>(apiUrl, {});
}



}
