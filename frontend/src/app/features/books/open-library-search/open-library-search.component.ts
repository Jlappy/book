import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { IBook, IOpenLibrarySearchBackendResult } from '../../../shared/models/book.model';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-open-library-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './open-library-search.component.html',
  styleUrls: ['./open-library-search.component.scss']
})
export class OpenLibrarySearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: IOpenLibrarySearchBackendResult[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Vui lòng nhập từ khóa tìm kiếm.';
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.searchResults = [];

    this.bookService.searchOpenLibraryBooks(this.searchQuery).pipe(
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Lỗi khi tìm kiếm sách OpenLibrary:', err);
        this.errorMessage = err.error?.message || 'Không thể tìm kiếm sách. Vui lòng thử lại.';
        return of([]);
      })
    ).subscribe(results => {
      this.searchResults = results;
      if (results.length === 0) {
        this.errorMessage = 'Không tìm thấy sách nào khớp với từ khóa của bạn.';
      }
    });
  }

  addBookToDatabase(olBook: IOpenLibrarySearchBackendResult): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const bookToAdd: IBook = {
      title: olBook.title,
      author: olBook.author || [],
      description: '',
      cover: olBook.cover,
      coverUrl: olBook.coverUrl,
      openLibraryId: olBook.openLibraryId,
      price: 9.99,
      first_publish_year: olBook.first_publish_year,
      source: 'openlibrary'
    };

    this.bookService.createBook(bookToAdd).pipe( // ✅ dùng createBook thay cho addBook
      finalize(() => this.isLoading = false),
      catchError(err => {
        console.error('Lỗi khi thêm sách vào DB:', err);
        this.errorMessage = err.error?.message || 'Không thể thêm sách vào thư viện. Vui lòng thử lại.';
        return of(null);
      })
    ).subscribe(addedBook => {
      if (addedBook) {
        this.successMessage = `Đã thêm sách "${addedBook.title}" vào thư viện thành công!`;
        this.searchResults = this.searchResults.filter(book => book.openLibraryId !== olBook.openLibraryId);
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
