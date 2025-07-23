// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { BookDetailComponent } from './book-detail.component';
// import { ActivatedRoute } from '@angular/router';
// import { BookService } from '../../core/services/book.service';
// import { CartService } from '../../core/services/cart.service';
// import { FavoriteService } from '../../core/services/favorite.service';
// import { AuthService } from '../../core/services/auth.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { of, throwError } from 'rxjs';
// import { IUser } from '../../shared/models/user.model';
// import { IBook } from '../../shared/models/book.model';

// fdescribe('BookDetailComponent', () => {
//   let component: BookDetailComponent;
//   let fixture: ComponentFixture<BookDetailComponent>;
//   let activatedRouteSpy: any;
//   let bookServiceSpy: jasmine.SpyObj<BookService>;
//   let cartServiceSpy: jasmine.SpyObj<CartService>;
//   let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

//   beforeEach(async () => {
//     activatedRouteSpy = {
//       paramMap: of({ get: (key: string) => key === 'id' ? 'book123' : null })
//     };

//     bookServiceSpy = jasmine.createSpyObj('BookService', ['getBookById']);
//     cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
//     favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', ['getFavorites', 'addFavorite', 'removeFavorite']);
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserValue']);
//     snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

//     bookServiceSpy.getBookById.and.returnValue(of({ _id: 'book123', title: 'Book', price: 10 } as IBook));
//     favoriteServiceSpy.getFavorites.and.returnValue(of(['book123', 'other']));
//     authServiceSpy.getCurrentUserValue.and.returnValue({ role: 'user' } as IUser);

//     await TestBed.configureTestingModule({
//       imports: [BookDetailComponent],
//       providers: [
//         { provide: ActivatedRoute, useValue: activatedRouteSpy },
//         { provide: BookService, useValue: bookServiceSpy },
//         { provide: CartService, useValue: cartServiceSpy },
//         { provide: FavoriteService, useValue: favoriteServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy },
//         { provide: MatSnackBar, useValue: snackBarSpy }
//       ]
//     }).compileComponents();
//   });

//   function createComponent() {
//     fixture = TestBed.createComponent(BookDetailComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }

//   fit('should create', fakeAsync(() => {
//     createComponent();
//     tick();
//     expect(component).toBeTruthy();
//   }));

//   // ... các test khác giữ nguyên

//   fit('should remove favorite and show success snackbar', fakeAsync(() => {
//     createComponent();
//     component.favorites = ['book123'];
//     favoriteServiceSpy.removeFavorite.and.returnValue(of(null));

//     component.toggleFavorite('book123');
//     tick();

//     expect(favoriteServiceSpy.removeFavorite).toHaveBeenCalledWith('book123');
//     expect(component.favorites).toEqual([]);
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'Đã xóa khỏi yêu thích!', 'Đóng',
//       { duration: 3000, panelClass: ['snackbar-success'] }
//     );
//   }));

//   fit('should show error snackbar when removeFavorite fails', fakeAsync(() => {
//     createComponent();
//     component.favorites = ['book123'];
//     favoriteServiceSpy.removeFavorite.and.returnValue(throwError(() => ({ error: { message: 'err' } })));

//     component.toggleFavorite('book123');
//     tick();

//     expect(favoriteServiceSpy.removeFavorite).toHaveBeenCalledWith('book123');
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'err', 'Đóng',
//       { duration: 5000, panelClass: ['snackbar-error'] }
//     );
//   }));

//   fit('should add favorite and show success snackbar', fakeAsync(() => {
//     createComponent();
//     component.favorites = [];
//     favoriteServiceSpy.addFavorite.and.returnValue(of(null));

//     component.toggleFavorite('book123');
//     tick();

//     expect(favoriteServiceSpy.addFavorite).toHaveBeenCalledWith('book123');
//     expect(component.favorites).toContain('book123');
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'Đã thêm vào yêu thích!', 'Đóng',
//       { duration: 3000, panelClass: ['snackbar-success'] }
//     );
//   }));

//   fit('should show error snackbar when addFavorite fails', fakeAsync(() => {
//     createComponent();
//     component.favorites = [];
//     favoriteServiceSpy.addFavorite.and.returnValue(throwError(() => ({ error: { message: 'err' } })));

//     component.toggleFavorite('book123');
//     tick();

//     expect(favoriteServiceSpy.addFavorite).toHaveBeenCalledWith('book123');
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'err', 'Đóng',
//       { duration: 5000, panelClass: ['snackbar-error'] }
//     );
//   }));

//   fit('should add to cart and show success snackbar', fakeAsync(() => {
//     createComponent();
//     cartServiceSpy.addToCart.and.returnValue(of(null as any));

//     component.addToCart('book123');
//     tick();

//     expect(cartServiceSpy.addToCart).toHaveBeenCalledWith('book123', 1);
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'Đã thêm vào giỏ hàng!', 'Đóng',
//       { duration: 3000, panelClass: ['snackbar-success'] }
//     );
//   }));

//   fit('should show error snackbar when addToCart fails', fakeAsync(() => {
//     createComponent();
//     cartServiceSpy.addToCart.and.returnValue(throwError(() => ({ error: { message: 'err' } })));

//     component.addToCart('book123');
//     tick();

//     expect(cartServiceSpy.addToCart).toHaveBeenCalledWith('book123', 1);
//     expect(snackBarSpy.open).toHaveBeenCalledWith(
//       'err', 'Đóng',
//       { duration: 5000, panelClass: ['snackbar-error'] }
//     );
//   }));
// });