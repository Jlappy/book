import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NavbarComponent', () => {
    // tạo mock cho AuthService và Router
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let authServiceMock: jasmine.SpyObj<AuthService>;
    let routerMock: jasmine.SpyObj<Router>;

    let currentUserSubject: Subject<any>;
    let isAuthCheckedSubject: Subject<boolean>;
    // Khởi tạo các mock và cấu hình TestBed
    beforeEach(async () => {
        currentUserSubject = new Subject<any>();
        isAuthCheckedSubject = new Subject<boolean>();

        authServiceMock = jasmine.createSpyObj('AuthService', ['logout'], {
            currentUser$: currentUserSubject.asObservable(),
            isAuthChecked$: isAuthCheckedSubject.asObservable()
        });
        routerMock = jasmine.createSpyObj('Router', ['navigate']);
        // Cấu hình TestBed với các module và dịch vụ cần thiết
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                MatToolbarModule,
                MatButtonModule,
                MatIconModule,
                MatFormFieldModule,
                MatInputModule,
                NoopAnimationsModule,
                NavbarComponent,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: {} }
            ]
        }).compileComponents();


        // Tạo fixture để Angular vẽ template và component
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('khởi tạo component NavbarComponent', () => {
        expect(component).toBeTruthy();
    });

    // --- Test onSearch()  ---
    // Kiểm tra xem có gọi hàm navigate với queryParams đúng không
    it('/search khi searchTerm không rỗng.', () => {
        component.searchTerm = 'test query';
        component.onSearch();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'test query' } });
    });
    // Kiểm tra xem có gọi hàm navigate với queryParams đúng không
    it('/search khi searchTerm có khoảng trắng ở đầu/cuối.', () => {
        component.searchTerm = '  another query  ';
        component.onSearch();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'another query' } });
    });
    // Kiểm tra xem không gọi hàm navigate khi searchTerm là rỗng hoặc chỉ chứa khoảng trắng
    it('khi searchTerm là rỗng', () => {
        component.searchTerm = '';
        component.onSearch();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });
    // Kiểm tra xem không gọi hàm navigate khi searchTerm chỉ chứa khoảng trắng
    it('khi searchTerm chỉ chứa khoảng trắng', () => {
        component.searchTerm = '   ';
        component.onSearch();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    // --- Test onLogout() method ---
    it('gọi authService.logout và điều hướng đến /login khi đăng xuất thành công', () => {
        authServiceMock.logout.and.returnValue(of({ message: 'Logout successful' }));
        spyOn(console, 'log');

        component.onLogout();

        expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        expect(console.log).toHaveBeenCalledWith('Đăng xuất thành công');
    });
    it('gọi authService.logout và ghi log lỗi khi đăng xuất không thành công', () => {
        const errorResponse = new Error('Logout failed');
        authServiceMock.logout.and.returnValue(throwError(() => errorResponse));
        spyOn(console, 'error');

        component.onLogout();

        expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
        expect(routerMock.navigate).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith('Lỗi khi đăng xuất:', errorResponse);
    });
    it('kiểm tra authService.currentUser$ và isAuthChecked$', () => {
        expect(component.authService.currentUser$).toBeDefined();
        expect(component.authService.isAuthChecked$).toBeDefined();
    });
});
