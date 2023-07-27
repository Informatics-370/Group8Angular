import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/Model/order';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../services/data-service.service';
import { ToastrService } from 'ngx-toastr';
import { WineService } from 'src/app/admin/services/wine.service';
import { Wine } from 'src/app/Model/wine';

@Component({
  selector: 'app-order-history',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  wines: Wine[] = [];

  constructor(private orderService: OrderService, private toastr: ToastrService, private wineService : WineService) { }

  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('Token') || '';
    let decodedToken = jwt_decode(token) as DecodedToken;
    let email = decodedToken.sub;
    await this.loadOrders(email);
    await this.loadWines();
  }

  async loadOrders(email: string): Promise<void> {
    try {
      this.orders = await this.orderService.getOrdersForUser(email).toPromise() || [];
    } catch (error) {
      console.error('Error:', error);
      this.toastr.error('Could not load order history.', 'Error');
    }
  }
  

  async loadWines(): Promise<void> {
    try {
      this.wines = await this.wineService.getWines();
    } catch (error) {
      console.error('Error:', error);
      this.toastr.error('Could not load wines.', 'Error');
    }
  }

  getWineName(wineId: number): string {
    const wine = this.wines.find(w => w.wineID === wineId);
    return wine ? wine.name : 'Unknown';
  }
}