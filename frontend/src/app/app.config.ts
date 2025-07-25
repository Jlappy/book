import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { withCredentialsInterceptor } from './core/interceptors/with-credentials.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { BaseService } from './core/services/base.service';
import { AuthService } from './core/services/auth.service';
import { provideHighcharts } from 'highcharts-angular';

export function initializeAuth(authService: AuthService): () => Promise<void> {
  return () =>
    new Promise<void>((resolve) => {
      authService.loadCurrentUser().subscribe({
        next: () => resolve(),
        error: () => resolve()  // không làm app crash nếu session hết hạn
      });
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    BaseService,
    AuthService,
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,
        withCredentialsInterceptor
      ])
    ),
    provideClientHydration(withEventReplay()),
    provideHighcharts({
      instance: () => import('highcharts/esm/highcharts').then(m => m.default),
      options: {
        title: {
          style: {
            color: 'tomato'
          }
        },
        legend: {
          enabled: false
        }
      },
      // The modules will work for all charts.
      modules: () => {
        return [
          import('highcharts/esm/highcharts-more'),
          import('highcharts/esm/modules/accessibility'),
          import('highcharts/esm/modules/exporting'),
          import('highcharts/esm/themes/sunset')
        ]
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
