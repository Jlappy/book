import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { BookService } from '../../core/services/book.service';
import { BookFormDialogComponent } from '../../shared/components/book-form-dialog/book-form-dialog.component';
import { IBook } from '../../shared/models/book.model';
import { BookForm } from '../../shared/models/bookFormGroup.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'price', 'first_publish_year', 'actions'];
  dataSource = new MatTableDataSource<IBook>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => this.dataSource.data = books,
      error: (err) => console.error('Lỗi khi tải sách:', err)
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  trackById(index: number, book: IBook): string {
    return book._id ?? index.toString();
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: BookForm | null) => {
      if (result) {
        const newBook: Partial<IBook> = this.transformFormToBook(result);
        this.bookService.createBook(newBook).subscribe({
          next: () => this.loadBooks(),
          error: (err) => console.error('Lỗi khi thêm sách:', err)
        });
      }
    });
  }

  openEditBookDialog(book: IBook): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '500px',
      data: this.transformBookToForm(book)
    });

    dialogRef.afterClosed().subscribe((result: BookForm | null) => {
      if (result && result._id) {
        const updatedBook = this.transformFormToBook(result);
        this.bookService.updateBook(result._id, updatedBook).subscribe({
          next: () => this.loadBooks(),
          error: (err) => console.error('Lỗi khi cập nhật sách:', err)
        });
      }
    });
  }

  deleteBook(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error('Lỗi khi xóa sách:', err)
      });
    }
  }

  navigateToOpenLibrarySearch(): void {
    this.router.navigate(['/admin/openlibrary-search']);
  }

  private transformFormToBook(form: BookForm): Partial<IBook> {
    return {
      title: form.title || '',
      description: form.description || undefined,
      cover: form.cover || undefined,
      coverUrl: form.coverUrl || undefined,
      author: typeof form.author === 'string'
        ? form.author.split(',').map(s => s.trim()).filter(Boolean)
        : Array.isArray(form.author) ? form.author : [],
      openLibraryId: form.openLibraryId || undefined,
      price: form.price || 0,
      first_publish_year: form.first_publish_year || undefined,
      source: form.source || undefined,
      createdAt: form.createdAt || undefined
    };
  }

  private transformBookToForm(book: IBook): BookForm {
    return {
      _id: book._id,
      title: book.title,
      description: book.description,
      cover: book.cover,
      coverUrl: book.coverUrl,
      author: book.author?.join(', ') || '',
      openLibraryId: book.openLibraryId,
      price: book.price,
      first_publish_year: book.first_publish_year,
      source: book.source,
      createdAt: book.createdAt
    };
  }
}
