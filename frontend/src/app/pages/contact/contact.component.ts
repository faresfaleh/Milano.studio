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
    <!-- ===== Haut de page ===== -->
    <section class="head">
      <div class="wrap">
        <div class="htop">
          <span class="htl">Nous joindre</span>
          <span class="line"></span>
          <span class="star">✦</span>
          <span class="htr">Appelez-nous<br />Écrivez-nous<br />Rendez-nous visite</span>
        </div>
        <h1 class="giant">Contact</h1>
        <div class="rule"><i></i><b>◆</b><i></i></div>
        <p class="lede">
          Une date à réserver, une question sur nos formules ou un projet sur mesure ? L'équipe de {{ s.name }},
          dirigée par {{ s.president }}, vous répond avec plaisir.
        </p>
      </div>
    </section>

    <!-- ===== Trois façons de nous joindre ===== -->
    <section class="trio-sec">
      <div class="wrap"><app-contact-trio /></div>
    </section>

    <!-- ===== Réseaux sociaux ===== -->
    <section class="band">
      <div class="wrap" appReveal>
        <h2 class="stitle light"><span>Suivez-nous</span></h2>
        <div class="social">
          <a [href]="s.instagram" target="_blank" rel="noopener">Instagram <b>{{ s.instagramHandle }}</b></a>
          <a [href]="s.facebook" target="_blank" rel="noopener">Facebook <b>{{ s.facebookName }}</b></a>
          <a [href]="s.tiktok" target="_blank" rel="noopener">TikTok <b>{{ s.tiktokHandle }}</b></a>
        </div>
      </div>
    </section>

    <!-- ===== Carte ===== -->
    <section class="map-sec">
      <div class="wrap" appReveal>
        <h2 class="stitle"><span>Le studio</span></h2>
        <div class="map">
          <iframe [src]="mapUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Localisation de Milano Studio"></iframe>
          <div class="place">
            <span class="kick">Le studio</span>
            <strong>{{ s.name }} {{ s.tagline }}</strong>
            <a [href]="s.maps" target="_blank" rel="noopener" class="pill pill-fill">Itinéraire Google Maps</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Réserver ===== -->
    <section class="book">
      <div class="wrap book-in" appReveal>
        <div>
          <span class="script">Prêt à réserver ?</span>
          <p>Composez votre formule et découvrez le prix en direct.</p>
        </div>
        <a routerLink="/services" class="pill pill-fill">Voir nos services</a>
      </div>
      <p class="motto">Élégance &nbsp;·&nbsp; Émotion &nbsp;·&nbsp; Souvenirs</p>
    </section>
  `,
  styles: [`
    :host {
      --wine: #4a1622; --wine-2: #3a0f19; --cream: #f7ebe3; --cream-2: #f1e0d5; --rose: #b9795f; --rose-2: #d9a48c; --rose-soft: #c99a86;
      /* palette bordeaux / rose appliquée aussi aux composants enfants */
      --gold: #b9795f; --gold-dark: #a2634b; --gold-soft: rgba(185,121,95,.13); --gold-light: #d9a48c;
      --ink: #4a1622; --bg: #f7ebe3; --card: #fffaf6; --card-2: #f1e0d5; --text: #4a1622;
      --line: rgba(185,121,95,.4); --muted: #6d4a4d; --shadow: 0 12px 30px rgba(74,22,34,.08);
      display: block; overflow-x: clip; background: var(--cream); color: var(--wine); line-height: 1.6;
      font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif; font-weight: 400;
    }
    .wrap { width: min(1180px, 92%); margin: 0 auto; }

    /* ---------- haut de page (comme l'accueil) ---------- */
    .head { padding: 34px 0 8px; }
    .htop { display: flex; align-items: flex-start; gap: 18px; font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); }
    .htop .line { flex: 1; height: 1px; background: var(--rose); opacity: .6; margin-top: .7em; }
    .htop .star { color: var(--rose); margin-top: -.1em; }
    .htr { text-align: right; line-height: 1.55; letter-spacing: .22em; }
    .giant { font-family: 'Italiana', 'Cormorant Garamond', Georgia, serif; font-weight: 400; text-transform: uppercase; color: var(--wine);
      font-size: clamp(3.1rem, 10.4vw, 9.4rem); line-height: .98; letter-spacing: .02em; margin: 22px 0 6px; }
    .rule { display: flex; align-items: center; gap: 10px; width: min(46%, 520px); color: var(--rose); font-size: .6rem; margin-bottom: 26px; }
    .rule i { flex: 1; height: 1px; background: var(--rose); opacity: .7; }
    .lede { border-left: 1px solid var(--rose); padding-left: 22px; max-width: 560px; font-size: 1.2rem; line-height: 1.55; font-weight: 300; color: var(--wine); }

    .trio-sec { padding: 54px 0 70px; }

    .pill { display: inline-flex; align-items: center; justify-content: center; padding: 12px 26px; border: 1px solid var(--rose); color: var(--wine);
      font-size: .74rem; letter-spacing: .22em; text-transform: uppercase; border-radius: 999px; transition: background .25s, color .25s; }
    .pill-fill { background: var(--wine); color: var(--cream); border-color: var(--wine); }
    .pill-fill:hover { background: var(--rose); border-color: var(--rose); color: #fff; }

    .stitle { display: flex; align-items: center; gap: 18px; font-weight: 400; font-size: .86rem; letter-spacing: .36em; text-transform: uppercase; color: var(--wine); margin-bottom: 30px; line-height: 1.5; }
    .stitle::before, .stitle::after { content: ''; flex: 1; height: 1px; background: var(--rose); opacity: .6; }
    .stitle span { text-align: center; }
    .stitle.light { color: var(--rose-2); }

    /* ---------- bandeau bordeaux : réseaux ---------- */
    .band { background: var(--wine); background-image: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.06), transparent 65%); padding: 46px 0 52px; }
    .social { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
    .social a { padding: 14px 28px; border: 1px solid var(--rose-soft); border-radius: 999px; color: var(--cream); font-size: .74rem; letter-spacing: .2em; text-transform: uppercase; transition: .25s; }
    .social a b { font-weight: 400; color: var(--rose-2); margin-left: 8px; letter-spacing: .08em; text-transform: none; font-size: .95rem; }
    .social a:hover { background: var(--cream); border-color: var(--cream); color: var(--wine); }
    .social a:hover b { color: var(--rose); }

    /* ---------- carte ---------- */
    .map-sec { padding: 64px 0 70px; }
    .map { position: relative; border: 1px solid var(--rose); border-radius: 22px; overflow: hidden; box-shadow: var(--shadow); background: var(--card); }
    iframe { display: block; width: 100%; height: 440px; border: 0; }
    .place { position: absolute; left: 22px; bottom: 22px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start;
      background: rgba(255,250,246,.96); border: 1px solid var(--line); border-radius: 16px; padding: 20px 24px; box-shadow: var(--shadow); max-width: calc(100% - 44px); }
    .kick { font-size: .68rem; letter-spacing: .28em; text-transform: uppercase; color: var(--rose); }
    .place strong { font: 400 1.4rem 'Italiana', Georgia, serif; color: var(--wine); margin-bottom: 4px; }

    /* ---------- réserver ---------- */
    .book { background: var(--wine-2); background-image: radial-gradient(ellipse at 20% 0%, rgba(255,255,255,.07), transparent 60%); color: var(--cream); padding: 56px 0 0; }
    .book-in { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 26px; padding-bottom: 50px; }
    .script { display: block; font-family: 'Pinyon Script', cursive; font-size: 3.2rem; line-height: 1; color: var(--rose-2); margin-bottom: 8px; }
    .book p { color: rgba(247,235,227,.8); }
    .book .pill-fill { background: var(--rose); border-color: var(--rose); color: #fff; }
    .book .pill-fill:hover { background: var(--cream); border-color: var(--cream); color: var(--wine); }
    .motto { border-top: 1px solid rgba(217,164,140,.3); text-align: center; padding: 14px 4%; font-size: .72rem; letter-spacing: .32em; text-transform: uppercase; color: var(--rose-2); }

    @media (max-width: 780px) {
      .giant { font-size: clamp(3.4rem, 19vw, 6rem); line-height: 1; }
      .htr, .htop .star { display: none; }
      .rule { width: 70%; }
      .lede { font-size: 1.08rem; }
      .trio-sec { padding: 40px 0 52px; }
      .stitle { letter-spacing: .24em; gap: 12px; }
      .book-in { flex-direction: column; align-items: flex-start; }
    }
    @media (max-width: 560px) { iframe { height: 340px; } .place { position: static; max-width: none; border-radius: 0; border-width: 1px 0 0; box-shadow: none; } }
  `],
})
export class ContactComponent {
  s = STUDIO;
  mapUrl: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://www.google.com/maps?q=${STUDIO.lat},${STUDIO.lng}&z=16&output=embed`
  );
}
