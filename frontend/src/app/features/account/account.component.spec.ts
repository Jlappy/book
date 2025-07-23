import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IUser } from '../../shared/models/user.model';

describe('AccountComponent', () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
            currentUser$: of({ id: '1', email: 'testuser', role: 'admin' } as IUser)
        });
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AccountComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('account component đã tạo', () => {
        expect(component).toBeTruthy();
    });

    it('route: không điều hướng đến đăng nhập nếu đã đăng nhập', () => {
        expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/login']);
    });

   it('đăng xuất và điều hướng đến đăng nhập', () => {
        authServiceSpy.logout.and.returnValue(of(null));
        component.logout();
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
});