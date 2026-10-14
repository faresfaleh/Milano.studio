import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INCLUDED_ALL, PACKS } from '../../studio.config';

@Component({
  selector: 'app-offres',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Offres soirée</span>
          <h2>Mariage, soirée homme ou femme</h2>
          <p>Choisissez la formule qui vous convient. {{ included.join(' & ') }} inclus dans tous les choix.</p>
        </div>

        <div class="grid grid-3">
          @for (p of packs; track p.id; let i = $index) {
            <div class="card pack" [class.pop]="p.popular">
              <p class="num">{{ i + 1 }}<sup>{{ i === 0 ? 'er' : 'ème' }}</sup> choix</p>
              <h3>{{ p.name }}</h3>
              <p class="price">{{ p.price }}<small> DT</small></p>
              <ul>
                @for (f of p.features; track f) { <li><i>✔</i>{{ f }}</li> }
                @for (f of included; track f) { <li class="inc"><i>✔</i>{{ f }} inclus</li> }
              </ul>
              <a routerLink="/reservation" [queryParams]="{ category: 'soiree', pack: p.id }"
                 class="btn full" [class.btn-red]="p.popular" [class.btn-dark]="!p.popular">Réserver ce choix</a>
            </div>
          }
        </div>
        <p class="note">Un maximum de soirées par jour est accepté : une date complète n'est plus proposée à la réservation.</p>
      </div>
    </section>
  `,
  styles: [`
    .pack { position: relative; display: flex; flex-direction: column; }
    .pack.pop { border: 2px solid var(--red); box-shadow: 0 22px 46px rgba(225,15,26,.16); }
    .tag { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--red); color: #fff;
      font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; white-space: nowrap; }
    .num { color: var(--muted); text-transform: uppercase; font-size: .75rem; letter-spacing: .14em; font-weight: 600; }
    h3 { font-size: 1.6rem; margin: 6px 0; }
    .price { font-family: 'Sora', sans-serif; font-size: 3rem; font-weight: 800; margin: 6px 0 20px; }
    .price small { font-size: 1rem; color: var(--muted); font-weight: 600; }
    ul { list-style: none; margin-bottom: 28px; flex: 1; }
    li { padding: 10px 0; border-bottom: 1px solid var(--line); font-size: .95rem; display: flex; gap: 10px; }
    li i { font-style: normal; color: var(--red); font-weight: 700; }
    li.inc { color: var(--muted); }
    .full { width: 100%; }
    .note { text-align: center; color: var(--muted); font-size: .88rem; margin-top: 36px; }
  `],
})
export class OffresComponent {
  packs = PACKS;
  included = INCLUDED_ALL;
}
