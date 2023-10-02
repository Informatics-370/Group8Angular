import { Component } from '@angular/core';
import { BackupService } from '../services/backup.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css'],
})
export class BackupComponent {
  restoreModal: boolean = false;
  timerModal: boolean = false;
  selectedFileName: string | undefined;
  selectedUnit: 'first' | 'minutes' | 'hours' | 'days' = 'first';
  value = '';
  maxValues = {
    first: 0,
    minutes: 60,
    hours: 24,
    days: 14,
  };
  currentTimer: number = 0;
  constructor(
    private backupService: BackupService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(){
    this.getCurrentTimerFrequency();
  }

  goToPage4() {
    this.router.navigate(['/help/8']);
  }


  makeBackup() {
    this.backupService.createBackup().subscribe(
      (result: any) => {
        this.toastr.success('Creating a backup success', 'Backup Success');
      },
      (error) => {
        // This block will be executed for error responses (e.g., 400 Bad Request, 500 Internal Server Error)
        console.error(error);
        this.toastr.error('Creating a backup failed', 'Backup Failed');
      }
    );
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFileName = event.target.files[0].name;
      console.log(this.selectedFileName);
    }
  }

  restoreDatabase(form: NgForm) {
    this.toastr.info('Database restore in progress', 'Database restore');
    if (this.selectedFileName) {
      this.backupService.restoreBackup(this.selectedFileName).subscribe(
        (result: any) => {
          this.toastr.success('Database restore success', 'Database restore');
          this.restoreModal = false;
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Failed to restore database', 'Database restore');
          this.restoreModal = false;
        }
      );
    } else {
      // Handle the case when selectedFileName is undefined
      this.toastr.error('No file selected', 'Error');
      this.restoreModal = false;
    }
    form.resetForm(); // Reset the form after submission
  }

  openModal() {
    this.restoreModal = true;
  }

  closeModal() {
    this.restoreModal = false;
  }

  submitTimer() {
    let timerInMinutes = 0;
    let timerDev = 'Minute(s)';
    let toastValue = "";
    const inputValue = parseInt(this.value, 10);
    console.log(inputValue);

    switch (this.selectedUnit) {
      case 'minutes':
        timerInMinutes = inputValue;
        console.log("Minutes:", timerInMinutes);
        break;
      case 'hours':
        timerInMinutes = inputValue * 60;
        timerDev = "Hour(s)"
        console.log("Hours:", timerInMinutes);
        break;
      case 'days':
        console.log("Days:", timerInMinutes);
        timerDev = "Day(s)"
        timerInMinutes = inputValue * 1440; // 60 minutes * 24 hours
        break;
    }

    console.log("Final:", timerInMinutes);

    this.backupService.updateTimer(timerInMinutes).subscribe(response => {
      // Handle the response as needed
      console.log(response);
      if(timerDev == "Minute(s)"){
        toastValue = " " + timerInMinutes + " minute(s)";
      }else if(timerDev == "Hour(s)"){
        toastValue = " " + timerInMinutes/60 + " hour(s)";
      }else{
        toastValue = " " + timerInMinutes/1440 + " day(s)";
      }


      this.toastr.success(`Database backup frequency updated to every ${toastValue}`)
      this.getCurrentTimerFrequency();
      this.closeTimerModal();
    });
  }


  openTimerModal() {
    this.timerModal = true;
    this.selectedUnit = 'first';
    this.value = "";
  }

  closeTimerModal() {
    this.timerModal = false;
  }

  getCurrentTimerFrequency() {
    this.backupService.getTimer().subscribe((result: any) => {
      console.log(result);
      
      // Check if result is an array and has at least one element
      if (Array.isArray(result) && result.length > 0) {
        // Access the frequency property of the first object in the array
        this.currentTimer = result[0].frequency;
        this.maxValues = {
          first: result[0].frequency,
          minutes: 60,
          hours: 24,
          days: 14,
        };
        console.log(this.currentTimer);
      } else {
        console.error("Unexpected result format:", result);
      }
    });
  }
  
}
