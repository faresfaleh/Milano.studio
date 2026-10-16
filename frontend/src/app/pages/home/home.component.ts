import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
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
    <!-- ===== Accueil : au défilement, le titre grandit puis on passe aux services ===== -->
    <div class="scroller" #scroller>
      <section class="stage" #stage>
        <div class="container hero">
          <div class="copy">
            <span class="kicker fade">{{ s.name }} · {{ s.tagline }}</span>
            <h1>Nous racontons vos plus beaux moments, <span class="it">à travers l'objectif.</span></h1>
            <div class="rule fade"></div>
            <p class="lead fade">
              Photographie et vidéo d'événements : {{ s.name }} accompagne vos mariages, vos soirées et vos
              séances photo avec sensibilité, exigence et un souci constant du détail.
            </p>
            <div class="actions fade">
              <a routerLink="/services" class="btn btn-dark">Réserver maintenant</a>
              <a href="#services" class="btn btn-outline" (click)="go($event, 'services')">Nos services</a>
            </div>
          </div>

          <div class="badge fade" aria-hidden="true" (click)="photoClick()">
            <div class="photo">
              <img class="logo" src="assets/logo-icon.png" alt="" />
            </div>
            <svg viewBox="0 0 400 400" class="ring">
              <defs><path id="circ" d="M200,200 m-160,0 a160,160 0 1,1 320,0 a160,160 0 1,1 -320,0" /></defs>
              <text><textPath href="#circ" textLength="1000" lengthAdjust="spacing">MILANO STUDIO · PHOTOGRAPHY · MILANO STUDIO · PHOTOGRAPHY · </textPath></text>
            </svg>
          </div>
        </div>
        <div class="hint">Faites défiler<span>↓</span></div>
      </section>
    </div>

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

    <!-- ===== Pourquoi nous choisir ===== -->
    <section class="why">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">Pourquoi nous choisir</span>
          <h2>L'exigence <span class="it">au service</span> de vos souvenirs</h2>
          <p>Trois engagements qui guident chacune de nos prestations.</p>
        </div>
        <div class="pillars" appReveal>
          <article>
            <span class="n">01</span>
            <h3>Un regard artistique</h3>
            <p>Nous saisissons l'émotion sur le vif : un regard, un rire, un geste. Vos images racontent votre journée telle que vous l'avez vécue.</p>
          </article>
          <article>
            <span class="n">02</span>
            <h3>Un équipement professionnel</h3>
            <p>Caméras vidéo, appareil photo, drone, girafe, régie et écran : nous composons le dispositif qui correspond à votre événement.</p>
          </article>
          <article>
            <span class="n">03</span>
            <h3>Une réservation simple</h3>
            <p>Choisissez votre formule, découvrez le prix en direct et réservez en ligne. Notre équipe vous confirme votre date rapidement.</p>
          </article>
        </div>
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
    /* ---------- écran d'accueil ---------- */
    .scroller { position: relative; height: 230vh; background: var(--bg); }
    .stage { position: sticky; top: 72px; height: calc(100vh - 72px); display: flex; align-items: center; overflow: hidden;
      --p: 0; --grow: .32;
      background: radial-gradient(ellipse at 80% 42%, rgba(184,146,79,.20), transparent 55%), var(--bg); }
    .hero { display: grid; grid-template-columns: 1.25fr .75fr; gap: 48px; align-items: center; }
    .kicker { display: block; font-size: .85rem; letter-spacing: .26em; text-transform: uppercase; font-weight: 700; color: var(--gold-dark); margin-bottom: 22px; }
    h1 { font-size: clamp(3rem, min(6.2vw, 10vh), 5.4rem); font-weight: 500; line-height: 1.02; margin-bottom: 26px;
      transform-origin: left top; transform: scale(calc(1 + var(--p) * var(--grow))); will-change: transform; }
    .rule { width: 56px; height: 2px; background: var(--gold); margin-bottom: 22px; }
    .lead { color: var(--muted); font-size: 1.25rem; max-width: 520px; margin-bottom: 34px; }
    .actions { display: flex; gap: 14px; flex-wrap: wrap; }
    .fade { opacity: calc(1 - var(--p) * 2.2); transform: translateY(calc(var(--p) * -36px)); }
    .stage.late .fade { pointer-events: none; }

    .badge { position: relative; width: min(420px, 100%); aspect-ratio: 1; justify-self: center; }
    .photo { position: absolute; inset: 14%; border-radius: 50%; overflow: hidden; background: #efe5d1;
      box-shadow: 0 0 0 1px rgba(184,146,79,.7), 0 30px 60px rgba(150,112,42,.25); }
    .logo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 14%; }
    .ring { position: absolute; inset: 0; width: 100%; height: 100%; animation: spin 60s linear infinite; }
    .ring text { font: 700 21px 'Cormorant Garamond', Georgia, serif; fill: var(--gold-dark); }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .ring { animation: none; } }

    .hint { position: absolute; left: 0; right: 0; bottom: 28px; text-align: center; color: var(--gold-dark); font-size: .8rem;
      letter-spacing: .26em; text-transform: uppercase; font-weight: 700; opacity: calc(1 - var(--p) * 4); }
    .hint span { display: block; font-size: 1.3rem; animation: bob 1.6s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }

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

    /* ---------- pourquoi nous choisir ---------- */
    .why { padding: 100px 0 90px; background: var(--bg); }
    .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    .pillars article { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 6px; padding: 44px 34px 38px; box-shadow: var(--shadow); transition: .3s; overflow: hidden; }
    .pillars article::before { content: ''; position: absolute; left: 0; top: 0; height: 3px; width: 100%; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .4s; }
    .pillars article:hover { transform: translateY(-4px); }
    .pillars article:hover::before { transform: scaleX(1); }
    .n { display: block; font: 500 3rem 'Cormorant Garamond', Georgia, serif; font-style: italic; color: var(--gold); line-height: 1; margin-bottom: 14px; }
    .pillars h3 { font: 700 1.1rem 'Cormorant Garamond', Georgia, serif; letter-spacing: .16em; text-transform: uppercase; margin-bottom: 12px; }
    .pillars p { color: var(--muted); font-size: 1.05rem; line-height: 1.6; }

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
      .pillars { grid-template-columns: 1fr; }
      .cols { grid-template-columns: repeat(2, 1fr); }
      .col:nth-child(3) { border-left: 0; }
      .col:nth-child(n+3) { border-top: 1px solid var(--line); }
    }
    @media (max-width: 860px) {
      /* téléphone : accueil en simple page (pas d'effet de défilement), tout est visible */
      .scroller { height: auto; }
      .stage { position: relative; top: auto; height: auto; min-height: calc(100svh - 72px); padding: 28px 0 56px; align-items: flex-start; }
      .hero { grid-template-columns: 1fr; gap: 18px; }
      .badge { width: 230px; order: -1; }
      .fade { opacity: 1; transform: none; }
      h1 { transform: none; font-size: clamp(2.5rem, 11vw, 3.6rem); margin-bottom: 20px; }
      .kicker { font-size: .72rem; margin-bottom: 14px; }
      .lead { font-size: 1.08rem; margin-bottom: 26px; }
      .hint { display: none; }
      .about-grid { grid-template-columns: 1fr; gap: 40px; }
    }
    @media (max-width: 560px) { .cols { grid-template-columns: 1fr; } .col { border-left: 0; border-top: 1px solid var(--line); } .col:first-child { border-top: 0; } }
  `],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private zone = inject(NgZone);
  private router = inject(Router);
  private photoClicks = 0;
  private photoTimer?: ReturnType<typeof setTimeout>;
  s = STUDIO;
  fromSoiree = SOIREE_PRICING.base;
  fromShooting = Math.min(...SHOOTING_OPTIONS.map((o) => o.price));

  @ViewChild('scroller') scroller!: ElementRef<HTMLElement>;
  @ViewChild('stage') stage!: ElementRef<HTMLElement>;

  private onScroll?: () => void;
  private ticking = false;

  // 3 clics rapides sur le cercle = espace monteur
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

  ngAfterViewInit() {
    const scroller = this.scroller.nativeElement;
    const stage = this.stage.nativeElement;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 860px)').matches) {
      scroller.style.height = 'auto';
      stage.style.position = 'relative';
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.onScroll = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.ticking = false;
          const total = scroller.offsetHeight - stage.offsetHeight;
          const p = Math.min(1, Math.max(0, (72 - scroller.getBoundingClientRect().top) / total));
          stage.style.setProperty('--p', p.toFixed(3));
          stage.classList.toggle('late', p > 0.4);
        });
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  ngOnDestroy() {
    clearTimeout(this.photoTimer);
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
  }
}
