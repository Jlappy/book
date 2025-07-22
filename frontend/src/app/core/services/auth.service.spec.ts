// src/app/core/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BaseService } from './base.service';
import { of, throwError, BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IUser, ILoginResponse, IRegisterResponse, ILoginCredentials, IRegisterCredentials } from '../../shared/models/user.model';

describe('AuthService', () => {
  let authService: AuthService;
  let baseServiceMock: jasmine.SpyObj<BaseService>;
  let currentUserSubject: BehaviorSubject<IUser | null>;
  let isAuthCheckedSubject: BehaviorSubject<boolean>;
  let initialLoadCurrentUserSubject: Subject<IUser | null>; 

  const mockUser: IUser = { id: '1', email: 'test@example.com', role: 'user', fullName: 'Test User' };
  const mockAdminUser: IUser = { id: '2', email: 'admin@example.com', role: 'admin', fullName: 'Admin User' };
  const mockLoginCredentials: ILoginCredentials = { email: 'test@example.com', password: 'password123' };
  const mockRegisterCredentials: IRegisterCredentials = { email: 'new@example.com', password: 'newpassword' };
  const mockLoginResponse: ILoginResponse = { message: 'Login successful', user: mockUser };
  const mockRegisterResponse: IRegisterResponse = { message: 'Registration successful', user: mockUser };
  const mockLogoutResponse = { message: 'Logout successful' };

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<IUser | null>(null);
    isAuthCheckedSubject = new BehaviorSubject<boolean>(false);
    initialLoadCurrentUserSubject = new Subject<IUser | null>();

    baseServiceMock = jasmine.createSpyObj('BaseService', ['post', 'get']);

    baseServiceMock.get.and.returnValue(initialLoadCurrentUserSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: BaseService, useValue: baseServiceMock }
      ]
    });

    authService = TestBed.inject(AuthService);

    authService['currentUserSubject'] = currentUserSubject;
    authService['_isAuthChecked'] = isAuthCheckedSubject;

    spyOn(console, 'log');
    spyOn(console, 'error');
    spyOn(console, 'warn');
  });

  it('should call loadCurrentUser on initialization and set isAuthChecked to true on finalize', async () => {

    expect(isAuthCheckedSubject.value).toBeFalse();

    initialLoadCurrentUserSubject.next(mockUser);
    initialLoadCurrentUserSubject.complete();

    await Promise.resolve();

    expect(baseServiceMock.get).toHaveBeenCalledWith(`${authService['apiUrl']}/me`);
    expect(authService.getCurrentUserValue()).toEqual(mockUser);
    expect(isAuthCheckedSubject.value).toBeTrue();
  });

  it('should set isAuthChecked to true even if loadCurrentUser fails', async () => {

    expect(isAuthCheckedSubject.value).toBeFalse();

    initialLoadCurrentUserSubject.error(new Error('Session expired'));

    await Promise.resolve();

    expect(baseServiceMock.get).toHaveBeenCalledWith(`${authService['apiUrl']}/me`);
    expect(authService.getCurrentUserValue()).toBeNull();
    expect(isAuthCheckedSubject.value).toBeTrue();
    expect(console.error).toHaveBeenCalledWith('Session invalid or expired:', jasmine.any(Error));
  });

  it('should call baseService.post for registration', async () => {
    baseServiceMock.post.and.returnValue(of(mockRegisterResponse));

    const response = await firstValueFrom(authService.register(mockRegisterCredentials));

    expect(baseServiceMock.post).toHaveBeenCalledWith(`${authService['apiUrl']}/register`, mockRegisterCredentials);
    expect(response).toEqual(mockRegisterResponse);
  });

  it('should call baseService.post for login and update currentUser on success', async () => {
    baseServiceMock.post.and.returnValue(of(mockLoginResponse));

    const response = await firstValueFrom(authService.login(mockLoginCredentials));

    expect(baseServiceMock.post).toHaveBeenCalledWith(`${authService['apiUrl']}/login`, mockLoginCredentials);
    expect(response).toEqual(mockLoginResponse);
    expect(authService.getCurrentUserValue()).toEqual(mockUser);
  });

  it('should not update currentUser on login failure', async () => {
    const errorResponse = new Error('Login failed');
    baseServiceMock.post.and.returnValue(throwError(() => errorResponse));

    currentUserSubject.next(mockAdminUser);

    await firstValueFrom(authService.login(mockLoginCredentials).pipe(
      catchError(err => of(null)) 
    ));

    expect(baseServiceMock.post).toHaveBeenCalledWith(`${authService['apiUrl']}/login`, mockLoginCredentials);

    expect(authService.getCurrentUserValue()).toEqual(mockAdminUser); 
  });

  // --- Test logout method ---
  it('should call baseService.post for logout and set currentUser to null on success', async () => {
    baseServiceMock.post.and.returnValue(of(mockLogoutResponse)); 
    currentUserSubject.next(mockUser);

    const response = await firstValueFrom(authService.logout());

    expect(baseServiceMock.post).toHaveBeenCalledWith(`${authService['apiUrl']}/logout`, {});
    expect(authService.getCurrentUserValue()).toBeNull();
    expect(response).toEqual(mockLogoutResponse);
  });

  it('should set currentUser to null on logout failure', async () => {
    const errorResponse = new Error('Logout failed');
    baseServiceMock.post.and.returnValue(throwError(() => errorResponse));
    currentUserSubject.next(mockUser);

    const response = await firstValueFrom(authService.logout());

    expect(baseServiceMock.post).toHaveBeenCalledWith(`${authService['apiUrl']}/logout`, {});
    expect(authService.getCurrentUserValue()).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('Logout failed:', errorResponse);
    expect(response).toBeNull(); 
  });

  it('should load current user and update currentUserSubject on success', async () => {
    baseServiceMock.get.and.returnValue(of(mockUser));

    const user = await firstValueFrom(authService.loadCurrentUser());

    expect(baseServiceMock.get).toHaveBeenCalledWith(`${authService['apiUrl']}/me`);
    expect(user).toEqual(mockUser);
    expect(authService.getCurrentUserValue()).toEqual(mockUser);
    expect(console.log).toHaveBeenCalledWith('User loaded via session:', mockUser);
  });

  it('should set currentUserSubject to null on loadCurrentUser failure', async () => {
    const errorResponse = new Error('Session invalid');
    baseServiceMock.get.and.returnValue(throwError(() => errorResponse));
    currentUserSubject.next(mockUser);

    const user = await firstValueFrom(authService.loadCurrentUser());

    expect(baseServiceMock.get).toHaveBeenCalledWith(`${authService['apiUrl']}/me`);
    expect(user).toBeNull();
    expect(authService.getCurrentUserValue()).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Session invalid or expired:', errorResponse);
  });

  it('getCurrentUserValue should return current user value', () => {
    currentUserSubject.next(mockUser);
    expect(authService.getCurrentUserValue()).toEqual(mockUser);

    currentUserSubject.next(null);
    expect(authService.getCurrentUserValue()).toBeNull();
  });

  it('isLoggedIn should return true if user exists', () => {
    currentUserSubject.next(mockUser);
    expect(authService.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn should return false if user does not exist', () => {
    currentUserSubject.next(null);
    expect(authService.isLoggedIn()).toBeFalse();
  });

  it('isAdmin should return true if user role is admin', () => {
    currentUserSubject.next(mockAdminUser);
    expect(authService.isAdmin()).toBeTrue();
  });

  it('isAdmin should return false if user role is not admin', () => {
    currentUserSubject.next(mockUser);
    expect(authService.isAdmin()).toBeFalse();
  });

  it('isAdmin should return false if no user', () => {
    currentUserSubject.next(null);
    expect(authService.isAdmin()).toBeFalse();
  });

  it('isUser should return true if user role is user', () => {
    currentUserSubject.next(mockUser);
    expect(authService.isUser()).toBeTrue();
  });

  it('isUser should return false if user role is not user', () => {
    currentUserSubject.next(mockAdminUser);
    expect(authService.isUser()).toBeFalse();
  });

  it('isUser should return false if no user', () => {
    currentUserSubject.next(null);
    expect(authService.isUser()).toBeFalse();
  });
});