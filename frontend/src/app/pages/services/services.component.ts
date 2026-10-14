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
    <section class="section">
      <div class="container">
        <div class="top" appReveal>
          <div class="top-txt">
            <span class="eyebrow-l">Nos formules</span>
            <h2>Des souvenirs <em class="it">uniques</em></h2>
            <p>Choisissez la formule qui correspond à vos envies et laissez-nous capturer les plus beaux moments de votre histoire. Composez-la, découvrez le prix en direct et réservez en quelques clics.</p>
          </div>
          <div class="parts">
            <button type="button" [class.on]="partie === 'mariage'" (click)="partie = 'mariage'"><app-icon name="rings" size="1.35em" /> Mariage &amp; soirées</button>
            <button type="button" [class.on]="partie === 'shooting'" (click)="partie = 'shooting'"><app-icon name="camera" size="1.35em" /> Shooting</button>
          </div>
        </div>

        @if (partie === 'mariage') {
          <!-- ============ MARIAGE & SOIRÉES : 1) soirée, 2) options, 3) réservation ============ -->
          <ol class="steps">
            <li [class.done]="!!eventType" class="cur1"><span>1</span> Choisissez votre soirée</li>
            <li [class.cur]="!!eventType"><span>2</span> Composez votre formule</li>
            <li><span>3</span> Réservez votre date</li>
          </ol>

          <div class="cards" appReveal>
            @for (t of eventTypes; track t.id; let i = $index) {
              <article class="card-f" [class.sel]="eventType === t.id">
                <div class="ph">
                  <img [src]="cardPhotos[t.id]" [style.object-position]="cardPos[t.id]" alt="" loading="lazy" />
                  <span class="num">0{{ i + 1 }}</span>
                </div>
                <div class="bd">
                  <h3>{{ t.label }}</h3>
                  <span class="ul"></span>
                  <p class="td">{{ info[t.id] }}</p>
                  <div class="mid">
                    <ul class="chk">
                      <li><app-icon name="check" size="1.15rem" /> 1 appareil photo</li>
                      <li><app-icon name="check" size="1.15rem" /> 1 caméra vidéo</li>
                      <li><app-icon name="check" size="1.15rem" /> {{ included.join(' & ') }}</li>
                    </ul>
                    <div class="pr">
                      <small>À partir de</small>
                      <strong>{{ pricing.base }} <em>DT</em></strong>
                    </div>
                  </div>
                  <p class="meta"><app-icon name="camera" size="1.1rem" /> Photo + vidéo <span>·</span> <app-icon name="calendar" size="1.1rem" /> Date réservée à votre nom</p>
                  <button type="button" class="pick" [class.dk]="eventType === t.id" (click)="selectType(t.id)">
                    {{ eventType === t.id ? 'Formule choisie' : 'Choisir cette formule' }} <app-icon name="arrow" size="1.1rem" />
                  </button>
                </div>
              </article>
            }
          </div>

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
                <h3><span class="pic sm"><app-icon [name]="t.id === 'mariage' ? 'rings' : 'camera'" size="1.5rem" /></span> {{ t.name }}</h3>
                <p class="sub">{{ t.desc }}</p>
                <div class="rows">
                  @for (o of shootingOptions; track o.id) {
                    <button type="button" class="opt" [class.sel]="shootingType === t.id && shootingOption === o.id" (click)="chooseShoot(t.id, o.id)">
                      <span class="nm"><strong>{{ o.name }}</strong><small>{{ o.desc }}</small></span>
                      <b>{{ o.price }} DT</b>
                    </button>
                  }
                </div>
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
    .top { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 26px; margin-bottom: 34px; }
    .top-txt { max-width: 700px; }
    .eyebrow-l { display: flex; align-items: center; gap: 14px; font-size: .78rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: var(--gold-dark); margin-bottom: 12px; }
    .eyebrow-l::before { content: ''; width: 34px; height: 1px; background: var(--gold); }
    .top h2 { font-size: clamp(2.4rem, 5vw, 3.6rem); margin-bottom: 12px; }
    .top p { color: var(--muted); font-size: 1.1rem; }
    .parts { display: flex; gap: 4px; padding: 5px; background: #fff; border: 1px solid var(--line); border-radius: 999px; box-shadow: var(--shadow); }
    .parts button { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 24px; background: transparent; color: var(--muted); border: 0; border-radius: 999px;
      cursor: pointer; font: 700 1.05rem 'Cormorant Garamond', Georgia, serif; transition: .15s; white-space: nowrap; }
    .parts button.on { background: linear-gradient(135deg, #c9a45c, #a67c2e); color: #fff; box-shadow: 0 6px 16px rgba(150,112,42,.35); }

    /* étapes */
    .steps { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 34px; list-style: none; margin-bottom: 34px; color: var(--muted); font-weight: 700; font-size: .95rem; }
    .steps li { display: flex; align-items: center; gap: 10px; }
    .steps span { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--line); background: #fff; font-size: .9rem; }
    .steps li.cur1, .steps li.cur { color: var(--text); }
    .steps li.cur1 span, .steps li.cur span { border-color: var(--gold); background: var(--gold-soft); color: var(--gold-dark); }
    .steps li.done span { background: var(--gold); border-color: var(--gold); color: #fff; }

    /* cartes de formule */
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 34px; }
    .card-f { display: flex; flex-direction: column; background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow); transition: .25s; }
    .card-f:hover { transform: translateY(-4px); border-color: var(--gold); box-shadow: 0 18px 40px rgba(20,17,15,.12); }
    .card-f.sel { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold), 0 18px 40px rgba(150,112,42,.2); }
    .ph { position: relative; height: 190px; overflow: hidden; background: #efe5d1; }
    .ph img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
    .card-f:hover .ph img { transform: scale(1.05); }
    .num { position: absolute; top: 14px; left: 14px; padding: 6px 12px; border-radius: 8px; background: rgba(20,17,15,.82); color: #fff; font: 700 .95rem 'Playfair Display', Georgia, serif; }
    .bd { display: flex; flex-direction: column; flex: 1; padding: 24px 26px 26px; }
    .bd h3 { font: 600 1.7rem 'Cormorant Garamond', Georgia, serif; }
    .ul { display: block; width: 44px; height: 2px; background: var(--gold); margin: 10px 0 14px; }
    .td { color: var(--muted); font-size: 1.02rem; line-height: 1.5; margin-bottom: 18px; }
    .mid { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 18px; }
    .chk { list-style: none; display: grid; gap: 9px; font-size: 1rem; }
    .chk li { display: flex; align-items: center; gap: 10px; }
    .chk app-icon { color: var(--gold); }
    .pr { text-align: center; padding-left: 18px; border-left: 1px solid var(--line); }
    .pr small { display: block; font-size: .82rem; color: var(--muted); }
    .pr strong { font: 700 2.3rem/1.1 'Playfair Display', Georgia, serif; color: var(--gold-dark); white-space: nowrap; }
    .pr em { font: 600 .9rem sans-serif; font-style: normal; color: var(--muted); }
    .meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding-top: 14px; border-top: 1px solid var(--line); margin-bottom: 18px; font-size: .9rem; color: var(--muted); }
    .meta app-icon { color: var(--gold-dark); } .meta span { opacity: .5; }
    .pick { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; margin-top: auto; padding: 14px; cursor: pointer; border-radius: 8px;
      background: linear-gradient(135deg, #c9a45c, #a67c2e); color: #fff; border: 1px solid transparent;
      font: 700 .85rem 'Cormorant Garamond', Georgia, serif; letter-spacing: .16em; text-transform: uppercase; transition: .2s; }
    .pick:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(150,112,42,.35); }
    .pick.dk { background: var(--ink); color: #fff; }
    .pic { width: 66px; height: 66px; border-radius: 50%; background: var(--gold-soft); color: var(--gold-dark); display: grid; place-items: center; flex: none; transition: .25s; }
    .pic.sm { width: 48px; height: 48px; display: inline-grid; }

    /* composition de la formule */
    .conf { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; align-items: start; animation: up .45s ease both; scroll-margin-top: 90px; margin-top: 8px; }
    @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    .opts { background: linear-gradient(180deg, #fffdf9 0%, #f9f4ea 100%); border: 1px solid #efe6d6; border-radius: 12px;
      box-shadow: 0 18px 50px rgba(120,90,40,.12); padding: 40px 40px 26px; }
    .opts h3 { position: relative; padding-top: 22px; font: 500 clamp(2.3rem, 4.4vw, 3.3rem)/1.05 'Cormorant Garamond', Georgia, serif; margin-bottom: 12px; }
    .opts h3::before { content: ''; position: absolute; top: 0; left: 0; width: 64px; height: 2px; background: var(--gold); }
    .opts h3 .it { font-style: italic; color: var(--gold-dark); }
    .sub { color: var(--muted); font-size: 1.12rem; margin-bottom: 26px; }
    .grp { display: grid; grid-template-columns: 52px 1fr auto; align-items: center; gap: 20px; padding: 22px 0; border-top: 1px solid #ebe2d1; }
    .gi { color: var(--gold-dark); display: grid; place-items: center; }
    .gh { display: flex; flex-direction: column; gap: 4px; }
    .gh strong { font: 700 1.15rem 'Cormorant Garamond', Georgia, serif; letter-spacing: .2em; text-transform: uppercase; }
    .gh strong small { margin-left: 14px; font: 600 .95rem 'Cormorant Garamond', Georgia, serif; letter-spacing: .02em; color: var(--gold-dark); text-transform: none; }
    .gh span { color: var(--muted); font-size: 1rem; line-height: 1.45; max-width: 400px; }
    .gh span b { color: var(--gold-dark); }
    .seg { display: flex; flex: none; padding: 4px; gap: 2px; background: #f4eee3; border: 1px solid #ebe2d1; border-radius: 999px; box-shadow: inset 0 1px 3px rgba(120,90,40,.1); }
    .seg button { min-width: 58px; padding: 10px 20px; background: transparent; border: 0; border-radius: 999px; cursor: pointer;
      font: 600 1rem 'Cormorant Garamond', Georgia, serif; color: var(--muted); transition: .18s; }
    .seg button:hover { color: var(--text); }
    .seg button.on { background: linear-gradient(180deg, #2a241d, #0e0c0a); color: #fff; box-shadow: 0 4px 10px rgba(20,17,15,.3); }
    .seg.gold button.on { background: linear-gradient(135deg, #c9a45c, #a67c2e); color: #fff; box-shadow: 0 4px 12px rgba(150,112,42,.4); }

    .recap { position: sticky; top: 92px; color: #fff; border-radius: 12px; padding: 40px 36px 28px; border: 1px solid rgba(184,146,79,.55);
      background: radial-gradient(ellipse at 100% 0%, rgba(184,146,79,.28), transparent 45%), linear-gradient(180deg, #17130f, #0c0a08);
      box-shadow: 0 28px 60px rgba(20,17,15,.35); }
    .kick { display: flex; align-items: center; gap: 12px; font-size: .75rem; letter-spacing: .26em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin-bottom: 10px; }
    .kick::before { content: ''; width: 20px; height: 1px; background: var(--gold); }
    .recap h4 { font: 500 2.6rem/1.1 'Cormorant Garamond', Georgia, serif; margin-bottom: 26px; color: #fff; }
    .incl-list { list-style: none; display: grid; gap: 16px; margin-bottom: 26px; }
    .incl-list li { display: flex; align-items: center; gap: 16px; color: rgba(255,255,255,.92); font-size: 1.12rem; }
    .incl-list app-icon { color: var(--gold); }
    .lines { border-top: 1px solid rgba(255,255,255,.16); padding-top: 14px; display: grid; gap: 10px; font-size: 1.05rem; }
    .lines div { display: flex; justify-content: space-between; gap: 12px; color: rgba(255,255,255,.85); }
    .lines div + div { border-top: 1px solid rgba(255,255,255,.1); padding-top: 10px; }
    .lines b { color: #fff; font-weight: 500; white-space: nowrap; }
    .tot { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.16); }
    .tot span { letter-spacing: .26em; text-transform: uppercase; font-size: .85rem; font-weight: 700; color: var(--gold); }
    .tot strong { font: 500 3.3rem/1 'Cormorant Garamond', Georgia, serif; color: #fff; }
    .tot small { font-size: 1.15rem; color: var(--gold-light); letter-spacing: .06em; }
    .nt { text-align: right; font-size: .9rem; color: rgba(255,255,255,.6); margin: 4px 0 22px; }
    .go { display: flex; align-items: center; justify-content: center; gap: 14px; width: 100%; padding: 17px 20px; border: 0; border-radius: 8px; cursor: pointer;
      background: linear-gradient(135deg, #d4b274 0%, #b8924f 50%, #96702a 100%); color: #1a140b;
      font: 700 .88rem 'Cormorant Garamond', Georgia, serif; letter-spacing: .2em; text-transform: uppercase; transition: .2s; box-shadow: 0 10px 24px rgba(150,112,42,.35); }
    .go:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(150,112,42,.5); }
    .soon { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; justify-items: center; gap: 4px 12px; margin-top: 22px; font-size: .88rem; color: rgba(255,255,255,.6); text-align: center; }
    .soon app-icon { grid-column: 2; color: var(--gold); }
    .soon span { grid-column: 1 / -1; }

    .hint { text-align: center; color: var(--muted); font-style: italic; margin: 6px 0 4px; }
    .note { display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; color: var(--muted); font-size: .92rem; margin-top: 30px; }
    .note app-icon { color: var(--gold-dark); }

    /* shooting */
    .incl { text-align: center; color: var(--muted); margin-bottom: 28px; font-weight: 600; }
    .two { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .prop { background: #fff; border: 1px solid var(--line); border-radius: 10px; box-shadow: var(--shadow); padding: 30px; }
    .prop h3 { font-size: 1.35rem; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .rows { display: grid; gap: 10px; margin-top: 18px; }
    .opt { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; text-align: left;
      padding: 14px 16px; background: var(--card-2); border: 1px solid var(--line); border-radius: 6px; cursor: pointer;
      font: inherit; color: var(--text); transition: .15s; }
    .opt:hover { border-color: var(--gold); }
    .opt.sel { border-color: var(--gold); background: var(--gold-soft); box-shadow: 0 0 0 2px var(--gold) inset; }
    .nm { display: flex; flex-direction: column; }
    .nm strong { font-size: 1.1rem; }
    .nm small { color: var(--muted); font-size: .88rem; line-height: 1.3; }
    .opt b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; color: var(--gold-dark); white-space: nowrap; }

    @media (max-width: 960px) { .cards { grid-template-columns: 1fr; } .ph { height: 220px; } .top { align-items: flex-start; } }
    @media (max-width: 900px) {
      .conf { grid-template-columns: 1fr; }
      .recap { position: static; }
    }
    @media (max-width: 560px) {
      .grp { grid-template-columns: 40px 1fr; }
      .grp .seg { grid-column: 1 / -1; justify-self: start; }
      .opts { padding: 28px 20px 14px; }
      .recap { padding: 30px 22px 22px; } .recap h4 { font-size: 2.1rem; }
      .steps { gap: 8px 16px; font-size: .85rem; }
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
  cardPhotos: Record<string, string> = { soiree_homme: 'assets/photos/photo-8.jpg', soiree_femme: 'assets/photos/photo-1.jpg', mariage: 'assets/photos/photo-2.jpg' };
  cardPos: Record<string, string> = { soiree_homme: 'center 30%', soiree_femme: 'center 22%', mariage: 'center 45%' };
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
    });
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
