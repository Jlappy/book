import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, FormsModule],
      providers:
        [
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: AuthService, useValue: authSpy },
          { provide: Router, useValue: routerMock },
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { queryParams: {} } }
          }
        ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should have invalid form if empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should show error if form invalid and submit clicked', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.handleLogin();
    expect(component.loginError).toBe('Vui lòng nhập đầy đủ email và mật khẩu hợp lệ.');
  });

  it('should call AuthService.login on valid form', () => {
    const mockUser = { message: 'Đăng nhập thành công', user: { email: 'a@mail.com', id: '123', role: 'user' as const } };
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.loginForm.setValue({ email: 'a@mail.com', password: '123456' });
    component.handleLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'a@mail.com', password: '123456' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error message when login fails with 401', () => {
    const errorResponse = { status: 401 };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.setValue({ email: 'fail@mail.com', password: 'wrongpass' });
    component.handleLogin();

    expect(component.loginError).toBe('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.');
  });

  it('should show generic error message if unknown error', () => {
    const errorResponse = { status: 500 };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.loginForm.setValue({ email: 'error@mail.com', password: '123456' });
    component.handleLogin();

    expect(component.loginError).toBe('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
  });

});
