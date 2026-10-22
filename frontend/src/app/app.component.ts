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
          <img src="assets/logo-header.png" alt="Milano Studio Photography" />
        </a>
        <nav [class.open]="open" (click)="open = false">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
          <a routerLink="/services" routerLinkActive="active">Services</a>
          <a routerLink="/flash" routerLinkActive="active">Mon flash</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <a routerLink="/panier" class="cart"><app-icon name="cart" size="1.25em" /> Panier @if (cart.count() > 0) { <span class="count">{{ cart.count() }}</span> }</a>
        </nav>
        <button class="burger" (click)="open = !open" aria-label="Menu" [attr.aria-expanded]="open">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
            @if (open) { <path d="M5 5l14 14M19 5L5 19" /> } @else { <path d="M4 7h16M4 12h16M4 17h16" /> }
          </svg>
        </button>
      </div>
    </header>

    <main><router-outlet /></main>

    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <a href="/" (click)="logoClick($event)"><img src="assets/logo-header.png" alt="Milano Studio Photography" class="flogo" /></a>
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
    /* ===== En-tête : même style que l'accueil (crème, bordeaux, rose) ===== */
    .header { position: sticky; top: 0; z-index: 50; background: rgba(247,235,227,.93); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(185,121,95,.4); box-shadow: 0 6px 22px rgba(74,22,34,.06); }
    .nav { display: flex; align-items: center; justify-content: space-between; height: 86px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand img { height: 70px; width: auto; display: block; }
    nav { display: flex; align-items: center; gap: 32px; }
    nav a:not(.cart) { font-family: 'Jost', sans-serif; font-size: .74rem; font-weight: 400; text-transform: uppercase; letter-spacing: .24em; color: #4a1622; transition: color .2s; position: relative; padding: 6px 0; }
    nav a:not(.cart):hover, nav a.active { color: #b9795f; }
    nav a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: #b9795f; }
    .cart { display: inline-flex; align-items: center; gap: 9px; padding: 11px 24px; border-radius: 999px; background: #4a1622; color: #f7ebe3; border: 1px solid #4a1622;
      font-family: 'Jost', sans-serif; font-size: .72rem; letter-spacing: .22em; text-transform: uppercase; transition: background .25s, border-color .25s; }
    .cart:hover { background: #b9795f; border-color: #b9795f; }
    .count { background: #b9795f; color: #fff; border-radius: 99px; min-width: 20px; padding: 0 6px; font-size: .72rem; line-height: 20px; text-align: center; letter-spacing: 0; }
    .cart:hover .count { background: #4a1622; }
    .burger { display: none; align-items: center; justify-content: center; width: 44px; height: 44px; background: none; border: 1px solid rgba(185,121,95,.55); border-radius: 50%; cursor: pointer; color: #4a1622; }
    .burger svg { width: 22px; height: 22px; }

    /* ===== Pied de page : bordeaux, crème et rose (comme l'accueil) ===== */
    .footer { background: radial-gradient(ellipse at 15% 0%, rgba(255,255,255,.07), transparent 55%), #3a0f19; color: #f1e0d5; padding-top: 64px;
      border-top: 1px solid rgba(217,164,140,.5); font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif; font-weight: 300; }
    .footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 40px; align-items: start; }
    .flogo { height: 150px; width: auto; display: block; background: #f7ebe3; border-radius: 26px; padding: 14px 18px; box-shadow: 0 14px 30px rgba(0,0,0,.28); }
    .footer h4 { color: #d9a48c; font: 500 .8rem 'Jost', sans-serif; letter-spacing: .3em; text-transform: uppercase; margin-bottom: 18px; }
    .footer h4.mt { margin-top: 28px; }
    .footer p { font-size: 1rem; margin-bottom: 10px; }
    .footer a { transition: color .2s; }
    .footer .ln { display: flex; align-items: center; gap: 12px; }
    .footer .ln app-icon { color: #d9a48c; }
    .footer a:hover { color: #d9a48c; }
    .copy { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 48px; padding: 22px 0;
      border-top: 1px solid rgba(217,164,140,.3); font-size: .78rem; letter-spacing: .08em; color: #d9b8a8; }
    @media (max-width: 800px) {
      .footer-grid { grid-template-columns: 1fr; }
      /* Téléphone : menu à gauche, « Milano Studio » au centre */
      .nav { display: grid; grid-template-columns: 44px 1fr 44px; height: 72px; gap: 8px; }
      .burger { display: inline-flex; grid-column: 1; grid-row: 1; }
      .brand { grid-column: 2; grid-row: 1; justify-self: center; }
      .brand img { height: 52px; }
            nav { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; text-align: center;
        background: #f7ebe3; padding: 8px 6% 20px; border-bottom: 1px solid rgba(185,121,95,.4); box-shadow: 0 18px 30px rgba(74,22,34,.12); }
      nav a:not(.cart) { padding: 16px 0; border-bottom: 1px solid rgba(185,121,95,.25); font-size: .78rem; }
      .cart { justify-content: center; margin-top: 16px; }
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
