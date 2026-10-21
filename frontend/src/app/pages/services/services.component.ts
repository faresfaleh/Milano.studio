import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_SOIREE_OPTIONS, EVENT_INFO, EVENT_TYPES, INCLUDED_ALL, SHOOTING_OPTIONS, SHOOTING_TYPES, SOIREE_EXTRAS, SOIREE_PRICING, SoireeOptions, soireePrice, soireeSummary } from '../../studio.config';
import { IconComponent } from '../../components/icon/icon.component';
import { RevealDirective } from '../../directives/reveal.directive';
import { ReservationFormComponent } from '../../components/reservation-form/reservation-form.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ReservationFormComponent, RevealDirective, IconComponent],
  template: `
    <!-- ===== Haut de page ===== -->
    <section class="head">
      <div class="wrap">
        <div class="htop">
          <span class="htl">Nos prestations</span>
          <span class="line"></span>
          <span class="star">✦</span>
          <span class="htr">Mariages<br />Soirées<br />Shootings</span>
        </div>
        <h1 class="giant">Nos services</h1>
        <div class="rule"><i></i><b>◆</b><i></i></div>
        <p class="lede">
          Photographie et vidéo professionnelles pour vos mariages, vos soirées et vos séances.
          Composez votre formule, découvrez le prix en direct et réservez en quelques clics.
        </p>
      </div>
    </section>

    <section class="main">
      <div class="wrap">
        <div class="parts" id="choix">
          <button type="button" [class.on]="partie === 'mariage'" (click)="partie = 'mariage'"><app-icon name="rings" size="1.35em" /> Mariage &amp; soirées</button>
          <button type="button" [class.on]="partie === 'shooting'" (click)="partie = 'shooting'"><app-icon name="camera" size="1.35em" /> Shooting</button>
        </div>

        @if (partie === 'mariage') {
          <!-- ============ MARIAGE & SOIRÉES : 1) soirée, 2) options, 3) réservation ============ -->
          <ol class="steps">
            <li [class.done]="!!eventType" class="cur1"><span>1</span> Choisissez votre soirée</li>
            <li [class.cur]="!!eventType"><span>2</span> Composez votre formule</li>
            <li><span>3</span> Réservez votre date</li>
          </ol>

          <ul class="plist types" appReveal>
            @for (t of eventTypes; track t.id) {
              <li>
                <button type="button" class="type" [class.sel]="eventType === t.id" (click)="selectType(t.id)">
                  <span class="pic"><app-icon [name]="icons[t.id]" size="1.5rem" /></span>
                  <span class="txt"><strong class="tl">{{ t.label }}</strong><span class="td">{{ info[t.id] }}</span></span>
                  <span class="from">À partir de <b>{{ pricing.base }} DT</b></span>
                </button>
              </li>
            }
          </ul>

          @if (eventType) {
            <div class="conf" id="conf">
              <div class="opts">
                <h3>Composez votre <em class="it">formule</em></h3>
                <p class="sub">Personnalisez la couverture de votre soirée : le prix se met à jour à chaque choix.</p>

                <div class="grp">
                  <span class="gi"><app-icon name="video" size="2.1rem" /></span>
                  <div class="gh">
                    <strong>Caméras vidéo</strong>
                    <span>La première caméra est incluse, chaque caméra en plus : <b>+{{ pricing.camera }} DT</b>.</span>
                  </div>
                  <div class="seg gold">
                    @for (n of cameraChoices; track n) {
                      <button type="button" [class.on]="options.cameras === n" (click)="options.cameras = n">{{ n }}</button>
                    }
                  </div>
                </div>

                @for (x of extras; track x.key) {
                  <div class="grp">
                    <span class="gi"><app-icon [name]="extraIcons[x.key]" size="2.1rem" /></span>
                    <div class="gh">
                      <strong>{{ x.name }} <small>+{{ x.price }} DT</small></strong>
                      <span>{{ x.desc }}</span>
                    </div>
                    <div class="seg">
                      <button type="button" [class.on]="options[x.key] === 0" (click)="options[x.key] = 0">Non</button>
                      <button type="button" [class.on]="options[x.key] === 1" (click)="options[x.key] = 1">Oui</button>
                    </div>
                  </div>
                }
              </div>

              <div class="mbar">
                <div class="mt"><span>Total</span><strong>{{ total }} <small>DT</small></strong></div>
                <button type="button" (click)="modal = 'soiree'">Réserver <app-icon name="arrow" size="1.1rem" /></button>
              </div>

              <aside class="recap">
                <span class="kick">Votre formule</span>
                <h4>{{ typeLabel }}</h4>

                <ul class="incl-list">
                  <li><app-icon name="camera" size="1.7rem" /> 1 appareil photo</li>
                  <li><app-icon name="video" size="1.7rem" /> {{ options.cameras }} caméra{{ options.cameras > 1 ? 's' : '' }} vidéo</li>
                  <li><app-icon name="sun" size="1.7rem" /> {{ included.join(' & ') }}</li>
                  @for (x of extras; track x.key) {
                    @if (options[x.key]) { <li><app-icon [name]="extraIcons[x.key]" size="1.7rem" /> {{ x.name }}</li> }
                  }
                </ul>

                <div class="lines">
                  @for (l of lines; track l.label) {
                    <div><span>{{ l.label }}</span><b>{{ l.price }} DT</b></div>
                  }
                </div>

                <div class="tot"><span>Total</span><strong>{{ total }} <small>DT</small></strong></div>
                <p class="nt">Prix sans transport</p>
                <button type="button" class="go" (click)="modal = 'soiree'">
                  <app-icon name="calendar" size="1.4rem" /> <span>Réserver cette formule</span> <app-icon name="arrow" size="1.2rem" />
                </button>
                <p class="soon"><app-icon name="shield" size="1.1rem" /><span>Réservation confirmée par notre équipe sous peu.</span></p>
              </aside>
            </div>
          } @else {
            <p class="hint">Sélectionnez un type de soirée pour composer votre formule.</p>
          }
          <p class="note"><app-icon name="calendar" size="1.1em" /> Un nombre maximum de soirées est accepté par jour : une date complète n'est plus disponible.</p>

          @if (modal === 'soiree') {
            <app-reservation-form [category]="'soiree'" [eventType]="eventType" [options]="options" (closed)="modal = null" />
          }
        } @else {
          <!-- ============ SHOOTING : individuel et mariage ============ -->
          <p class="incl">Mêmes choix et mêmes prix pour les deux types de shooting</p>
          <div class="grid two" appReveal>
            @for (t of shootingTypes; track t.id) {
              <div class="prop">
                <h3 class="stl"><span>{{ t.name }}</span></h3>
                <p class="sub">{{ t.desc }}</p>
                <ul class="plist rows">
                  @for (o of shootingOptions; track o.id) {
                    <li>
                      <button type="button" class="opt" [class.sel]="shootingType === t.id && shootingOption === o.id" (click)="chooseShoot(t.id, o.id)">
                        <span class="nm"><strong>{{ o.name }}</strong><small>{{ o.desc }}</small></span>
                        <b>{{ o.price }} DT</b>
                      </button>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          @if (modal === 'shooting') {
            <app-reservation-form [category]="'shooting'" [shootingType]="shootingType" [shootingOption]="shootingOption" (closed)="modal = null" />
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      --wine: #4a1622; --wine-2: #3a0f19; --wine-3: #5a1f2c;
      --cream: #f7ebe3; --cream-2: #f1e0d5;
      --rose: #b9795f; --rose-2: #d9a48c; --rose-soft: #c99a86;
      /* on réutilise les variables du site avec la palette bordeaux / rose (les fenêtres de réservation suivent aussi) */
      --gold: #b9795f; --gold-dark: #a2634b; --gold-soft: rgba(185,121,95,.13); --gold-light: #d9a48c;
      --ink: #4a1622; --ink-2: #3a0f19; --bg: #f7ebe3; --bg-soft: #f1e0d5; --card: #fffaf6; --card-2: #f1e0d5;
      --text: #4a1622; --line: rgba(185,121,95,.4); --muted: #6d4a4d; --shadow: 0 12px 30px rgba(74,22,34,.08);
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

    .main { padding: 44px 0 90px; }

    /* choix Mariage & soirées / Shooting */
    .parts { scroll-margin-top: 84px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 0 auto 38px; }
    .parts button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 28px; background: transparent; color: var(--wine);
      border: 1px solid var(--rose); border-radius: 999px; cursor: pointer; font: 400 .76rem 'Jost', sans-serif; letter-spacing: .22em; text-transform: uppercase; transition: background .25s, color .25s; }
    .parts button:hover { background: var(--cream-2); }
    .parts button.on { background: var(--wine); color: var(--cream); border-color: var(--wine); }

    /* étapes */
    .steps { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px 34px; list-style: none; margin-bottom: 38px; color: var(--muted); font-size: .76rem; letter-spacing: .18em; text-transform: uppercase; }
    .steps li { display: flex; align-items: center; gap: 12px; }
    .steps span { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--rose); background: transparent; color: var(--rose); font: 400 1rem 'Italiana', serif; letter-spacing: 0; }
    .steps li.cur1, .steps li.cur { color: var(--wine); }
    .steps li.cur1 span, .steps li.cur span { background: var(--gold-soft); color: var(--wine); }
    .steps li.done span { background: var(--rose); border-color: var(--rose); color: #fff; }

    /* ===== Même style « pilule » que l'accueil ===== */
    .plist { list-style: none; }
    .plist li { position: relative; }
    .plist li + li { margin-top: 18px; }
    .plist li::before { content: ''; position: absolute; left: 7%; right: 7%; top: -7px; height: 60%; border-radius: 999px; background: var(--rose-soft); opacity: .28; z-index: 0; }
    .type, .opt, .grp { background: linear-gradient(180deg, #fcf3ec, #f2e1d6); border: 1px solid rgba(185,121,95,.35);
      box-shadow: 0 10px 22px rgba(74,22,34,.10), inset 0 1px 0 rgba(255,255,255,.8); }
    .type, .opt { position: relative; z-index: 1; width: 100%; text-align: left; cursor: pointer; font: inherit; color: var(--wine); border-radius: 999px;
      transition: background .3s, box-shadow .3s, transform .3s, border-color .3s; }
    .type:hover, .opt:hover, .type.sel, .opt.sel { background: var(--wine); border-color: var(--wine); box-shadow: 0 16px 30px rgba(74,22,34,.28); }
    .type:hover, .opt:hover { transform: translateY(-3px); }

    .types { margin-bottom: 38px; }
    .type { display: flex; align-items: center; gap: 18px; padding: 16px 34px 16px 16px; }
    .pic { width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--rose); color: var(--rose); display: grid; place-items: center; flex: none; transition: .3s; }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .tl { font: 500 .8rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); }
    .td { color: #6d4a4d; font-size: .95rem; line-height: 1.45; }
    .from { flex: none; text-align: right; font-size: .7rem; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
    .from b { display: block; color: var(--rose); font: 400 1.4rem 'Italiana', Georgia, serif; letter-spacing: .02em; margin-top: 2px; }
    .type:hover .tl, .type.sel .tl, .opt:hover strong, .opt.sel strong { color: var(--cream); }
    .type:hover .td, .type.sel .td, .type:hover .from, .type.sel .from, .opt:hover small, .opt.sel small { color: #ead3c8; }
    .type:hover .pic, .type.sel .pic { border-color: var(--rose-soft); color: var(--rose-2); }
    .type:hover .from b, .type.sel .from b, .opt:hover b, .opt.sel b { color: var(--rose-2); }

    /* composition de la formule */
    .conf { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; align-items: start; animation: up .45s ease both; scroll-margin-top: 90px; margin-top: 8px; }
    @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    .opts { padding: 8px 0 6px; }
    .opts h3 { font: 400 clamp(2.2rem, 4.2vw, 3.1rem)/1.1 'Italiana', Georgia, serif; text-transform: uppercase; letter-spacing: .02em; color: var(--wine); margin-bottom: 14px; }
    .opts h3 .it { font: 400 1.2em/1 'Pinyon Script', cursive; text-transform: none; letter-spacing: 0; color: var(--rose); }
    .sub { color: var(--muted); font-size: 1.05rem; margin-bottom: 26px; }
    .grp { display: grid; grid-template-columns: 52px 1fr auto; align-items: center; gap: 20px; padding: 16px 20px 16px 22px; margin-top: 16px; border-radius: 999px; }
    .gi { color: var(--rose); display: grid; place-items: center; }
    .gh { display: flex; flex-direction: column; gap: 4px; }
    .gh strong { font: 500 .84rem 'Jost', sans-serif; letter-spacing: .24em; text-transform: uppercase; color: var(--wine); }
    .gh strong small { margin-left: 12px; font: 400 1.1rem 'Italiana', Georgia, serif; letter-spacing: .02em; color: var(--rose); text-transform: none; }
    .gh span { color: var(--muted); font-size: .96rem; line-height: 1.45; max-width: 400px; }
    .gh span b { color: var(--rose); font-weight: 500; }
    .seg { display: flex; flex: none; padding: 4px; gap: 2px; background: rgba(255,255,255,.55); border: 1px solid var(--line); border-radius: 999px; }
    .seg button { min-width: 58px; padding: 10px 20px; background: transparent; border: 0; border-radius: 999px; cursor: pointer;
      font: 400 .9rem 'Jost', sans-serif; letter-spacing: .08em; color: var(--muted); transition: .18s; }
    .seg button:hover { color: var(--wine); }
    .seg button.on { background: var(--wine); color: var(--cream); }
    .seg.gold button.on { background: var(--rose); color: #fff; }

    .recap { position: sticky; top: 92px; color: var(--cream); border-radius: 22px; padding: 40px 36px 28px; border: 1px solid rgba(217,164,140,.45);
      background: radial-gradient(ellipse at 100% 0%, rgba(255,255,255,.09), transparent 50%), var(--wine-2);
      box-shadow: 0 28px 60px rgba(58,15,25,.32); }
    .kick { display: flex; align-items: center; gap: 12px; font-size: .72rem; letter-spacing: .28em; text-transform: uppercase; color: var(--rose-2); margin-bottom: 10px; }
    .kick::before { content: ''; width: 20px; height: 1px; background: var(--rose-2); }
    .recap h4 { font: 400 2.5rem/1.1 'Italiana', Georgia, serif; text-transform: uppercase; margin-bottom: 26px; color: var(--cream); }
    .incl-list { list-style: none; display: grid; gap: 16px; margin-bottom: 26px; }
    .incl-list li { display: flex; align-items: center; gap: 16px; color: rgba(247,235,227,.92); font-size: 1.02rem; }
    .incl-list app-icon { color: var(--rose-2); }
    .lines { border-top: 1px solid rgba(217,164,140,.3); padding-top: 14px; display: grid; gap: 10px; font-size: .98rem; }
    .lines div { display: flex; justify-content: space-between; gap: 12px; color: rgba(247,235,227,.85); }
    .lines div + div { border-top: 1px solid rgba(217,164,140,.18); padding-top: 10px; }
    .lines b { color: var(--cream); font-weight: 400; white-space: nowrap; }
    .tot { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 18px; border-top: 1px solid rgba(217,164,140,.3); }
    .tot span { letter-spacing: .28em; text-transform: uppercase; font-size: .78rem; color: var(--rose-2); }
    .tot strong { font: 400 3.3rem/1 'Italiana', Georgia, serif; color: var(--cream); }
    .tot small { font-size: 1.15rem; color: var(--rose-2); letter-spacing: .06em; }
    .nt { text-align: right; font-size: .85rem; color: rgba(247,235,227,.6); margin: 4px 0 22px; }
    .go { display: flex; align-items: center; justify-content: center; gap: 14px; width: 100%; padding: 16px 20px; border: 1px solid var(--rose); border-radius: 999px; cursor: pointer;
      background: var(--rose); color: #fff; font: 400 .76rem 'Jost', sans-serif; letter-spacing: .22em; text-transform: uppercase; transition: background .25s, color .25s; }
    .go:hover { background: var(--cream); border-color: var(--cream); color: var(--wine); }
    .soon { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; justify-items: center; gap: 4px 12px; margin-top: 22px; font-size: .84rem; color: rgba(247,235,227,.62); text-align: center; }
    .soon app-icon { grid-column: 2; color: var(--rose-2); }
    .soon span { grid-column: 1 / -1; }

    .hint { text-align: center; color: var(--muted); font-style: italic; margin: 6px 0 4px; }
    .note { display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; color: var(--muted); font-size: .88rem; margin-top: 34px; }
    .note app-icon { color: var(--rose); }

    /* shooting */
    .incl { text-align: center; color: var(--muted); margin-bottom: 30px; font-size: .78rem; letter-spacing: .2em; text-transform: uppercase; }
    .two { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .prop { min-width: 0; }
    .stl { display: flex; align-items: center; gap: 18px; font: 400 .86rem 'Jost', sans-serif; letter-spacing: .36em; text-transform: uppercase; color: var(--wine); margin-bottom: 10px; line-height: 1.5; }
    .stl::before, .stl::after { content: ''; flex: 1; height: 1px; background: var(--rose); opacity: .6; }
    .prop .sub { text-align: center; margin-bottom: 22px; }
    .opt { display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 16px 30px 16px 26px; }
    .nm { display: flex; flex-direction: column; min-width: 0; }
    .nm strong { font: 500 .8rem 'Jost', sans-serif; letter-spacing: .18em; text-transform: uppercase; color: var(--wine); }
    .nm small { color: #6d4a4d; font-size: .92rem; line-height: 1.35; margin-top: 2px; }
    .opt b { font: 400 1.35rem 'Italiana', Georgia, serif; color: var(--rose); white-space: nowrap; }

    .mbar { display: none; }
    @media (max-width: 900px) {
      .conf { grid-template-columns: minmax(0, 1fr); gap: 18px; }
      .conf > * { min-width: 0; }
      .recap { position: static; }
      .mbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; position: sticky; z-index: 30;
        bottom: calc(10px + env(safe-area-inset-bottom, 0px)); padding: 10px 10px 10px 22px; border-radius: 999px; color: var(--cream);
        background: var(--wine-2); border: 1px solid rgba(217,164,140,.55); box-shadow: 0 14px 34px rgba(58,15,25,.4); }
      .mbar .mt { display: flex; flex-direction: column; line-height: 1.1; }
      .mbar .mt span { font-size: .6rem; letter-spacing: .28em; text-transform: uppercase; color: var(--rose-2); margin-bottom: 3px; }
      .mbar .mt strong { font: 400 2rem/1 'Italiana', Georgia, serif; }
      .mbar .mt small { font-size: .95rem; color: var(--rose-2); letter-spacing: .06em; }
      .mbar button { display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px; border: 0; border-radius: 999px; cursor: pointer;
        font: 400 .72rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #fff; background: var(--rose); }
    }
    @media (max-width: 780px) {
      .htop { font-size: 9px; letter-spacing: .14em; gap: 10px; }
      .htr { letter-spacing: .14em; line-height: 1.5; }
      .giant { font-size: 12vw; margin: 14px 0 4px; }
      .rule { width: 46%; margin-bottom: 18px; }
      .lede { font-size: .95rem; padding-left: 14px; }
      .main { padding: 30px 0 70px; }
    }
    @media (max-width: 560px) {
      .steps { gap: 8px 16px; font-size: .68rem; letter-spacing: .12em; }
      .parts button { padding: 12px 20px; font-size: .7rem; letter-spacing: .16em; }
      .opts { padding: 4px 0 0; }
      .type { flex-wrap: wrap; gap: 6px 14px; padding: 14px 18px 14px 14px; border-radius: 30px; }
      .from { flex-basis: 100%; text-align: left; padding-left: 66px; }
      .from b { display: inline; margin-left: 6px; }
      .opt { border-radius: 30px; padding: 14px 20px 14px 22px; }
      .opts h3 { font-size: 2.1rem; }
      .sub { font-size: 1rem; margin-bottom: 14px; }
      .grp { grid-template-columns: 44px 1fr; gap: 12px 14px; padding: 18px 16px; border-radius: 30px; align-items: start; }
      .gi { padding-top: 2px; }
      .gh strong { font-size: .8rem; letter-spacing: .18em; }
      .gh strong small { display: block; margin: 3px 0 0; font-size: 1.05rem; }
      .gh span { font-size: .94rem; max-width: none; }
      .grp .seg { grid-column: 1 / -1; width: 100%; justify-self: stretch; }
      .seg button { flex: 1; min-width: 0; padding: 13px 8px; font-size: .95rem; }
      .recap { padding: 30px 22px 24px; border-radius: 20px; }
      .recap h4 { font-size: 2.1rem; margin-bottom: 20px; }
      .incl-list { gap: 13px; margin-bottom: 20px; }
      .incl-list li { font-size: .98rem; gap: 14px; }
      .lines { font-size: .94rem; }
      .tot strong { font-size: 2.8rem; }
      .go { gap: 10px; padding: 16px 14px; }
      .go app-icon:first-child { display: none; }
      .go span { letter-spacing: .1em; font-size: .7rem; }
    }
  `],
})
export class ServicesComponent implements OnInit {
  private route = inject(ActivatedRoute);

