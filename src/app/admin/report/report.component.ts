import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  constructor(private toastr: ToastrService) { }

  showToastr(message: string) {
    this.toastr.info(`Haha, you thought... this ain't coded yet! :)`, message);
  }

  generateWriteOffReport(){
    
  }
}