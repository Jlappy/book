import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../core/services/book.service';
import { IBook } from '../../../shared/models/book.model';
import { MatDialog } from '@angular/material/dialog';
import { BookFormDialogComponent } from '../../../shared/components/book-form-dialog/book-form-dialog.component';

@Component({
  selector: 'app-book-manager',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule

  ],
  templateUrl: './book-manager.component.html',
  styleUrl: './book-manager.component.scss'
})
export class BookManagerComponent implements OnInit {
  displayedColumns = ['title', 'author', 'price', 'first_publish_year', 'actions'];
  dataSource: IBook[] = [];

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => this.dataSource = books,
      error: () => this.snackBar.open('Không thể tải sách', 'Đóng', { duration: 3000 })
    });
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  openEditBookDialog(book: IBook): void {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '400px',
      data: book
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBooks();
      }
    });
  }

  deleteBook(bookId?: string): void {
    if (!bookId) return;
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.snackBar.open('Đã xoá sách', 'Đóng', { duration: 3000 });
        this.loadBooks();
      },
      error: () => this.snackBar.open('Xoá thất bại', 'Đóng', { duration: 3000 })
    });
  }
}
