import { inject, Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject, catchError, finalize, Observable, of, tap } from 'rxjs';
import { IUser, ILoginResponse, IRegisterResponse } from '../../shared/models/user.model';
import { ILoginCredentials, IRegisterCredentials } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/users';

  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private _isAuthChecked = new BehaviorSubject<boolean>(false);
  public isAuthChecked$ = this._isAuthChecked.asObservable();

  constructor(private baseService: BaseService) {
    this.loadCurrentUser().pipe(
      finalize(() => this._isAuthChecked.next(true))
    ).subscribe();
  }

  register(credentials: IRegisterCredentials): Observable<IRegisterResponse> {
    return this.baseService.post<IRegisterResponse>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.baseService.post<ILoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.user) {
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.baseService.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError(error => {
        console.warn('Logout failed:', error);
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  loadCurrentUser(): Observable<IUser | null> {
    return this.baseService.get<IUser>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        // console.log('User loaded via session:', user);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        // console.error('Session invalid or expired:', error);
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  // 🧠 Helper functions
  getCurrentUserValue(): IUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isUser(): boolean {
    return this.currentUserSubject.value?.role === 'user';
  }

}
