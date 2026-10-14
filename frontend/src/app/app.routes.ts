import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PanierComponent } from './pages/panier/panier.component';
import { FlashComponent } from './pages/flash/flash.component';
import { MonteurComponent } from './pages/monteur/monteur.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'flash', component: FlashComponent },
  { path: 'monteur', component: MonteurComponent },
  { path: 'admin', component: AdminComponent },
  // anciennes adresses
  { path: 'mariage', redirectTo: 'services', pathMatch: 'full' },
  { path: 'shooting', redirectTo: 'services', pathMatch: 'full' },
  { path: 'reservation', redirectTo: 'services', pathMatch: 'full' },
  { path: 'offres', redirectTo: 'services', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
