import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { IBook, IOpenLibrarySearchBackendResult } from '../../shared/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '/books';
  private openLibraryApiUrl = '/openlibrary';

  constructor(private baseService: BaseService) { }

  searchOpenLibraryBooks(query: string): Observable<IOpenLibrarySearchBackendResult[]> {
    return this.baseService.get<IOpenLibrarySearchBackendResult[]>(
      `${this.openLibraryApiUrl}/search?q=${encodeURIComponent(query)}`
    );
  }

  getAllBooks(): Observable<IBook[]> {
    return this.baseService.get<IBook[]>(this.apiUrl);
  }

  searchBooksInDb(query: string): Observable<IBook[]> {
    return this.baseService.get<IBook[]>(`/books?q=${encodeURIComponent(query)}`);
  }

  getBookById(bookId: string): Observable<IBook> {
    return this.baseService.get<IBook>(`${this.apiUrl}/${bookId}`);
  }

  createBook(book: Partial<IBook>): Observable<IBook> {
    return this.baseService.post<IBook>(this.apiUrl, book);
  }

  updateBook(bookId: string, book: Partial<IBook>): Observable<IBook> {
    return this.baseService.put<IBook>(`${this.apiUrl}/${bookId}`, book);
  }

  deleteBook(bookId: string): Observable<{ message: string }> {
    return this.baseService.delete<{ message: string }>(`${this.apiUrl}/${bookId}`);
  }

}