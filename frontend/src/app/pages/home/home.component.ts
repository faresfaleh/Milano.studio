import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SHOOTING_OPTIONS, SOIREE_PRICING, STUDIO } from '../../studio.config';
import { IconComponent } from '../../components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective, IconComponent],
  template: `
    <!-- ===== Haut de page ===== -->
    <section class="hero">
      <div class="wrap">
        <div class="hero-top">
          <span class="tl">Photographie &amp; vidéo</span>
          <span class="line"></span>
          <span class="star">✦</span>
          <span class="tr">Mariages<br />Soirées<br />Shootings</span>
        </div>

        <h1 class="giant"><span>Milano</span> <span>Studio</span></h1>
        <div class="rule"><i></i><b>◆</b><i></i></div>

        <div class="hero-grid">
          <div class="hero-text">
            <p class="role" (click)="photoClick()">Photographes &amp; vidéastes d'événements</p>
            <blockquote class="pitch">
              Nous capturons les moments qui vous coupent le souffle, avec discrétion, élégance et sensibilité.
            </blockquote>
            <p class="sign">{{ s.name }}</p>
            <p class="based">Basé en Tunisie</p>
            <div class="hero-actions">
              <a routerLink="/services" class="pill pill-fill">Réserver maintenant</a>
              <a href="#services" class="pill" (click)="go($event, 'services')">Nos services</a>
            </div>
          </div>

          <div class="hero-photo">
            <div class="arch">
              <img src="assets/photos/photo-1.jpg" alt="Mariée souriante tenant son bouquet" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Photos qui défilent ===== -->
    <section class="work">
      <h2 class="stitle light"><span>Nos réalisations</span></h2>
      <div class="marquee" aria-hidden="true">
        <div class="track">
          @for (ph of loop; track $index) {
            <figure><img [src]="ph" alt="" loading="lazy" /></figure>
          }
        </div>
      </div>
    </section>

    <!-- ===== Services : Mariage | Shooting ===== -->
    <section class="offer" id="services">
      <div class="wrap offer-grid">
        <div class="col" appReveal>
          <h2 class="stitle"><span>Soirée &amp; mariage</span></h2>
          <ul>
            @for (it of weddingItems; track it.title) {
              <li>
                <a routerLink="/services" [queryParams]="{ partie: 'mariage' }">
                  <span class="ico"><app-icon [name]="it.icon" /></span>
                  <span class="txt">
                    <b>{{ it.title }}</b>
                    <small>{{ it.text }}</small>
                  </span>
                  <span class="price">{{ it.price }} DT</span>
                </a>
              </li>
            }
          </ul>
        </div>

        <div class="divider" aria-hidden="true"><i></i><b>◆</b><i></i></div>

        <div class="col" appReveal>
          <h2 class="stitle"><span>Shooting</span></h2>
          <ul>
            @for (it of shootingItems; track it.title) {
              <li>
                <a routerLink="/services" [queryParams]="{ partie: 'shooting' }">
                  <span class="ico"><app-icon [name]="it.icon" /></span>
                  <span class="txt">
                    <b>{{ it.title }}</b>
                    <small>{{ it.text }}</small>
                  </span>
                  <span class="price">{{ it.price }} DT</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <!-- ===== Contact ===== -->
    <section class="contact">
      <div class="wrap">
        <h2 class="stitle light big"><span>Créons ensemble quelque chose de beau</span></h2>
        <div class="c-grid">
          <div class="c-photo">
            <div class="arch small"><img src="assets/photos/photo-4.jpg" alt="Couple de mariés" /></div>
            <span class="script">Contactez-nous</span>
          </div>

          <ul class="c-list">
            <li><span class="ico"><app-icon name="mail" /></span><a [href]="'mailto:' + s.email">{{ s.email }}</a></li>
            @for (p of s.phones; track p) {
              <li><span class="ico"><app-icon name="phone" /></span><a [href]="'tel:' + p.replaceAll(' ', '')">{{ p }}</a></li>
            }
            <li><span class="ico"><app-icon name="pin" /></span><a [href]="s.maps" target="_blank" rel="noopener">Voir sur Google Maps</a></li>
            <li>
              <span class="ico">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="7" y="7" width="34" height="34" rx="9" /><circle cx="24" cy="24" r="8" /><circle cx="34" cy="14" r="1.2" />
                </svg>
              </span>
              <a [href]="s.instagram" target="_blank" rel="noopener">{{ s.instagramHandle }}</a>
            </li>
          </ul>

          <div class="c-quote">
            <span class="qm">“</span>
            <p>Chaque instant mérite d'être gardé.</p>
            <a routerLink="/services" class="pill pill-fill">Réserver maintenant</a>
          </div>
        </div>
      </div>
      <p class="motto">Élégance &nbsp;·&nbsp; Émotion &nbsp;·&nbsp; Souvenirs</p>
    </section>
  `,
  styles: [`
    :host {
      --wine: #4a1622; --wine-2: #3a0f19; --wine-3: #5a1f2c;
      --cream: #f7ebe3; --cream-2: #f1e0d5;
      --rose: #b9795f; --rose-2: #d9a48c; --rose-soft: #c99a86;
      display: block; overflow-x: clip; font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif; font-weight: 400;
      background: var(--cream); color: var(--wine); line-height: 1.6;
    }
    .wrap { width: min(1180px, 92%); margin: 0 auto; }
    ul { list-style: none; }

    /* ---------- haut de page ---------- */
    .hero { background: var(--cream); padding: 34px 0 0; position: relative; }
    .hero-top { display: flex; align-items: flex-start; gap: 18px; font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); }
    .hero-top .line { flex: 1; height: 1px; background: var(--rose); opacity: .6; margin-top: .7em; }
    .hero-top .star { color: var(--rose); margin-top: -.1em; }
    .hero-top .tr { text-align: right; line-height: 1.55; letter-spacing: .22em; }

    .giant { font-family: 'Italiana', 'Cormorant Garamond', Georgia, serif; font-weight: 400; text-transform: uppercase; color: var(--wine);
      font-size: clamp(3.1rem, 10.4vw, 9.4rem); line-height: .98; letter-spacing: .02em; white-space: nowrap; margin: 22px 0 6px;
      position: relative; z-index: 1; }
    .giant span + span { margin-left: .26em; }
    .rule { display: flex; align-items: center; gap: 10px; width: min(46%, 520px); color: var(--rose); font-size: .6rem; margin-bottom: 26px; }
    .rule i { flex: 1; height: 1px; background: var(--rose); opacity: .7; }

    .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 30px; align-items: end; }
    .hero-text { padding-bottom: 54px; align-self: center; }
    .role { display: inline-block; font-size: .86rem; letter-spacing: .3em; text-transform: uppercase; color: var(--rose); margin-bottom: 30px; cursor: default; }
    .pitch { border-left: 1px solid var(--rose); padding-left: 22px; max-width: 360px; font-size: 1.28rem; line-height: 1.5; font-weight: 300; color: var(--wine); }
    .sign { font-family: 'Pinyon Script', 'Snell Roundhand', cursive; font-size: 3.1rem; color: var(--rose-soft); line-height: 1; margin: 34px 0 14px; }
    .based { font-size: .72rem; letter-spacing: .24em; text-transform: uppercase; color: var(--wine); opacity: .8; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

    .pill { display: inline-flex; align-items: center; justify-content: center; padding: 12px 26px; border: 1px solid var(--rose); color: var(--wine);
      font-size: .74rem; letter-spacing: .22em; text-transform: uppercase; border-radius: 999px; transition: background .25s, color .25s; }
    .pill:hover { background: var(--wine); color: var(--cream); border-color: var(--wine); }
    .pill-fill { background: var(--wine); color: var(--cream); border-color: var(--wine); }
    .pill-fill:hover { background: var(--rose); border-color: var(--rose); color: #fff; }
    .pill:focus-visible, a:focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

    .hero-photo { display: flex; justify-content: flex-end; margin-top: -120px; position: relative; }
    .arch { position: relative; width: min(100%, 560px); aspect-ratio: 1 / 1.08; border-radius: 999px 999px 0 0; background: var(--wine-3);
      border: 3px solid var(--rose); border-bottom: 0; overflow: hidden; }
    .arch img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
    .arch.small { width: 100%; max-width: 250px; aspect-ratio: 1 / 1.1; border-width: 2px; }

    /* ---------- bandeau bordeaux + photos ---------- */
    .stitle { display: flex; align-items: center; gap: 18px; font-family: 'Jost', sans-serif; font-weight: 400; font-size: .86rem;
      letter-spacing: .36em; text-transform: uppercase; color: var(--wine); margin-bottom: 30px; line-height: 1.5; }
    .stitle::before, .stitle::after { content: ''; flex: 1; height: 1px; background: var(--rose); opacity: .6; }
    .stitle span { text-align: center; }
    .stitle.light { color: var(--rose-2); }
    .stitle.big { font-size: 1rem; letter-spacing: .32em; }

    .work { background: var(--wine); padding: 42px 0 46px; background-image: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.06), transparent 65%); }
    .work .stitle { width: min(1180px, 92%); margin: 0 auto 30px; }
    .marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
    .track { display: flex; gap: 22px; width: max-content; animation: roll 70s linear infinite; }
    .marquee:hover .track { animation-play-state: paused; }
    .track figure { flex: none; padding: 6px; border: 1px solid var(--rose); }
    .track img { height: 340px; width: 272px; object-fit: cover; display: block; }
    @keyframes roll { to { transform: translateX(-50%); } }

    /* ---------- services ---------- */
    .offer { background: var(--cream); padding: 64px 0 70px; scroll-margin-top: 72px; }
    .offer-grid { display: grid; grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr); gap: 30px; }
    .divider { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--rose); font-size: .6rem; }
    .divider i { flex: 1; width: 1px; background: var(--rose); opacity: .6; }
    .col li + li { margin-top: 6px; }
    .col li a { display: flex; align-items: center; gap: 18px; padding: 14px 10px; border-radius: 10px; transition: background .25s; }
    .col li a:hover { background: var(--cream-2); }
    .ico { display: grid; place-items: center; flex: none; width: 46px; height: 46px; border: 1px solid var(--rose); border-radius: 50%; color: var(--rose); font-size: 1.35rem; }
    .ico svg { width: 55%; height: 55%; display: block; }
    .txt { flex: 1; min-width: 0; }
    .txt b { display: block; font-weight: 500; font-size: .8rem; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); }
    .txt small { display: block; font-size: .92rem; line-height: 1.45; color: #6d4a4d; margin-top: 3px; }
    .price { flex: none; font-family: 'Italiana', Georgia, serif; font-size: 1.3rem; color: var(--rose); white-space: nowrap; }

    /* ---------- contact ---------- */
    .contact { background: var(--wine-2); background-image: radial-gradient(ellipse at 20% 0%, rgba(255,255,255,.07), transparent 60%); color: var(--cream); padding: 52px 0 0; }
    .c-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; padding-bottom: 46px; }
    .c-photo { position: relative; display: flex; justify-content: center; align-items: flex-end; }
    .c-photo .script { position: absolute; left: -2%; bottom: 8%; font-family: 'Pinyon Script', cursive; font-size: 3rem; line-height: 1; color: var(--rose-2); transform: rotate(-6deg); text-shadow: 0 2px 14px rgba(0,0,0,.45); }
    .c-list { padding-left: 34px; border-left: 1px solid rgba(217,164,140,.35); }
    .c-list li { display: flex; align-items: center; gap: 16px; padding: 9px 0; font-size: 1.02rem; }
    .c-list .ico { width: 38px; height: 38px; font-size: 1.1rem; color: var(--rose-2); border-color: var(--rose-soft); }
    .c-list a { color: var(--cream); word-break: break-word; }
    .c-list a:hover { color: var(--rose-2); }
    .c-quote { padding-left: 34px; border-left: 1px solid rgba(217,164,140,.35); }
    .qm { display: block; font-family: 'Italiana', serif; font-size: 3.4rem; line-height: .7; color: var(--rose-2); }
    .c-quote p { font-family: 'Italiana', 'Cormorant Garamond', serif; font-size: 1.7rem; line-height: 1.3; color: var(--cream); margin: 6px 0 22px; }
    .contact .pill { border-color: var(--rose-soft); color: var(--cream); }
    .contact .pill:hover { background: var(--rose); border-color: var(--rose); color: #fff; }
    .contact .pill-fill { background: var(--rose); border-color: var(--rose); color: #fff; }
    .contact .pill-fill:hover { background: var(--cream); border-color: var(--cream); color: var(--wine); }
    .motto { border-top: 1px solid rgba(217,164,140,.3); text-align: center; padding: 14px 4%; font-size: .72rem; letter-spacing: .32em; text-transform: uppercase; color: var(--rose-2); }

    /* ---------- tablette / mobile : même composition que sur ordinateur, en plus petit ---------- */
    @media (max-width: 980px) {
      .hero-photo { margin-top: -70px; }
      .c-grid { grid-template-columns: minmax(0, 1fr); gap: 30px; }
      .c-photo { order: -1; }
      .c-list, .c-quote { padding-left: 0; border-left: 0; }
      .c-quote { text-align: center; }
    }
    @media (max-width: 780px) {
      .hero { padding-top: 16px; }
      .hero-top { font-size: 9px; letter-spacing: .14em; gap: 10px; }
      .hero-top .tr { letter-spacing: .14em; line-height: 1.5; }
      .giant { font-size: 9vw; margin: 14px 0 4px; letter-spacing: .015em; }
      .rule { margin-bottom: 16px; }
      .hero-grid { gap: 12px; }
      .hero-photo { margin-top: -34px; }
      .arch { border-width: 2px; }
      .hero-text { padding-bottom: 20px; }
      .role { font-size: 8.5px; letter-spacing: .16em; margin-bottom: 12px; }
      .pitch { font-size: 12.5px; padding-left: 10px; line-height: 1.45; }
      .sign { font-size: 26px; margin: 14px 0 6px; }
      .based { font-size: 8.5px; letter-spacing: .14em; }
      .hero-actions { flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 14px; }
      .pill { padding: 8px 14px; font-size: 8.5px; letter-spacing: .14em; }

      .stitle { font-size: 9px; letter-spacing: .22em; gap: 10px; margin-bottom: 16px; }
      .stitle.big { font-size: 10px; }
      .work { padding: 24px 0 26px; }
      .track { gap: 10px; }
      .track figure { padding: 3px; }
      .track img { height: 150px; width: 120px; }

      .offer { padding: 34px 0 38px; }
      .offer-grid { grid-template-columns: minmax(0, 1fr) 14px minmax(0, 1fr); gap: 10px; }
      .divider { flex-direction: column; }
      .divider i { width: 1px; height: auto; }
      .col li + li { margin-top: 2px; }
      .col li a { flex-wrap: wrap; gap: 4px 8px; padding: 8px 2px; }
      .ico { width: 26px; height: 26px; }
      .txt { flex: 1 1 60%; }
      .txt b { font-size: 8px; letter-spacing: .12em; }
      .txt small { font-size: 9.5px; line-height: 1.35; }
      .price { flex-basis: 100%; padding-left: 34px; font-size: 13px; }

      .contact { padding-top: 30px; }
      .c-grid { gap: 18px; padding-bottom: 28px; }
      .arch.small { max-width: 150px; }
      .c-photo .script { font-size: 1.9rem; left: 14%; }
      .c-list li { font-size: .85rem; padding: 6px 0; gap: 10px; }
      .c-list .ico { width: 28px; height: 28px; }
      .qm { font-size: 2.2rem; }
      .c-quote p { font-size: 1.15rem; margin-bottom: 14px; }
      .motto { font-size: 8px; letter-spacing: .2em; padding: 10px 4%; }
    }
    @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
  `],
})
export class HomeComponent implements OnDestroy {
  private router = inject(Router);
  private photoClicks = 0;
  private photoTimer?: ReturnType<typeof setTimeout>;
  s = STUDIO;

