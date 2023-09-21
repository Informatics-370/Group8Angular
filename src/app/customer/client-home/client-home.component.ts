import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ScrollServiceService } from '../services/scroll-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { compileDeclareNgModuleFromMetadata } from '@angular/compiler';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css'],
    animations: [
      trigger('floatUp', [
        transition(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ])
      ])
    ]
})
export class ClientHomeComponent implements OnInit {

  @ViewChild('target') targetElement!: ElementRef;

  images = ['assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg'];

  //token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYXJpbmRhLmJsb2VtQHByb21lbmFkZS5jb20iLCJqdGkiOiI3NTExMTA5NS03NmY3LTQ5YjgtYjljMy1kYWQxNDdjN2RiZWUiLCJ1bmlxdWVfbmFtZSI6Ik1hcmluZGEiLCJyb2xlcyI6WyJTdXBlcnVzZXIiLCJDdXN0b21lciJdLCJleHAiOjE2ODk5MzU0OTMsImlzcyI6ImxvY2FsaG9zdCIsImF1ZCI6ImxvY2FsaG9zdCJ9.OGJ1EVWGUnV-OcVsRdmo1zFA9ENa1xYPB9QTkBA1LsA";
  decodedToken: any;
  userRole: string | undefined;
  email: string | undefined;
  userName: string | undefined;

//constructor(private scrollService: ScrollServiceService, private router: Router, private route: ActivatedRoute) { }
constructor(private activatedRoute: ActivatedRoute, private router: Router) {}  

ngOnInit() {
  // Check if the URL contains the fragment
  if (this.router.url.includes('#contact-section')) {
      this.scrollToFragment('contact-section');
  }

  // Continue to listen for route changes if you still want the behavior when navigating within the same page
  this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
      this.activatedRoute.fragment.subscribe(fragment => {
          if (fragment) {
              this.scrollToFragment(fragment);
          }
      });
  });
}

private scrollToFragment(fragment: string) {
  const element = document.getElementById(fragment);
  if (element) {
      element.scrollIntoView({behavior: "smooth"});
      setTimeout(() => {
        this.removeFragment();
      }, 1000);
  }
}


removeFragment(): void {
  if (this.router.url.includes('clienthome') && this.router.url.includes('#')) {
      this.router.navigate([this.router.url.split('#')[0]]);
  }
}

}
