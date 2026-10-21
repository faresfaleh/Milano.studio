// À l'ouverture (ou au rechargement) du site, on arrive toujours sur la page d'accueil, en haut de page.
// Exceptions : les espaces privés /admin et /monteur (pour pouvoir les garder en favori).
if (typeof window !== 'undefined') {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && !/^\/(admin|monteur)$/.test(path)) {
    window.history.replaceState(null, '', '/');
  }
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
