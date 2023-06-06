import { Component } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  
  loading: boolean | undefined;

  constructor(private spinnerService: SpinnerService) {
      this.spinnerService.isLoading.subscribe((v) => {
          this.loading = v;
      });
  }
}
