import {Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
  }
  
}
