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
    <section class="section">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">Contact</span>
          <h2>Parlons de votre <em class="it">événement</em></h2>
          <p>Une date à réserver, une question sur nos formules ou un projet sur mesure ? Appelez-nous ou écrivez-nous : l'équipe de {{ s.name }}, dirigée par {{ s.president }}, vous répond avec plaisir.</p>
        </div>

        <app-contact-trio />

        <div class="social" appReveal>
          <span class="soc-title">Suivez-nous</span>
          <a [href]="s.instagram" target="_blank" rel="noopener">Instagram <b>{{ s.instagramHandle }}</b></a>
          <a [href]="s.facebook" target="_blank" rel="noopener">Facebook <b>{{ s.facebookName }}</b></a>
          <a [href]="s.tiktok" target="_blank" rel="noopener">TikTok <b>{{ s.tiktokHandle }}</b></a>
        </div>

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
      </div>
    </section>
  `,
  styles: [`
    .social { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; margin: 40px 0 46px; }
    .soc-title { width: 100%; text-align: center; font-size: .8rem; letter-spacing: .26em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); margin-bottom: 4px; }
    .social a { padding: 12px 24px; border: 1px solid var(--line); border-radius: 3px; background: #fff; font-size: .98rem; transition: .25s; }
    .social a b { color: var(--gold-dark); margin-left: 6px; }
    .social a:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: var(--shadow); }
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
