import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookForm } from '../../models/bookFormGroup.model';
import { MatOption, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-book-form-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatOption,
    MatSelectModule
  ],
  templateUrl: './book-form-dialog.component.html',
  styleUrl: './book-form-dialog.component.scss'
})
export class BookFormDialogComponent implements OnInit {
  bookForm: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookForm | null
  ) {
    this.dialogTitle = data ? 'Sửa thông tin sách' : 'Thêm sách mới';
    this.bookForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || null],
      cover: [data?.cover || null],
      coverUrl: [data?.coverUrl || null],
      author: [
        (data && Array.isArray(data.author)) ? data.author.join(', ') : (data?.author === null ? null : (data?.author || '')),
        Validators.required
      ],
      openLibraryId: [data?.openLibraryId || null],
      price: [data?.price || null, [Validators.required, Validators.min(0)]],
      first_publish_year: [data?.first_publish_year || null, [Validators.min(1000), Validators.max(new Date().getFullYear() + 1)]],
      source: [data?.source || null],
      createdAt: [data?.createdAt || null],
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      const processedAuthor = typeof formValue.author === 'string'
        ? formValue.author.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : (Array.isArray(formValue.author) ? formValue.author : []);

      const resultBook: BookForm = {
        _id: this.data?._id,
        title: formValue.title || null,
        description: formValue.description || null,
        cover: formValue.cover || null,
        coverUrl: formValue.coverUrl || null,
        author: processedAuthor,
        openLibraryId: formValue.openLibraryId || null,
        price: formValue.price || null,
        first_publish_year: formValue.first_publish_year || null,
        source: formValue.source || null,
        createdAt: formValue.createdAt || null,
      };

      this.dialogRef.close(resultBook);
    } else {
      console.log('Form không hợp lệ:', this.bookForm);
      this.bookForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
