// src/app/guards/admin.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of, Subject, firstValueFrom } from 'rxjs';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { IUser } from '../../shared/models/user.model'; // Đảm bảo đường dẫn đúng tới IUser

describe('adminGuard', () => {
  let authServiceMock: any;
  let routerMock: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let isAuthCheckedSubject: Subject<boolean>; // Subject để kiểm soát isAuthChecked$
  let currentUserSubject: Subject<IUser | null>; // Subject để kiểm soát currentUser$

  beforeEach(() => {
    // Khởi tạo các Subject mới cho mỗi test case để đảm bảo tính độc lập
    isAuthCheckedSubject = new Subject<boolean>();
    currentUserSubject = new Subject<IUser | null>();

    // 1. Tạo Mock cho AuthService
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      isAuthChecked$: isAuthCheckedSubject.asObservable(),
      currentUser$: currentUserSubject.asObservable()
    });

    // 2. Tạo Mock cho Router
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);
    // Giả lập createUrlTree trả về một UrlTree object để khớp với kiểu trả về thực tế
    routerMock.createUrlTree.and.returnValue(new UrlTree());

    // 3. Khởi tạo TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    // Khởi tạo các snapshot
    route = {} as ActivatedRouteSnapshot;
    state = { url: '/admin-dashboard' } as RouterStateSnapshot; // URL giả định cho admin route
  });

  // --- Test Cases ---

  it('should redirect to login if user is not authenticated', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => adminGuard(route, state)) as any);

    // Phát ra tín hiệu isAuthChecked đã hoàn tất
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Phát ra null cho currentUser (chưa đăng nhập)
    currentUserSubject.next(null);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeInstanceOf(UrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: state.url } });
  });

  it('should redirect to unauthorized if user is authenticated but not admin', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => adminGuard(route, state)) as any);

    // Phát ra tín hiệu isAuthChecked đã hoàn tất
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Phát ra user với role là 'user'
    currentUserSubject.next({ id: '1', email: 'user@example.com', role: 'user' } as IUser);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeInstanceOf(UrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
    expect(routerMock.createUrlTree).not.toHaveBeenCalledWith(['/login'], jasmine.any(Object)); // Đảm bảo không chuyển hướng đến login
  });

  it('should allow navigation if user is authenticated and is admin', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => adminGuard(route, state)) as any);

    // Phát ra tín hiệu isAuthChecked đã hoàn tất
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Phát ra user với role là 'admin'
    currentUserSubject.next({ id: '1', email: 'admin@example.com', role: 'admin' } as IUser);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled(); // Đảm bảo không có chuyển hướng nào xảy ra
  });

  it('should wait for isAuthChecked$ to complete before checking current user', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => adminGuard(route, state)) as any);

    // Kích hoạt isAuthCheckedSubject để guard tiếp tục
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Bây giờ phát ra user admin (sau khi isAuthChecked$ đã hoàn thành)
    currentUserSubject.next({ id: '1', email: 'admin@example.com', role: 'admin' } as IUser);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should handle multiple emissions from currentUser$ but only take the first (after isAuthChecked$)', async () => {
    // Bắt đầu gọi guard
    const guardPromise = firstValueFrom(TestBed.runInInjectionContext(() => adminGuard(route, state)) as any);

    // Phát ra tín hiệu isAuthChecked đã hoàn tất
    isAuthCheckedSubject.next(true);
    isAuthCheckedSubject.complete();

    // Phát ra null trước, sau đó là user admin.
    // Vì guard có take(1) ngay sau switchMap(() => auth.currentUser$), nó sẽ chỉ lấy giá trị đầu tiên (null).
    currentUserSubject.next(null);
    currentUserSubject.next({ id: '1', email: 'admin@example.com', role: 'admin' } as IUser);
    currentUserSubject.complete();

    // Chờ kết quả từ guard
    const result = await guardPromise;

    // Kết quả mong đợi là chuyển hướng đến login vì giá trị đầu tiên là null
    expect(result).toBeInstanceOf(UrlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: state.url } });
  });

});