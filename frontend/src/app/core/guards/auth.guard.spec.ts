// src/app/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of, Subject, firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { IUser } from '../../shared/models/user.model';

describe('authGuard', () => {
  let authServiceMock: any;
  let routerMock: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let currentUserSubject: Subject<IUser | null>; // Khai báo Subject ở đây

  beforeEach(() => {
    // Khởi tạo Subject mới cho mỗi test case
    currentUserSubject = new Subject<IUser | null>();

    // 1. Tạo Mock cho AuthService
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      isAuthChecked$: of(true), // Luôn giả lập là việc kiểm tra xác thực đã hoàn tất
      currentUser$: currentUserSubject.asObservable() // Gán Subject cho currentUser$
    });

    // 2. Tạo Mock cho Router
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerMock.createUrlTree.and.returnValue(new UrlTree()); // Trả về một UrlTree giả

    // 3. Khởi tạo TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    route = {} as ActivatedRouteSnapshot;
    state = { url: '/protected' } as RouterStateSnapshot;
  });

  // --- Test Cases ---

  it('should allow navigation if user is authenticated', async () => {
    // Bắt đầu gọi guard. Lúc này guard đã subscribe vào currentUserSubject.
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => authGuard(route, state)) as any);

    // Bây giờ, phát ra giá trị user và complete Subject
    currentUserSubject.next({ id: '123', email: 'test@example.com', role: 'user' } as IUser);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not authenticated', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => authGuard(route, state)) as any);

    // Phát ra null (không có user) và complete Subject
    currentUserSubject.next(null);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeInstanceOf(UrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: state.url } });
  });

  it('should wait for isAuthChecked$ to complete before checking current user', async () => {
    let isAuthCheckedSubject = new Subject<boolean>();
    authServiceMock.isAuthChecked$ = isAuthCheckedSubject.asObservable(); // Ghi đè isAuthChecked$ cho test này

    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => authGuard(route, state)) as any);

    // Phát ra giá trị user cho currentUserSubject (nó sẽ được xử lý sau isAuthChecked$)
    currentUserSubject.next({ id: '123', email: 'test@example.com', role: 'user' } as IUser);
    currentUserSubject.complete(); // Quan trọng: complete Subject

    // Kích hoạt isAuthCheckedSubject để guard tiếp tục
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should handle multiple emissions from currentUser$ but only take the first', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => authGuard(route, state)) as any);

    // Phát ra null trước (đây là giá trị take(1) sẽ lấy), sau đó là user
    currentUserSubject.next(null);
    currentUserSubject.next({ id: '123', email: 'test@example.com', role: 'user' } as IUser);
    currentUserSubject.complete(); // Quan trọng: complete Subject

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeInstanceOf(UrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalled();
  });

});