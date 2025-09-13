import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {
  provideFirestore,
  initializeFirestore,
} from '@angular/fire/firestore';

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { FirebaseConnectionService } from './core/services/firebase-connection.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ 
      eventCoalescing: true,
      runCoalescing: true 
    }),
    provideRouter(routes),

    // Firebase App - Initialize once
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firestore with proper configuration
    provideFirestore(() => {
      const app = initializeApp(environment.firebase);
      return initializeFirestore(app, {
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true,
        cacheSizeBytes: 40 * 1024 * 1024, // 40MB cache
      });
    }),

    // Firebase Auth
    provideAuth(() => getAuth()),

    // Firebase Connection Service
    FirebaseConnectionService,

    // UI Notifications
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ]
};
