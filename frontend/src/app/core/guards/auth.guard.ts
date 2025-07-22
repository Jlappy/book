import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthChecked$.pipe(
    take(1),
    switchMap(() =>
      authService.currentUser$.pipe(
        take(1),
        map(user => {
          console.log('AuthGuard: Current user received:', user);
          if (user) {
            return true;
          } else {
            console.log('AuthGuard: User is null/undefined, redirecting to login.'); // <-- THÊM DÒNG NÀY ĐỂ DEBUG
            return router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url }
            });
          }
        })
      )
    )
  );
};
