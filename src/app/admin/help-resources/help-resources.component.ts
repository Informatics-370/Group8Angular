import { Component } from '@angular/core';
import { HelpResourcesService } from '../services/help-resources.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-help-resources',
  templateUrl: './help-resources.component.html',
  styleUrls: ['./help-resources.component.css']
})
export class HelpResourcesComponent {
  videoPath: SafeResourceUrl | undefined;
  pdfPath: SafeResourceUrl | undefined;
  videoId: string = 'HliyseRRMAE'; // Just the video ID

  constructor(private helpResourceService: HelpResourcesService, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }
  
  setPdfPath(page: number | null = null, query: string | null = null): void {
    let path = 'assets/Final_Help_Doc.pdf';
    if (page !== null) {
      path += `#page=${page}`;
    } else if (query !== null) {
      path += `#search=${query}`;
    } // 👈 Add this line
    this.pdfPath = this.sanitizer.bypassSecurityTrustResourceUrl(path);
     // Force reload iframe
  let iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.src = iframe.src;
  }
  }

  get pdfUrl() {
    console.log('Getting PDF Path:', this.pdfPath);  // 👈 Add this line
    return this.pdfPath;
  }

  ngOnInit(): void {
    this.loadHelp();
    this.videoPath = this.getVideoUrl();

    // Subscribe to route params once and set the PDF path
    this.route.params.subscribe(params => {
      const page = params['page'];
      if (page) {
        this.setPdfPath(page);
      } else {
        this.setPdfPath();
      }
    });
  }

  getVideoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoId}`);
  }

  loadHelp(): void {
    this.helpResourceService.getHelpPaths().subscribe(result => {
      console.log(result);
      if (result && result.length > 0) {
        this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(result[0].videoPath);
      }
    });
  }

  searchPdf(event: Event) {
    const element = event.target as HTMLInputElement;
    const query = element.value;
    this.setPdfPath(null, query);
  }
}
