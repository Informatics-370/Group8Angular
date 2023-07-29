import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        overflow: 'auto'
      })),
      transition('closed <=> open', animate('2000ms ease-in-out'))
    ])
  ]
})
export class SidenavComponent {
  showWineSubnav: boolean = false;
  showEventSubnav = false;
  showEmpSubnav = false;
  showSupplierSubnav = false;
  showRefundSubnav = false;

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDropdown(): void {
    this.showWineSubnav = !this.showWineSubnav;
  }

}
