import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageSize: number = 3; // Items per page

  @Input() pageSizeOptions: number[] = [3, 5, 10, 15, 20];

  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  constructor() {}

  previousPage() {
    if (this.currentPage > 1) {
      console.log('Emitting previous page:', this.currentPage - 1);
      this.pageChange.emit(this.currentPage - 1);
    }
  }
  

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSizeChange.emit(newSize);
  }
}
