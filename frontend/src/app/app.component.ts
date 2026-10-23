import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { STUDIO } from './studio.config';
import { IconComponent } from './components/icon/icon.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="header">
      <div class="container nav">
        <a href="/" class="brand" (click)="logoClick($event)">
          <img src="assets/logo-icon.png" alt="Logo Milano Studio" />
          <span class="brand-text"><strong>{{ s.name }}</strong><small>{{ s.tagline }}</small></span>
        </a>
        <nav [class.open]="open" (click)="open = false">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/flash" routerLinkActive="active">Mon flash</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <a routerLink="/panier" class="btn btn-red btn-sm"><app-icon name="cart" size="1.2em" /> Panier @if (cart.count() > 0) { <span class="count">{{ cart.count() }}</span> }</a>
        </nav>
        <button class="burger" (click)="open = !open" aria-label="Menu">☰</button>
      </div>
    </header>

    <main><router-outlet /></main>

    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <a href="/" (click)="logoClick($event)"><img src="assets/logo.jpg" alt="Milano Studio Photography" class="flogo" /></a>
        </div>
        <div>
          <h4>Contact</h4>
          <p class="ln"><app-icon name="mail" size="1.1em" /><a [href]="'mailto:' + s.email">{{ s.email }}</a></p>
          <p class="ln"><app-icon name="pin" size="1.1em" /><a [href]="s.maps" target="_blank" rel="noopener">Voir sur Google Maps</a></p>
          @for (p of s.phones; track p) {
            <p class="ln"><app-icon name="phone" size="1.1em" /><a [href]="'tel:' + p.replaceAll(' ', '')">{{ p }}</a></p>
          }
        </div>
        <div>
          <h4>Réseaux sociaux</h4>
          <p><a [href]="s.instagram" target="_blank" rel="noopener">Instagram {{ s.instagramHandle }}</a></p>
          <p><a [href]="s.facebook" target="_blank" rel="noopener">Facebook</a></p>
          <p><a [href]="s.tiktok" target="_blank" rel="noopener">TikTok {{ s.tiktokHandle }}</a></p>
          <h4 class="mt">Le studio</h4>
          <p>Président : {{ s.president }}</p>
        </div>
      </div>
      <div class="copy container">
        <span>© {{ year }} {{ s.name }} {{ s.tagline }}. Tous droits réservés.</span>
      </div>
    </footer>
  `,
  styles: [`
    .header { position: sticky; top: 0; z-index: 50; background: rgba(251,249,245,.92); backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line); }
    .nav { display: flex; align-items: center; justify-content: space-between; height: 72px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand img { height: 40px; width: auto; border-radius: 8px; }
    .brand-text { display: flex; flex-direction: column; line-height: 1.1; }
    .brand-text strong { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; letter-spacing: .16em; text-transform: uppercase; font-weight: 700; }
    .brand-text small { font-size: .62rem; letter-spacing: .28em; text-transform: uppercase; color: var(--gold-dark); font-weight: 700; margin-top: 3px; }
    nav { display: flex; align-items: center; gap: 30px; }
    nav a:not(.btn) { font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--muted); transition: .2s; position: relative; }
    nav a:not(.btn):hover, nav a.active { color: var(--gold-dark); }
    nav a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -8px; height: 2px; background: var(--gold); border-radius: 2px; }
    .count { background: var(--ink); color: var(--gold-light); border-radius: 99px; padding: 0 7px; font-size: .75rem; font-weight: 700; margin-left: 6px; }
    .burger { display: none; background: none; border: 0; font-size: 1.7rem; cursor: pointer; color: var(--text); }

    .footer { background: #070605; color: #cdc6ba; padding-top: 64px; border-top: 1px solid var(--line); }
    .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 40px; align-items: start; }
    .flogo { width: 150px; border-radius: 14px; }
    .footer h4 { color: var(--gold-light); font-size: 1rem; margin-bottom: 14px; }
    .footer h4.mt { margin-top: 24px; }
    .footer p { font-size: .92rem; margin-bottom: 8px; }
    .footer .ln { display: flex; align-items: center; gap: 10px; }
    .footer .ln app-icon { color: var(--gold-light); }
    .footer a:hover { color: #fff; }
    .copy { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 48px; padding: 22px 0;
      border-top: 1px solid #2c2823; font-size: .82rem; color: #9a9286; }
    @media (max-width: 800px) {
      .footer-grid { grid-template-columns: 1fr; }
      .burger { display: block; }
      nav { display: none; position: absolute; top: 72px; left: 0; right: 0; flex-direction: column; align-items: flex-start;
        background: var(--bg-soft); padding: 22px 4%; gap: 18px; border-bottom: 1px solid var(--line); box-shadow: var(--shadow); }
      nav.open { display: flex; }
      nav a.active::after { display: none; }
    }
  `],
})
export class AppComponent {
  s = STUDIO;
  cart = inject(CartService);
  open = false;
  year = new Date().getFullYear();

  private router = inject(Router);
  private clicks = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  // 1 clic = accueil ; 3 clics rapides sur le logo = espace admin
  logoClick(event: Event) {
    event.preventDefault();
    this.clicks++;
    clearTimeout(this.timer);
    if (this.clicks >= 3) {
      this.clicks = 0;
      this.router.navigateByUrl('/admin');
      return;
    }
    this.router.navigateByUrl('/');
    this.timer = setTimeout(() => (this.clicks = 0), 1000);
  }
}
