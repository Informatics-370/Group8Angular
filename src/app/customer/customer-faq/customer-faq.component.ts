import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FAQ } from 'src/app/Model/faq'; // Adjust the import path to match your actual path
import { FAQService } from 'src/app/admin/services/faq.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-faq',
  templateUrl: './customer-faq.component.html',
  styleUrls: ['./customer-faq.component.css']
})
export class CustomerFaqComponent implements AfterViewInit {
  faqs: FAQ[] = [];
  shownAnswers = new Set<number>(); // Initialize an empty Set

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private faqService: FAQService, private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    this.setupAccordion();
    this.loadFAQs();
  }

  setupAccordion(): void {
    const items: HTMLButtonElement[] = this.elementRef.nativeElement.querySelectorAll('.accordion button');

    items.forEach(item => {
      this.renderer.listen(item, 'click', () => {
        const itemToggle = item.getAttribute('aria-expanded');
        
        items.forEach(otherItem => {
          this.renderer.setAttribute(otherItem, 'aria-expanded', 'false');
        });
        
        if (itemToggle === 'false') {
          this.renderer.setAttribute(item, 'aria-expanded', 'true');
        }
      });
    });
  }

  loadFAQs(): void {
    this.faqService.getFAQs().subscribe(
      (faqs: FAQ[]) => {
        this.faqs = faqs;
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Error, failed to connect to the database', 'FAQ Table');
      }
    );
  }

  isAnswerShown(index: number): boolean {
    return this.shownAnswers.has(index);
  }

  toggleAnswer(index: number): void {
    if (this.isAnswerShown(index)) {
      this.shownAnswers.delete(index);
    } else {
      this.shownAnswers.add(index);
    }
  }
}
