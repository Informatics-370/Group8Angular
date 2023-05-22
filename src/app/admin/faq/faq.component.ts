import { Component, OnInit } from '@angular/core';
import { FAQ } from 'src/app/Model/faq';
import { FAQService } from '../services/faq.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  faqToDelete: any = null;
  faqToDeleteDetails: any;
  showDeleteFAQModal = false;
  
  constructor(private faqService: FAQService, private router: Router, private toastr: ToastrService) {}

  //When the page is called these methods are automatically called
  ngOnInit(): void {
    this.loadFAQs();
  }

  //retrieves all the information in the FAQ table from the database and stores it in the FAQ's array.
  loadFAQs(): void {
    this.faqService.getFAQs().subscribe({
      next: (data: FAQ[]) => this.faqs = data,
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error, please try again', 'VAT Table');
      }
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
    
    const originalFAQ = this.faqs.find(x => x.faqid === id);
    if (originalFAQ) {
      // Clone the original Customer Details object and assign it to currentBlacklistC
      this.currentFAQ = {...originalFAQ};
    }
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
            this.toastr.success('Successfully updated', 'Update');
          },
          error: (error: any) => {
            console.error(error)
            this.toastr.error('Error, please try again', 'Update');
          }
        });
      } else {

        
        // Check for duplicate FAQ entries before adding
        if (this.isDuplicateFAQ(this.currentFAQ)) {
          this.toastr.error('FAQ with the same question or answer already exists!');
        } else {
          this.faqService.addFAQ(this.currentFAQ).subscribe({
            next: (data: FAQ) => {
              this.faqs.push(data);
              this.closeFAQModal();
              form.resetForm();
              this.toastr.success('Successfully added', 'Add');
            },
            error: (error: any) => {
              console.error(error);
              this.toastr.error('Error, please try again', 'Add');
            }
          });
        }
      }
    }
  }
  


  openDeleteFAQModel(selectedSuppllier: any): void {
    this.faqToDelete = selectedSuppllier.supplierid;
    console.log("Supplier : ", this.faqToDelete)
    this.faqToDeleteDetails = selectedSuppllier;
    this.showDeleteFAQModal = true;
  }
  
  closeDeleteFAQModal(): void {
    this.showDeleteFAQModal = false;
  }

  deleteFAQ(id: number): void {
    this.faqService.deleteFAQ(id).subscribe({
      next: () => {
        this.faqs = this.faqs.filter(faq => faq.faqid !== id);
        this.toastr.success('Successfully deleted', 'Delete');
        this.showDeleteFAQModal = false;
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error('Error, please try again', 'Delete');
      }
    });
  }
}