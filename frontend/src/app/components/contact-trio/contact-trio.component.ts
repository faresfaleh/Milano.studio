import { Component } from '@angular/core';
import { STUDIO } from '../../studio.config';
import { RevealDirective } from '../../directives/reveal.directive';

// Trois colonnes : nous rendre visite, nous appeler, nous écrire
@Component({
  selector: 'app-contact-trio',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <div class="trio" appReveal>
      <div class="item">
        <span class="ring"><svg viewBox="0 0 48 48" class="ico" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M24 43s14-12.4 14-23a14 14 0 0 0-28 0c0 10.6 14 23 14 23z" /><circle cx="24" cy="20" r="5" />
        </svg></span>
        <h4>Nous rendre visite</h4>
        <p>Retrouvez le studio sur la carte et préparez sereinement votre venue.</p>
        <a class="val" [href]="s.maps" target="_blank" rel="noopener">Voir sur Google Maps</a>
      </div>

      <div class="item">
        <span class="ring"><svg viewBox="0 0 48 48" class="ico" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6h8l3 10-5 3a24 24 0 0 0 11 11l3-5 10 3v8a4 4 0 0 1-4 4C21 40 8 27 8 10a4 4 0 0 1 4-4z" />
        </svg></span>
        <h4>Nous appeler</h4>
        <p>Une question, une date, un devis ? Appelez-nous, nous vous répondons rapidement.</p>
        @for (p of s.phones; track p) {
          <a class="val" [href]="'tel:' + p.replaceAll(' ', '')">{{ p }}</a>
        }
      </div>

      <div class="item">
        <span class="ring"><svg viewBox="0 0 48 48" class="ico" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="11" width="36" height="26" rx="3" /><path d="M7 14l17 13 17-13" />
        </svg></span>
        <h4>Nous écrire</h4>
        <p>Détaillez-nous votre projet par email : nous revenons vers vous dans les meilleurs délais.</p>
        <a class="val" [href]="'mailto:' + s.email">{{ s.email }}</a>
      </div>
    </div>
  `,
  styles: [`
    .trio { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; text-align: center; }
    .item { position: relative; overflow: hidden; background: #fff; border: 1px solid var(--line); border-radius: 8px;
      padding: 42px 26px 36px; box-shadow: var(--shadow); transition: transform .3s, box-shadow .3s; }
    .item::before { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 3px; background: var(--gold);
      transform: scaleX(0); transform-origin: left; transition: transform .4s; }
    .item:hover { transform: translateY(-5px); box-shadow: 0 20px 44px rgba(20,17,15,.14); }
    .item:hover::before { transform: scaleX(1); }
    .ring { display: grid; place-items: center; width: 78px; height: 78px; border-radius: 50%; margin: 0 auto 22px;
      background: var(--gold-soft); color: var(--gold-dark); transition: .3s; }
    .item:hover .ring { background: var(--gold); color: #fff; }
    .ico { width: 36px; height: 36px; display: block; }
    h4 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; margin-bottom: 12px; color: var(--text); }
    p { color: var(--muted); font-size: 1rem; line-height: 1.55; margin-bottom: 18px; }
    .val { display: block; font-weight: 700; color: var(--gold-dark); font-size: 1.1rem; padding: 3px 0; word-break: break-word; }
    .val:hover { text-decoration: underline; }
    @media (max-width: 860px) { .trio { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; } }
  `],
})
export class ContactTrioComponent {
  s = STUDIO;
}
