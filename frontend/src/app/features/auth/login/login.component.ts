import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  loginError: string | null = null;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      this.loginError = 'Vui lòng nhập đầy đủ email và mật khẩu hợp lệ.';
      return;
    }

    this.loginError = null;
    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        console.log('Đăng nhập thành công:', res);
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        console.error('Lỗi đăng nhập:', err);
        if (err.status === 401) {
          this.loginError = 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.';
        } else if (err.status === 403) {
          this.loginError = 'Bạn không có quyền truy cập.';
        } else if (err.error?.message) {
          this.loginError = err.error.message;
        } else {
          this.loginError = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        }
      }
    });
  }
}
