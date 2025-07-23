import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { BookService } from '../../core/services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    bookServiceSpy = jasmine.createSpyObj('BookService',
      ['getAllBooks', 'createBook', 'updateBook', 'deleteBook']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatTableModule, MatPaginatorModule, MatSortModule, AdminDashboardComponent],
      declarations: [],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('dash-board đã chạy', () => {
    expect(component).toBeTruthy();
  });

  it('oninit - get books', () => {
    const books = [{ _id: '1', title: 'Book1', author: ['Author1'], price: 10 }];
    bookServiceSpy.getAllBooks.and.returnValue(of(books));
    component.ngOnInit();
    expect(bookServiceSpy.getAllBooks).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(books);
  });

  it('kiểm tra lỗi khi get book', () => {
    const consoleSpy = spyOn(console, 'error');
    bookServiceSpy.getAllBooks.and.returnValue(throwError(() => new Error('test-error')));
    component.loadBooks();
    expect(consoleSpy).toHaveBeenCalledWith('Lỗi khi tải sách:', jasmine.any(Error));
  });

  it('lọc sách', () => {
    const event = { target: { value: 'Angular' } } as any as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('angular');
  });

  it('tìm sách theo id', () => {
    const book = { _id: '123', title: '', author: [], price: 0 };
    expect(component.trackById(0, book)).toBe('123');
    expect(component.trackById(5, {} as any)).toBe('5');
  });

  it('mở dialog và thêm sách', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ title: 'New', author: 'A', price: 1 }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    bookServiceSpy.createBook.and.returnValue(of(dialogRefSpyObj));
    spyOn(component, 'loadBooks');

    component.openAddBookDialog();
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(bookServiceSpy.createBook).toHaveBeenCalled();
    expect(component.loadBooks).toHaveBeenCalled();
  }));

  it('mở dialog và chỉnh sửa sách', fakeAsync(() => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ _id: '123', title: 'Edit', author: 'A', price: 1 }) });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);
    bookServiceSpy.updateBook.and.returnValue(of(dialogRefSpyObj));
    spyOn(component, 'loadBooks');

    component.openEditBookDialog({ _id: '123', title: 'Book', author: ['A'], price: 1 } as any);
    tick();

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(bookServiceSpy.updateBook).toHaveBeenCalledWith('123', jasmine.any(Object));
    expect(component.loadBooks).toHaveBeenCalled();
  }));

  it('nhấn đồng ý xóa sách', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    bookServiceSpy.deleteBook.and.returnValue(of({ message: 'Xóa thành công' }));
    spyOn(component, 'loadBooks');

    component.deleteBook('1');
    expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith('1');
    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('nhấn không đồng ý xóa sách', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteBook('1');
    expect(bookServiceSpy.deleteBook).not.toHaveBeenCalled();
  });

  it('chuyển qua tìm kiếm openlibrary', () => {
    component.navigateToOpenLibrarySearch();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/openlibrary-search']);
  });

  it('data form thành book - thêm sách', () => {
    const form = { title: 'T', author: 'A,B', price: 1 } as any;
    const result = component['transformFormToBook'](form);
    expect(result.author).toEqual(['A', 'B']);
    expect(result.title).toBe('T');
  });

  it('data book thành form - sửa sách', () => {
    const book = { _id: '1', title: 'T', author: ['A', 'B'], price: 1 } as any;
    const result = component['transformBookToForm'](book);
    expect(result.author).toBe('A, B');
    expect(result.title).toBe('T');
    expect(result._id).toBe('1');
  });
});