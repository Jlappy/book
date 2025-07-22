// src/app/core/services/book.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { BaseService } from './base.service';
import { of, throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Import catchError operator

import { IBook, IOpenLibrarySearchBackendResult } from '../../shared/models/book.model';

describe('BookService', () => {
    let bookService: BookService;
    let baseServiceMock: jasmine.SpyObj<BaseService>;

    // Mock data - Updated to match IBook interface
    const mockBooks: IBook[] = [
        { _id: '1', title: 'Book One', author: ['Author A'], price: 10.99, source: 'manual' },
        { _id: '2', title: 'Book Two', author: ['Author B'], price: 15.50, source: 'manual' }
    ];

    // Mock Open Library Results - Updated to match IOpenLibrarySearchBackendResult interface
    const mockOpenLibraryResults: IOpenLibrarySearchBackendResult[] = [
        { openLibraryId: 'OL12345W', title: 'Open Book 1', author: ['OL Author A'], first_publish_year: 1990, isbn: '11111', cover: 123, coverUrl: 'http://example.com/cover1.jpg' },
        { openLibraryId: 'OL67890W', title: 'Open Book 2', author: ['OL Author B'], first_publish_year: 2005, isbn: '22222', cover: 456, coverUrl: 'http://example.com/cover2.jpg' }
    ];

    const newBook: Partial<IBook> = { title: 'New Book', author: ['New Author'], price: 20.00, source: 'manual' };
    const createdBook: IBook = { _id: '3', ...newBook } as IBook; // Changed id to _id

    const updatedBookData: Partial<IBook> = { title: 'Updated Book Title', price: 12.00 }; // Added price to update
    const updatedBook: IBook = { ...mockBooks[0], title: 'Updated Book Title', price: 12.00 }; // Updated price

    const deleteMessage = { message: 'Book deleted successfully' };

    beforeEach(() => {
        // Create a spy object for BaseService
        baseServiceMock = jasmine.createSpyObj('BaseService', ['get', 'post', 'put', 'delete']);

        TestBed.configureTestingModule({
            providers: [
                BookService,
                { provide: BaseService, useValue: baseServiceMock }
            ]
        });

        bookService = TestBed.inject(BookService);
    });

    // Test searchOpenLibraryBooks method
    it('should call baseService.get with the correct URL for searchOpenLibraryBooks', async () => {
        const query = 'Lord of the Rings';
        const encodedQuery = encodeURIComponent(query);
        // Note: openLibraryApiUrl is a private property in BookService, so we access it with bracket notation.
        const expectedUrl = `${bookService['openLibraryApiUrl']}/search?q=${encodedQuery}`;
        baseServiceMock.get.and.returnValue(of(mockOpenLibraryResults));

        const result = await firstValueFrom(bookService.searchOpenLibraryBooks(query));

        // The get method in BaseService expects a path, not a full URL for openLibrary.
        // BookService constructs the full path with /openlibrary prefix.
        const expectedPathForBaseService = `${bookService['openLibraryApiUrl']}/search?q=${encodedQuery}`;
        expect(baseServiceMock.get).toHaveBeenCalledWith(expectedPathForBaseService);
        expect(result).toEqual(mockOpenLibraryResults);
    });

    // Test getAllBooks method
    it('should call baseService.get with the correct URL for getAllBooks', async () => {
        const expectedUrl = bookService['apiUrl'];
        baseServiceMock.get.and.returnValue(of(mockBooks));

        const result = await firstValueFrom(bookService.getAllBooks());

        expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
        expect(result).toEqual(mockBooks);
    });

    // Test getBookById method
    it('should call baseService.get with the correct URL for getBookById', async () => {
        const bookId = '1';
        const expectedUrl = `${bookService['apiUrl']}/${bookId}`;
        baseServiceMock.get.and.returnValue(of(mockBooks[0]));

        const result = await firstValueFrom(bookService.getBookById(bookId));

        expect(baseServiceMock.get).toHaveBeenCalledWith(expectedUrl);
        expect(result).toEqual(mockBooks[0]);
    });

    // Test createBook method
    it('should call baseService.post with the correct URL and body for createBook', async () => {
        const expectedUrl = bookService['apiUrl'];
        baseServiceMock.post.and.returnValue(of(createdBook));

        const result = await firstValueFrom(bookService.createBook(newBook));

        expect(baseServiceMock.post).toHaveBeenCalledWith(expectedUrl, newBook);
        expect(result).toEqual(createdBook);
    });

    // Test updateBook method
    it('should call baseService.put with the correct URL and body for updateBook', async () => {
        const bookId = '1';
        const expectedUrl = `${bookService['apiUrl']}/${bookId}`;
        baseServiceMock.put.and.returnValue(of(updatedBook));

        const result = await firstValueFrom(bookService.updateBook(bookId, updatedBookData));

        expect(baseServiceMock.put).toHaveBeenCalledWith(expectedUrl, updatedBookData);
        expect(result).toEqual(updatedBook);
    });

    // Test deleteBook method
    it('should call baseService.delete with the correct URL for deleteBook', async () => {
        const bookId = '1';
        const expectedUrl = `${bookService['apiUrl']}/${bookId}`;
        baseServiceMock.delete.and.returnValue(of(deleteMessage));

        const result = await firstValueFrom(bookService.deleteBook(bookId));

        expect(baseServiceMock.delete).toHaveBeenCalledWith(expectedUrl);
        expect(result).toEqual(deleteMessage);
    });

    // Example of testing error handling for a method (e.g., getAllBooks)
    it('should handle errors for getAllBooks', async () => {
        const errorResponse = new Error('Network error');
        baseServiceMock.get.and.returnValue(throwError(() => errorResponse));

        await firstValueFrom(bookService.getAllBooks().pipe(
            catchError(err => {
                expect(err).toEqual(errorResponse);
                return of([]); // Return an empty array or re-throw if you want the error to propagate
            })
        ));

        expect(baseServiceMock.get).toHaveBeenCalledWith(bookService['apiUrl']);
    });
});
