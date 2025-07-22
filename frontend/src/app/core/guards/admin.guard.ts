import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthChecked$.pipe(
    take(1),
    switchMap(() => auth.currentUser$),
    take(1),
    map(user => {
      if (!user) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
      if (user.role !== 'admin') {
        return router.createUrlTree(['/unauthorized']);
      }
      return true;
    })
  );
};
