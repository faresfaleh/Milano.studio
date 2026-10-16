import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlashManagerComponent } from '../../components/flash-manager/flash-manager.component';
import { ReservationService } from '../../services/reservation.service';

// Espace monteur : uniquement le suivi des flashs (prêt / pas prêt)
// Accès : 3 clics sur les photos de la page d'accueil
@Component({
  selector: 'app-monteur',
  standalone: true,
  imports: [FormsModule, FlashManagerComponent],
  template: `
    <section class="section soft">
      <div class="container">
        @if (!logged) {
          <div class="card login">
            <h2>Espace monteur</h2>
            <p>Entrez le mot de passe du monteur.</p>
            <input type="password" [(ngModel)]="key" placeholder="Mot de passe monteur" (keyup.enter)="login()" />
            @if (error) { <p class="error">{{ error }}</p> }
            <button class="btn btn-red" (click)="login()">Se connecter</button>
          </div>
        } @else {
          <div class="top">
            <h2>Espace monteur</h2>
            <button class="btn btn-dark btn-sm" (click)="logout()">Déconnexion</button>
          </div>
          <app-flash-manager [adminKey]="key" />
        }
      </div>
    </section>
  `,
  styles: [`
    .login { max-width: 420px; margin: 40px auto; text-align: center; }
    .login h2 { margin-bottom: 8px; } .login p { color: var(--muted); margin-bottom: 18px; }
    .login input { margin-bottom: 14px; }
    .top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
  `],
})
export class MonteurComponent implements OnInit {
  private api = inject(ReservationService);
  key = '';
  logged = false;
  error = '';

  ngOnInit() {
    const saved = sessionStorage.getItem('monteurKey');
    if (saved) { this.key = saved; this.login(); }
  }

  login() {
    this.error = '';
    this.api.whoami(this.key).subscribe({
      next: () => { this.logged = true; sessionStorage.setItem('monteurKey', this.key); },
      error: (e) => {
        this.logged = false;
        sessionStorage.removeItem('monteurKey');
        this.error = e.error?.message || (e.status ? `Erreur serveur (${e.status})` : 'Impossible de contacter le serveur');
      },
    });
  }

  logout() {
    sessionStorage.removeItem('monteurKey');
    this.logged = false;
    this.key = '';
  }
}
