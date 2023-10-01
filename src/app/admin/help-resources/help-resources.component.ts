import { Component } from '@angular/core';
import { HelpResourcesService } from '../services/help-resources.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-help-resources',
  templateUrl: './help-resources.component.html',
  styleUrls: ['./help-resources.component.css']
})
export class HelpResourcesComponent {
  videoPath: SafeResourceUrl | undefined;
  pdfPath: SafeResourceUrl | undefined;
  videoId: string = 'HliyseRRMAE'; // Just the video ID

  constructor(private helpResourceService: HelpResourcesService, private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
    this.loadHelp();
    this.videoPath = this.getVideoUrl();
  }

  getVideoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoId}`);
  }

  loadHelp(): void {
    this.helpResourceService.getHelpPaths().subscribe(result => {
      console.log(result);
      if (result && result.length > 0) {
        this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(result[0].videoPath);
        this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(result[0].pdfPath);
      }
    });
  }
}
