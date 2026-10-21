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
    .trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; text-align: center; }
    .item { position: relative; overflow: hidden; background: var(--card, #fffaf6); border: 1px solid var(--line, rgba(185,121,95,.4)); border-radius: 22px;
      padding: 44px 26px 38px; box-shadow: var(--shadow, 0 12px 30px rgba(74,22,34,.08)); transition: transform .3s, box-shadow .3s, border-color .3s; }
    .item:hover { transform: translateY(-5px); border-color: #b9795f; box-shadow: 0 22px 46px rgba(74,22,34,.14); }
    .ring { display: grid; place-items: center; width: 74px; height: 74px; border-radius: 50%; margin: 0 auto 24px;
      border: 1px solid #b9795f; color: #b9795f; transition: .3s; }
    .item:hover .ring { background: #4a1622; border-color: #4a1622; color: #f7ebe3; }
    .ico { width: 34px; height: 34px; display: block; }
    h4 { font-family: 'Jost', sans-serif; font-size: .84rem; font-weight: 500; letter-spacing: .28em; text-transform: uppercase; margin-bottom: 14px; color: #4a1622; }
    p { color: #6d4a4d; font-size: .98rem; line-height: 1.55; margin-bottom: 20px; }
    .val { display: block; font-family: 'Italiana', Georgia, serif; font-weight: 400; color: #b9795f; font-size: 1.45rem; padding: 3px 0; word-break: break-word; }
    .val:hover { color: #4a1622; }
    @media (max-width: 860px) { .trio { grid-template-columns: minmax(0, 1fr); max-width: 460px; margin: 0 auto; } }
  `],
})
export class ContactTrioComponent {
  s = STUDIO;
}
