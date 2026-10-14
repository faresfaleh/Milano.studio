import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SHOOTING_OPTIONS, SHOOTING_TYPES } from '../../studio.config';

@Component({
  selector: 'app-shooting',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Shooting</span>
          <h2>Photo & vidéo, à votre image</h2>
          <p>Deux types de shooting : individuel ou de mariage. Mêmes choix, mêmes prix.</p>
        </div>

        <div class="tabs">
          @for (t of types; track t.id) {
            <button type="button" [class.on]="type === t.id" (click)="type = t.id">{{ t.name }}</button>
          }
        </div>
        <p class="tdesc">{{ currentDesc }}</p>

        <div class="grid opts">
          @for (o of options; track o.id) {
            <div class="card opt" [class.sel]="option === o.id" tabindex="0" role="button"
                 (click)="option = o.id" (keydown.enter)="option = o.id">
              <h4>{{ o.name }}</h4>
              <p class="price">{{ o.price }}<small> DT</small></p>
              <p class="desc">{{ o.desc }}</p>
              <p class="pick">{{ option === o.id ? '✔ Sélectionné' : 'Cliquer pour sélectionner' }}</p>
            </div>
          }
        </div>

        <div class="cta-wrap">
          <a routerLink="/reservation" [queryParams]="{ category: 'shooting', shootingType: type, shootingOption: option }" class="btn btn-red">Réserver</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tabs { display: flex; justify-content: center; gap: 6px; padding: 5px; background: var(--bg-soft); border-radius: 14px;
      max-width: 520px; margin: 0 auto 14px; }
    .tabs button { flex: 1; padding: 12px; background: transparent; color: var(--muted); border: 0; border-radius: 10px;
      cursor: pointer; font: 700 1.05rem 'Cormorant Garamond', Georgia, serif; transition: .15s; }
    .tabs button.on { background: #fff; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,.1); }
    .tdesc { text-align: center; color: var(--muted); margin-bottom: 34px; }
    .opts { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
    .opt { text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: .2s; }
    .opt:hover { transform: translateY(-3px); }
    .opt.sel { border: 2px solid var(--red); box-shadow: 0 18px 40px rgba(225,15,26,.15); }
    .opt h4 { font-size: 1.15rem; }
    .price { font-family: 'Playfair Display', Georgia, serif; font-size: 2.4rem; font-weight: 800; color: var(--red); margin: 8px 0; }
    .price small { font-size: .95rem; color: var(--muted); font-weight: 600; }
    .desc { color: var(--muted); font-size: .98rem; flex: 1; }
    .pick { margin-top: 16px; font-size: .88rem; font-weight: 700; color: var(--muted); }
    .opt.sel .pick { color: var(--red); }
    .cta-wrap { text-align: center; margin-top: 44px; }
  `],
})
export class ShootingComponent {
  types = SHOOTING_TYPES;
  options = SHOOTING_OPTIONS;
  type = 'individuel';
  option: string | null = null;

  get currentDesc() {
    return this.types.find((t) => t.id === this.type)?.desc ?? '';
  }
}
