import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../core/services/book.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { CartService } from '../../core/services/cart.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { IBook } from '../../shared/models/book.model';

describe('HomeComponent', () => { // Changed fdescribe to describe
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let mockBookService: jasmine.SpyObj<BookService>;
    let mockFavoriteService: jasmine.SpyObj<FavoriteService>;
    let mockCartService: jasmine.SpyObj<CartService>;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

    const mockBooks = [
        { _id: '1', title: 'Book 1', author: ['Author 1'], price: 10, description: 'Description 1', coverUrl: 'url1' },
        { _id: '2', title: 'Book 2', author: ['Author 2', 'author 5'], price: 15, description: 'Description 2', coverUrl: 'url2' },
        { _id: '3', title: 'Book 3', author: ['Author 3', 'author 5'], price: 20, description: 'Description 3', coverUrl: 'url3' },
    ] satisfies IBook[];


    const mockFavorites: string[] = ['1', '2'];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                BookCardComponent,
                MatPaginatorModule,
                NoopAnimationsModule,
                HomeComponent,
            ],
            providers: [
                {
                    provide: BookService,
                    useValue: jasmine.createSpyObj('BookService', ['getAllBooks'])
                },
                {
                    provide: FavoriteService,
                    useValue: jasmine.createSpyObj('FavoriteService', ['getFavorites', 'addFavorite', 'removeFavorite'])
                },
                {
                    provide: CartService,
                    useValue: jasmine.createSpyObj('CartService', ['addToCart'])
                },
                {
                    provide: MatSnackBar,
                    useValue: jasmine.createSpyObj('MatSnackBar', ['open'])
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;

        mockFavoriteService = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
        mockBookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        mockCartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
        mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    });

    it('should call loadInitialData via ngOnInit', fakeAsync(() => {
        spyOn(component, 'loadInitialData');
        fixture.detectChanges(); // sẽ trigger ngOnInit
        tick();
        expect(component.loadInitialData).toHaveBeenCalled();
    }));

    it('loading data - favorite + services', () => {
        mockBookService.getAllBooks.and.returnValue(of(mockBooks));
        mockFavoriteService.getFavorites.and.returnValue(of(mockFavorites));

        component.loadInitialData();

        expect(mockBookService.getAllBooks).toHaveBeenCalled();
        expect(mockFavoriteService.getFavorites).toHaveBeenCalled();
    });

    it('loading data - favorite + services with error', () => {
        mockBookService.getAllBooks.and.returnValue(throwError(() => new Error('Error loading books')));
        mockFavoriteService.getFavorites.and.returnValue(of(mockFavorites));

        component.loadInitialData();

        expect(component.errorMessage).toBe('Không thể tải sách.');
        expect(component.books.length).toBe(0);
    });

    it('paginate correctly', () => {
        component.books = [...mockBooks, ...mockBooks];
        component.pageSize = 2;

        component.currentPage = 1;
        component.paginate();
        expect(component.paginatedBooks).toEqual([mockBooks[0], mockBooks[1]]);

        component.currentPage = 2;
        component.paginate();
        expect(component.paginatedBooks).toEqual([mockBooks[2], mockBooks[0]]);

        component.currentPage = 3;
        component.paginate();
        expect(component.paginatedBooks).toEqual([mockBooks[1], mockBooks[2]]);
        expect(component.paginatedBooks.length).toBe(2);
    });

    it(' update page - on onPageChange', () => {
        spyOn(component, 'paginate');
        const event: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
        component.onPageChange(event);
        expect(component.currentPage).toBe(2);
        expect(component.pageSize).toBe(5);
        expect(component.paginate).toHaveBeenCalled();
    });

    it('true - book favorites', () => {
        component.favorites = ['book1', 'book2'];
        expect(component.isInFavorites('book1')).toBeTrue();
    });

    it('false - book favorites', () => {
        component.favorites = ['book1'];
        expect(component.isInFavorites('book2')).toBeFalse();
    });
    it('should show success snackbar when adding favorite succeeds', fakeAsync(() => {
  component.favorites = [];
  mockFavoriteService.addFavorite.and.returnValue(of({}));
  mockSnackBar.open.calls.reset();

  component.toggleFavorite('book1');
  tick();

  expect(mockSnackBar.open).toHaveBeenCalledWith(
    'Đã thêm vào danh sách yêu thích!',
    'Đóng',
    { duration: 3000, panelClass: ['snackbar-success'] }
  );
}));

});