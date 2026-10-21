import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STUDIO } from '../../studio.config';
import { RevealDirective } from '../../directives/reveal.directive';
import { ContactTrioComponent } from '../../components/contact-trio/contact-trio.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, ContactTrioComponent, RouterLink],
  template: `
    <header class="page-hero" appReveal>
      <div class="container">
        <span class="eyebrow">Contact</span>
        <h2>Parlons de votre <em class="it">événement</em></h2>
        <p>Une date à réserver, une question sur nos formules ou un projet sur mesure ? Appelez-nous ou écrivez-nous : l'équipe de {{ s.name }}, dirigée par {{ s.president }}, vous répond avec plaisir.</p>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <app-contact-trio />

        <div class="map" appReveal>
          <iframe [src]="mapUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  title="Localisation de Milano Studio"></iframe>
          <div class="place">
            <span class="kick">Le studio</span>
            <strong>{{ s.name }} {{ s.tagline }}</strong>
            <a [href]="s.maps" target="_blank" rel="noopener" class="btn btn-dark btn-sm">Itinéraire Google Maps</a>
          </div>
        </div>

        <div class="book" appReveal>
          <div>
            <h3>Prêt à réserver <em class="it">votre date ?</em></h3>
            <p>Composez votre formule et découvrez le prix en direct.</p>
          </div>
          <a routerLink="/services" class="btn btn-red">Voir nos services</a>
        </div>

        <div class="social" appReveal>
          <span class="soc-title">Suivez-nous</span>
          <p class="soc-sub">Nos dernières soirées, mariages et coulisses sont sur les réseaux.</p>
          <div class="soc-list">
            <a [href]="s.facebook" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/></svg>
              <span>Facebook<b>{{ s.facebookName }}</b></span>
            </a>
            <a [href]="s.tiktok" target="_blank" rel="noopener" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 2.3 1.7 3.8 4 4v3.2c-1.5 0-2.9-.5-4-1.2v6.3a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.3a2.8 2.8 0 1 0 1.9 2.6V3h3.2z"/></svg>
              <span>TikTok<b>{{ s.tiktokHandle }}</b></span>
            </a>
            <a [href]="s.instagram" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              <span>Instagram<b>{{ s.instagramHandle }}</b></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .social { margin-top: 52px; text-align: center; }
    .soc-title { display: block; font-size: .8rem; letter-spacing: .26em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); margin-bottom: 8px; }
    .soc-sub { color: var(--muted); margin-bottom: 22px; }
    .soc-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
    .soc-list a { display: flex; align-items: center; gap: 14px; padding: 14px 26px 14px 16px; background: #fff; border: 1px solid var(--line); border-radius: 999px; transition: .25s; text-align: left; }
    .soc-list svg { width: 46px; height: 46px; padding: 12px; border-radius: 50%; background: var(--gold-soft); color: var(--gold-dark); transition: .25s; flex: none; }
    .soc-list span { display: flex; flex-direction: column; line-height: 1.25; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: .85rem; }
    .soc-list b { margin-top: 2px; font-weight: 500; letter-spacing: 0; text-transform: none; font-size: .98rem; color: var(--gold-dark); }
    .soc-list a:hover { border-color: var(--gold); transform: translateY(-3px); box-shadow: var(--shadow); }
    .soc-list a:hover svg { background: var(--ink); color: var(--gold-light); }
    .map { position: relative; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow); background: #fff; }
    iframe { display: block; width: 100%; height: 440px; border: 0; }
    .place { position: absolute; left: 22px; bottom: 22px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
      background: rgba(255,255,255,.96); border: 1px solid var(--line); border-left: 3px solid var(--gold); border-radius: 6px; padding: 18px 22px; box-shadow: var(--shadow); max-width: calc(100% - 44px); }
    .kick { font-size: .72rem; letter-spacing: .24em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); }
    .place strong { font: 700 1.25rem 'Cormorant Garamond', Georgia, serif; margin-bottom: 6px; }
    .book { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 22px; margin-top: 48px; padding: 38px 44px;
      background: radial-gradient(ellipse at 90% 0%, rgba(184,146,79,.28), transparent 60%), var(--ink); color: #fff; border-radius: 8px; }
    .book h3 { font: 500 2rem 'Cormorant Garamond', Georgia, serif; margin-bottom: 4px; }
    .book h3 .it { color: var(--gold-light); }
    .book p { color: rgba(255,255,255,.72); }
    @media (max-width: 560px) { iframe { height: 340px; } .place { position: static; max-width: none; border-radius: 0; } .book { padding: 30px 24px; } }
  `],
})
export class ContactComponent {
  s = STUDIO;
  mapUrl: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://www.google.com/maps?q=${STUDIO.lat},${STUDIO.lng}&z=16&output=embed`
  );
}
