import { Component, OnInit } from '@angular/core';
import { FAQ } from 'src/app/Model/faq';
import { FAQService } from '../services/faq.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: FAQ[] = [];
  showModal: boolean = false;
  editingFAQ: boolean = false;
  currentFAQ: FAQ = new FAQ();
  
  constructor(private faqService: FAQService, private router: Router) {}

  //When the page is called these methods are automatically called
  ngOnInit(): void {
    this.loadFAQs();
  }

  //retrieves all the information in the FAQ table from the database and stores it in the FAQ's array.
  loadFAQs(): void {
    this.faqService.getFAQs().subscribe({
      next: (data: FAQ[]) => this.faqs = data,
      error: (error: any) => console.error(error)
    });
  }

  isDuplicateFAQ(faq: FAQ): boolean {
    return this.faqs.some(item => item.question === faq.question && item.answer === faq.answer);
  }

  // The openAddFAQModal() function is called when the "Add FAQ" button is clicked, 
  //which opens a modal window for adding a new FAQ record.
  openAddFAQModal() {
    this.editingFAQ = false;
    this.currentFAQ = new FAQ();
    this.showModal = true;
  }

  //The openEditFAQModal() function is called when the user clicks the "Edit" button in the table. 
  //This function opens the modal window with the selected FAQ record's details and allows the user to edit the record.
  openEditFAQModal(id: number) {
    this.editingFAQ = true;
    this.currentFAQ = this.faqs.find(faq => faq.faqid === id)!;
    this.showModal = true;
  }
//The closeFAQModal() function is called when the user clicks the "Close" button in the modal window. 
//This function simply closes the modal window.
  closeFAQModal() {
    this.showModal = false;
  }

  //The submitFAQForm() function is called when the user submits the form in the modal window. This function saves the 
  //new or edited FAQ record to an array of FAQ records and closes the modal window.
  submitFAQForm(form: NgForm): void {
    if (form.valid) {
      if (this.editingFAQ) {


        // Update FAQ
        this.faqService.updateFAQ(this.currentFAQ.faqid!, this.currentFAQ).subscribe({
          next: () => {
            const index = this.faqs.findIndex(faq => faq.faqid === this.currentFAQ.faqid);
            if (index !== -1) {
              this.faqs[index] = this.currentFAQ;
            }
            this.closeFAQModal();
          },
          error: (error: any) => console.error(error)
        });
      } else {

        
        // Check for duplicate FAQ entries before adding
        if (this.isDuplicateFAQ(this.currentFAQ)) {
          alert('FAQ with the same question or answer already exists!');
        } else {
          this.faqService.addFAQ(this.currentFAQ).subscribe({
            next: (data: FAQ) => {
              this.faqs.push(data);
              this.closeFAQModal();
              form.resetForm();
            },
            error: (error: any) => console.error(error)
          });
        }
      }
    }
  }
  

  deleteFAQ(id: number): void {
    this.faqService.deleteFAQ(id).subscribe({
      next: () => this.faqs = this.faqs.filter(faq => faq.faqid !== id),
      error: (error: any) => console.error(error)
    });
  }
}