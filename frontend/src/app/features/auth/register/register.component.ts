import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  handleRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.registerError = 'Vui lòng nhập đầy đủ thông tin hợp lệ.';
      return;
    }

    this.registerError = null;

    const { email, password, role } = this.registerForm.value;

    this.auth.register({ email, password, role }).subscribe({
      next: (res) => {
        console.log('Đăng ký thành công:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Lỗi đăng ký:', err);

        if (err.status === 400 && err.error?.message === 'Email đã tồn tại') {
          this.registerError = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
        } else if (err.error?.message) {
          this.registerError = err.error.message;
        } else {
          this.registerError = 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.';
        }
      }
    });
  }
}

