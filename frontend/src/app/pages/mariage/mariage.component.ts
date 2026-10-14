import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EVENT_TYPES, INCLUDED_ALL, PACKS } from '../../studio.config';

@Component({
  selector: 'app-mariage',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Mariage</span>
          <h2>Mariage & soirées</h2>
          <p>Choisissez votre type de soirée puis votre formule. {{ included.join(' & ') }} inclus dans tous les choix.</p>
        </div>

        <div class="types">
          @for (t of types; track t.id; let i = $index) {
            <button type="button" class="type" [class.on]="eventType === t.id" (click)="eventType = t.id">
              <span>{{ icons[i] }}</span>{{ t.label }}
            </button>
          }
        </div>

        <div class="grid grid-3">
          @for (p of packs; track p.id; let i = $index) {
            <div class="card pack" [class.sel]="pack === p.id" tabindex="0" role="button"
                 (click)="pack = p.id" (keydown.enter)="pack = p.id">
              <p class="num">{{ i + 1 }}<sup>{{ i === 0 ? 'er' : 'ème' }}</sup> choix</p>
              <h3>{{ p.name }}</h3>
              <p class="price">{{ p.price }}<small> DT</small></p>
              <ul>
                @for (f of p.features; track f) { <li><i>✔</i>{{ f }}</li> }
                @for (f of included; track f) { <li class="inc"><i>✔</i>{{ f }} inclus</li> }
              </ul>
              <p class="pick">{{ pack === p.id ? '✔ Formule sélectionnée' : 'Cliquer pour sélectionner' }}</p>
            </div>
          }
        </div>

        <div class="cta-wrap">
          <a routerLink="/reservation" [queryParams]="{ category: 'soiree', eventType: eventType, pack: pack }" class="btn btn-red">Réserver</a>
          <p class="note">Un nombre maximum de soirées est accepté par jour : une date complète n'est plus disponible.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .types { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 40px; }
    .type { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border: 1px solid var(--line);
      border-radius: 99px; font: 700 1rem 'Cormorant Garamond', Georgia, serif; background: #fff; cursor: pointer; transition: .2s; color: var(--ink); }
    .type:hover { border-color: var(--red); }
    .type.on { background: var(--red); border-color: var(--red); color: #fff; }
    .pack { position: relative; display: flex; flex-direction: column; cursor: pointer; transition: .2s; }
    .pack:hover { transform: translateY(-3px); }
    .pack.sel { border: 2px solid var(--red); box-shadow: 0 22px 46px rgba(225,15,26,.16); }
    .num { color: var(--muted); text-transform: uppercase; font-size: .75rem; letter-spacing: .14em; font-weight: 700; }
    h3 { font-size: 1.6rem; margin: 6px 0; }
    .price { font-family: 'Playfair Display', Georgia, serif; font-size: 3rem; font-weight: 800; margin: 6px 0 20px; }
    .price small { font-size: 1rem; color: var(--muted); font-weight: 600; }
    ul { list-style: none; flex: 1; }
    li { padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 1rem; display: flex; gap: 10px; }
    li i { font-style: normal; color: var(--red); font-weight: 700; }
    li.inc { color: var(--muted); }
    .pick { text-align: center; margin-top: 18px; font-size: .9rem; font-weight: 700; color: var(--muted); }
    .pack.sel .pick { color: var(--red); }
    .cta-wrap { text-align: center; margin-top: 44px; }
    .note { color: var(--muted); font-size: .9rem; margin-top: 16px; }
  `],
})
export class MariageComponent {
  packs = PACKS;
  types = EVENT_TYPES;
  included = INCLUDED_ALL;
  icons = ['💍', '🧔', '👩'];
  eventType = 'mariage';
  pack: string | null = null;
}
