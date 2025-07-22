import { APP_INITIALIZER, ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { withCredentialsInterceptor } from './core/interceptors/with-credentials.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { BaseService } from './core/services/base.service';
import { AuthService } from './core/services/auth.service';

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
  ]
};