  weddingItems = [
    { title: 'Soirée homme', icon: 'man', price: SOIREE_PRICING.base,
      text: "Une couverture complète de votre soirée, en photo et en vidéo." },
    { title: 'Soirée femme', icon: 'woman', price: SOIREE_PRICING.base,
      text: 'Une couverture raffinée, des tenues aux plus beaux sourires.' },
    { title: 'Mariage', icon: 'rings', price: SOIREE_PRICING.base,
      text: "De l'arrivée des mariés à la dernière danse." },
  ];

  private shootingIcons: Record<string, string> = { photo: 'camera', photo_video: 'video', preparation: 'sun', preparation_photo: 'camera' };
  shootingItems = SHOOTING_OPTIONS.map((o) => ({ title: o.name, icon: this.shootingIcons[o.id] ?? 'camera', price: o.price, text: o.desc }));

  // 8 photos, répétées deux fois pour un défilement sans coupure
  private photos = [2, 3, 4, 6, 7, 8, 1, 5].map((n) => `assets/photos/photo-${n}.jpg`);
  loop = [...this.photos, ...this.photos];

  // 3 clics rapides sur la ligne « Photographes & vidéastes » = espace monteur
  photoClick() {
    this.photoClicks++;
    clearTimeout(this.photoTimer);
    if (this.photoClicks >= 3) {
      this.photoClicks = 0;
      this.router.navigateByUrl('/monteur');
      return;
    }
    this.photoTimer = setTimeout(() => (this.photoClicks = 0), 1000);
  }

  go(event: Event, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy() {
    clearTimeout(this.photoTimer);
  }
}
