import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: any[] = [];
  @Input() rows: any[] = [];
  @Input() pageSize = 5;

  @Output() view = new EventEmitter<any>();

  currentPage = 1;

  get paginatedRows() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  next() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prev() {
    if (this.currentPage > 1) this.currentPage--;
  }

  onView(row: any) {
    this.view.emit(row);
  }
}