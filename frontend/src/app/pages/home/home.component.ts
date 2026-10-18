import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SHOOTING_OPTIONS, SOIREE_PRICING, STUDIO } from '../../studio.config';
import { IconComponent } from '../../components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { ContactTrioComponent } from '../../components/contact-trio/contact-trio.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective, ContactTrioComponent, IconComponent],
  template: `
    <!-- ===== Accueil ===== -->
    <section class="home">
      <div class="container home-in">
        <p class="home-tag" (click)="photoClick()">Photographie &amp; vidéo d'événements, avec élégance</p>
        <h1 class="home-title">Capturer les moments<br />qui vous coupent<br />le souffle</h1>
        <div class="home-cols">
          <p>
            Le jour de votre mariage est fait de mille instants fugaces : un regard avant l'entrée,
            un rire entre amis, une main qui serre la vôtre. Ce sont ces détails, plus que tout,
            qui racontent votre histoire.
          </p>
          <p>
            Chez {{ s.name }}, nous les saisissons avec discrétion et sensibilité, pour vous livrer
            des souvenirs que vous aimerez retrouver, aujourd'hui comme dans vingt ans.
          </p>
        </div>
        <div class="home-actions">
          <a routerLink="/services" class="btn btn-dark">Réserver maintenant</a>
          <a href="#services" class="btn btn-outline" (click)="go($event, 'services')">Nos services</a>
        </div>
      </div>

      <!-- Photos qui défilent en continu -->
      <div class="marquee" aria-hidden="true">
        <div class="track">
          @for (ph of loop; track $index) {
            <img [src]="ph" alt="" loading="lazy" />
          }
        </div>
      </div>
    </section>

    <!-- ===== À propos ===== -->
    <section class="about" id="apropos">
      <div class="container about-grid">
        <div appReveal>
          <span class="label">À propos</span>
          <h2>Bien plus que des photos, <span class="it">des histoires à vivre.</span></h2>
          <p>
            Chez {{ s.name }}, chaque événement est une histoire unique. Notre équipe, dirigée par
            {{ s.president }}, met son regard et son savoir-faire au service de vos moments les plus précieux,
            du premier préparatif à la dernière danse.
          </p>
          <p>
            Nous associons sens de l'image, équipement professionnel et écoute attentive pour vous livrer
            des souvenirs dont vous serez fiers, aujourd'hui comme dans vingt ans.
          </p>
          <a routerLink="/contact" class="btn btn-dark">Nous contacter</a>
        </div>
        <ul class="facts" appReveal>
          <li><span>Président</span><b>{{ s.president }}</b></li>
          <li><span>Prestations</span><b>Mariages, soirées & shootings</b></li>
          <li><span>Équipement</span><b>Caméras, appareil photo, drone, girafe, régie & écran</b></li>
        </ul>
      </div>
    </section>

    <!-- ===== Services ===== -->
    <section class="services" id="services">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">Nos services</span>
          <h2>Ce que nous faisons <span class="it">pour vous</span></h2>
          <p>Des formules sur mesure, avec des options à composer selon vos envies et votre budget.</p>
        </div>

        <div class="cols" appReveal>
          <a class="col" routerLink="/services" [queryParams]="{ partie: 'mariage' }">
            <app-icon name="man" class="ico" />
            <h3>Soirée homme</h3>
            <p>Une couverture complète de votre soirée, en photo et en vidéo, pour en garder chaque instant.</p>
            <span class="from">À partir de <b>{{ fromSoiree }} DT</b></span>
            <span class="more">Découvrir →</span>
          </a>
          <a class="col" routerLink="/services" [queryParams]="{ partie: 'mariage' }">
            <app-icon name="woman" class="ico" />
            <h3>Soirée femme</h3>
            <p>Une couverture raffinée et attentive au moindre détail, des tenues aux plus beaux sourires.</p>
            <span class="from">À partir de <b>{{ fromSoiree }} DT</b></span>
            <span class="more">Découvrir →</span>
          </a>
          <a class="col" routerLink="/services" [queryParams]="{ partie: 'mariage' }">
            <app-icon name="rings" class="ico" />
            <h3>Mariage</h3>
            <p>Le plus beau jour de votre vie, raconté avec émotion et élégance, de l'arrivée des mariés à la dernière danse.</p>
            <span class="from">À partir de <b>{{ fromSoiree }} DT</b></span>
            <span class="more">Découvrir →</span>
          </a>
          <a class="col" routerLink="/services" [queryParams]="{ partie: 'shooting' }">
            <app-icon name="camera" class="ico" />
            <h3>Shooting</h3>
            <p>Une séance rien que pour vous : portrait, couple, famille ou séance de mariage, avec ou sans vidéo.</p>
            <span class="from">À partir de <b>{{ fromShooting }} DT</b></span>
            <span class="more">Découvrir →</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Contact ===== -->
    <section class="cta">
      <div class="container">
        <div class="head" appReveal>
          <span class="label">Contact</span>
          <h2>Créons ensemble <span class="it">quelque chose de beau.</span></h2>
          <p>Une date en tête, une question, un projet particulier ? Parlez-nous de votre événement : nous vous répondons rapidement.</p>
        </div>
        <app-contact-trio />
        <div class="go-res"><a routerLink="/services" class="btn btn-red">Réserver maintenant</a></div>
      </div>
    </section>
  `,
  styles: [`
    /* ---------- accueil ---------- */
    .home { background: var(--bg); padding: 96px 0 0; text-align: center; overflow: hidden; }
    .home-in { max-width: 920px; }
    .home-tag { display: inline-block; font-style: italic; font-weight: 400; font-size: 1.45rem; color: var(--gold-dark); margin-bottom: 26px; cursor: default; }
    .home-title { font-weight: 300; text-transform: uppercase; letter-spacing: .035em; line-height: 1.12;
      font-size: clamp(2.3rem, 6vw, 4.4rem); color: var(--ink); margin-bottom: 52px; }
    .home-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; max-width: 700px; margin: 0 auto 40px; text-align: left; }
    .home-cols p { font-size: 1.02rem; font-weight: 500; line-height: 1.8; color: var(--muted); margin: 0; }
    .home-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
    .marquee { margin-top: 72px; padding-bottom: 72px; overflow: hidden;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
      mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
    .track { display: flex; gap: 16px; width: max-content; animation: roll 60s linear infinite; }
    .marquee:hover .track { animation-play-state: paused; }
    .track img { height: 360px; width: 270px; object-fit: cover; border-radius: 6px; flex: none; }
    @keyframes roll { to { transform: translateX(-50%); } }
    @media (prefers-reduced-motion: reduce) { .track { animation: none; } }

    /* ---------- à propos ---------- */
    .label { display: block; font-size: .8rem; letter-spacing: .26em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); margin-bottom: 18px; }
    .about { padding: 110px 0; background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .about-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 80px; align-items: center; }
    .about h2 { font-size: clamp(2.4rem, 4.6vw, 3.6rem); font-weight: 500; margin-bottom: 22px; }
    .about p { color: var(--muted); font-size: 1.2rem; margin-bottom: 32px; max-width: 540px; }
    .facts { list-style: none; border-top: 1px solid var(--line); }
    .facts li { display: flex; flex-direction: column; gap: 2px; padding: 22px 0; border-bottom: 1px solid var(--line); }
    .facts span { font-size: .78rem; letter-spacing: .22em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); }
    .facts b { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 600; }

    .about p + p { margin-top: -12px; }
    .facts b { line-height: 1.25; }

    /* ---------- services ---------- */
    .services { padding: 100px 0; background: var(--bg); scroll-margin-top: 72px; }
    .cols { display: grid; grid-template-columns: repeat(4, 1fr); background: #fff; border: 1px solid var(--line); border-radius: 6px; box-shadow: var(--shadow); }
    .col { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 44px 26px; border-left: 1px solid var(--line); transition: background .3s; }
    .col:first-child { border-left: 0; }
    .col:hover { background: var(--bg); }
    .ico { display: block; width: 52px; height: 52px; color: var(--gold-dark); margin: 0 auto 22px; }
    .col h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.05rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 14px; }
    .col p { color: var(--muted); font-size: .98rem; line-height: 1.55; margin-bottom: 18px; flex: 1; }
    .from { font-size: .9rem; color: var(--muted); margin-bottom: 14px; padding-top: 14px; border-top: 1px solid var(--line); width: 100%; }
    .from b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: var(--gold-dark); }
    .more { color: var(--gold-dark); font-weight: 700; font-size: .85rem; letter-spacing: .16em; text-transform: uppercase; }

    /* ---------- contact ---------- */
    .cta { padding: 100px 0; background: radial-gradient(ellipse at 50% 0%, rgba(184,146,79,.22), transparent 60%), var(--ink); text-align: center; color: #fff; }
    .cta .label { color: var(--gold-light); }
    .cta h2 .it { color: var(--gold-light); }
    .head { margin-bottom: 44px; }
    .go-res { margin-top: 44px; }
    .cta h2 { font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 500; margin-bottom: 14px; }
    .cta p { color: rgba(255,255,255,.72); font-size: 1.2rem; max-width: 620px; margin: 0 auto; }
    .callrow { display: flex; flex-wrap: wrap; gap: 10px 32px; justify-content: center; margin-bottom: 32px; font-weight: 700; }
    .callrow a:hover { color: var(--gold-dark); }

    @media (max-width: 960px) {
      .cols { grid-template-columns: repeat(2, 1fr); }
      .col:nth-child(3) { border-left: 0; }
      .col:nth-child(n+3) { border-top: 1px solid var(--line); }
    }
    @media (max-width: 860px) {
      .home { padding-top: 56px; }
      .home-tag { font-size: 1.2rem; }
      .home-title { margin-bottom: 32px; }
      .home-cols { grid-template-columns: 1fr; gap: 20px; }
      .marquee { margin-top: 48px; padding-bottom: 48px; }
      .track img { height: 260px; width: 195px; }
      .about-grid { grid-template-columns: 1fr; gap: 40px; }
    }
    @media (max-width: 560px) { .cols { grid-template-columns: 1fr; } .col { border-left: 0; border-top: 1px solid var(--line); } .col:first-child { border-top: 0; } }
  `],
})
export class HomeComponent implements OnDestroy {
  private router = inject(Router);
  private photoClicks = 0;
  private photoTimer?: ReturnType<typeof setTimeout>;
  s = STUDIO;
  fromSoiree = SOIREE_PRICING.base;
  fromShooting = Math.min(...SHOOTING_OPTIONS.map((o) => o.price));

  // 8 photos, répétées deux fois pour un défilement sans coupure
  private photos = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `assets/photos/photo-${n}.jpg`);
  loop = [...this.photos, ...this.photos];

  // 3 clics rapides sur le phrase dorée en italique en haut de l’accueil = espace monteur
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
