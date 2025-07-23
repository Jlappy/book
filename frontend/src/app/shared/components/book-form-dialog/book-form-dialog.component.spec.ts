import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookFormDialogComponent } from './book-form-dialog.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BookForm } from '../../models/bookFormGroup.model';

describe('BookFormDialogComponent', () => {
  let component: BookFormDialogComponent;
  let fixture: ComponentFixture<BookFormDialogComponent>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<BookFormDialogComponent>>;

  const mockBook: BookForm = {
    _id: '1',
    title: 'Angular Basics',
    description: 'Learn Angular',
    cover: 123,
    coverUrl: 'http://example.com/img.jpg',
    author: ['John Doe'],
    openLibraryId: 'OL123M',
    price: 100,
    first_publish_year: 2020,
    source: 'manual',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        BookFormDialogComponent,
      ],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should set dialogTitle to "Thêm sách mới" if no data', () => {
  //   expect(component.dialogTitle).toBe('Thêm sách mới');
  // });

  // it('should close dialog with null on cancel', () => {
  //   component.onCancel();
  //   expect(dialogRefMock.close).toHaveBeenCalledWith(null);
  // });

  // it('should not close if form is invalid', () => {
  //   spyOn(component.bookForm, 'markAllAsTouched');
  //   component.onSave();
  //   expect(dialogRefMock.close).not.toHaveBeenCalled();
  //   expect(component.bookForm.markAllAsTouched).toHaveBeenCalled();
  // });

  // it('should close dialog with valid book data', () => {
  //   component.bookForm.setValue({
  //     title: 'Test Title',
  //     description: 'desc',
  //     cover: 0,
  //     coverUrl: '',
  //     author: 'Author A, Author B',
  //     openLibraryId: 'OL456',
  //     price: 50,
  //     first_publish_year: 2022,
  //     source: 'manual',
  //     createdAt: null,
  //   });

  //   component.onSave();
  //   expect(dialogRefMock.close).toHaveBeenCalledWith(jasmine.objectContaining({
  //     title: 'Test Title',
  //     author: ['Author A', 'Author B'],
  //   }));
  // });

  // it('should validate price minimum', () => {
  //   component.bookForm.patchValue({ price: -5 });
  //   expect(component.bookForm.get('price')?.hasError('min')).toBeTrue();
  // });

  // it('should validate first_publish_year max', () => {
  //   const nextYear = new Date().getFullYear() + 2;
  //   component.bookForm.patchValue({ first_publish_year: nextYear });
  //   expect(component.bookForm.get('first_publish_year')?.hasError('max')).toBeTrue();
  // });

  // it('should handle null or empty author as empty array', () => {
  //   component.bookForm.patchValue({ author: '' });
  //   component.onSave();
  //   const result = dialogRefMock.close.calls.mostRecent().args[0];
  //   expect(result.author).toEqual([]);
  // });
});
