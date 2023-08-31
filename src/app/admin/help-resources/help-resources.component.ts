import { Component } from '@angular/core';
import { HelpResourcesService } from '../services/help-resources.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-help-resources',
  templateUrl: './help-resources.component.html',
  styleUrls: ['./help-resources.component.css']
})
export class HelpResourcesComponent {
  videoPath: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  pdfPath: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

  constructor(private helpResourceService: HelpResourcesService, private sanitizer: DomSanitizer) { }
  
  ngOnInit(){
    this.loadHelp();
  }

  loadHelp(): void {
      this.helpResourceService.getHelpPaths().subscribe(result => {
        console.log(result);
        if (result && result.length > 0) {
          this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(result[0].videoPath);
          console.log(this.videoPath);
          this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(result[0].pdfPath);
        }
      });
  }
}
