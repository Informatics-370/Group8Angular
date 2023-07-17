import { Component } from '@angular/core';
import { FAQ } from 'src/app/Model/faq';
import { FAQService } from 'src/app/admin/services/faq.service';

@Component({
  selector: 'app-customer-faq',
  templateUrl: './customer-faq.component.html',
  styleUrls: ['./customer-faq.component.css']
})
export class CustomerFaqComponent {
  faqs: FAQ[] = [];

  constructor(private faqService: FAQService) { }

  ngOnInit(): void {
    this.loadFAQs();
  }

  loadFAQs(): void {
    this.faqService.getFAQs().subscribe(
      (faqs: FAQ[]) => {
        this.faqs = faqs;
      },
      (error: any) => {
        console.error(error);
        // Handle error if necessary
      }
    );
  }
}