  pricing = SOIREE_PRICING;
  extras = SOIREE_EXTRAS;
  info = EVENT_INFO;
  cameraChoices: (1 | 2 | 3)[] = [1, 2, 3];
  options: SoireeOptions = { ...DEFAULT_SOIREE_OPTIONS };
  eventTypes = EVENT_TYPES;
  included = INCLUDED_ALL;
  shootingTypes = SHOOTING_TYPES;
  shootingOptions = SHOOTING_OPTIONS;
  extraIcons: Record<string, string> = { drone: 'drone', girafe: 'crane', regie: 'screen' };
  icons: Record<string, string> = { soiree_homme: 'man', soiree_femme: 'woman', mariage: 'rings' };

  partie: 'mariage' | 'shooting' = 'mariage';
  modal: 'soiree' | 'shooting' | null = null; // fenêtre de réservation ouverte
  eventType: string | null = null;
  shootingType: string | null = null;
  shootingOption: string | null = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe((q) => {
      const p = q.get('partie');
      if (p === 'mariage' || p === 'shooting') this.partie = p;

      // Arrivée depuis l'accueil : on saute l'en-tête et on va directement au choix / à la formule
      const t = q.get('type');
      if (t && EVENT_TYPES.some((e) => e.id === t)) {
        this.partie = 'mariage';
        this.eventType = t;
        this.scrollTo('conf');
      } else if (q.get('go')) {
        this.scrollTo('choix');
      }
    });
  }

  private scrollTo(id: string) {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
  }

  // Affiche les options et fait défiler l'écran jusqu'à elles
  selectType(id: string) {
    this.eventType = id;
    setTimeout(() => document.getElementById('conf')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  get typeLabel() { return EVENT_TYPES.find((t) => t.id === this.eventType)?.label ?? ''; }
  get total() { return soireePrice(this.options); }
  get summaryText() { return soireeSummary(this.options); }

  // Détail du prix, ligne par ligne
  get lines(): { label: string; price: number }[] {
    const P = this.pricing, o = this.options;
    const l = [{ label: 'Formule de base', price: P.base }];
    if (o.cameras > 1) {
      const n = o.cameras - 1;
      l.push({ label: `${n} caméra${n > 1 ? 's' : ''} vidéo en plus`, price: n * P.camera });
    }
    for (const x of this.extras) if (o[x.key]) l.push({ label: x.name, price: x.price });
    return l;
  }

  chooseShoot(type: string, option: string) {
    this.shootingType = type;
    this.shootingOption = option;
    this.modal = 'shooting';
  }
}
