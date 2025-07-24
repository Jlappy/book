// src/app/guards/auth.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take, map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | ReturnType<Router['createUrlTree']>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthChecked$.pipe(
    take(1),
    switchMap(() =>
      authService.currentUser$.pipe(
        take(1),
        map(user => {
          const isLoggedIn = !!user;
          if (isLoggedIn) {
            return true;
          }

          // 👇 Giải thích rõ ràng redirect
          const redirectToLogin = router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return redirectToLogin;
        }),
        catchError(() => {
          // 👇 Trường hợp lỗi hệ thống vẫn redirect về login
          return of(
            router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url }
            })
          );
        })
      )
    )
  );
};
