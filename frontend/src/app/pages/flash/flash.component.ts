import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlashCheck } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { STUDIO } from '../../studio.config';
import { IconComponent } from '../../components/icon/icon.component';

// Choix du client : « Homme », « Femme » ou « Homme et femme » (mariage)
const CHOICES = [
  { id: 'homme', label: 'Homme', hint: 'Soirée homme', icon: 'man' },
  { id: 'femme', label: 'Femme', hint: 'Soirée femme', icon: 'woman' },
  { id: 'mariage', label: 'Homme et femme', hint: 'Mariage', icon: 'rings' },
];

@Component({
  selector: 'app-flash',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  template: `
    <!-- ===== Haut de page (comme Services) ===== -->
    <section class="head">
      <div class="wrap">
        <div class="htop">
          <span class="htl">Flash de soirée</span>
          <span class="line"></span>
          <span class="star">✦</span>
          <span class="htr">Homme<br />Femme<br />Mariage</span>
        </div>
        <h1 class="giant">Mon flash</h1>
        <div class="rule"><i></i><b>◆</b><i></i></div>
        <p class="lede">
          Indiquez le type de votre soirée, sa date et votre nom : nous vous disons si votre flash est monté.
        </p>
      </div>
    </section>

    <section class="main">
      <div class="wrap narrow">
        <h2 class="stl"><span>Type de soirée</span></h2>
        <ul class="plist choices">
          @for (c of choices; track c.id) {
            <li>
              <button type="button" class="choice" [class.on]="type === c.id" (click)="pick(c.id)">
                <span class="pic"><app-icon [name]="c.icon" size="1.5rem" /></span>
                <span class="txt"><strong>{{ c.label }}</strong><small>{{ c.hint }}</small></span>
              </button>
            </li>
          }
        </ul>

        @if (type) {
          <div class="form">
            <h2 class="stl"><span>Votre soirée</span></h2>

            <div class="field">
              <label for="day">{{ type === 'mariage' ? 'Date du mariage' : 'Date de la soirée' }}</label>
              <input id="day" type="date" [(ngModel)]="day" (ngModelChange)="reset()" />
            </div>

            @if (type === 'mariage') {
              <div class="row">
                <div class="field">
                  <label for="ph">Prénom de l'homme</label>
                  <input id="ph" [(ngModel)]="prenomHomme" (ngModelChange)="reset(false)" placeholder="Prénom du marié" />
                </div>
                <div class="field">
                  <label for="pf">Prénom de la femme</label>
                  <input id="pf" [(ngModel)]="prenomFemme" (ngModelChange)="reset(false)" placeholder="Prénom de la mariée" (keyup.enter)="check()" />
                </div>
              </div>
            }

            @if (type === 'homme' || type === 'femme') {
              <div class="field">
                <label for="nom">{{ type === 'homme' ? 'Nom du client (homme)' : 'Nom de la cliente (femme)' }}</label>
                <input id="nom" [(ngModel)]="nom" (ngModelChange)="reset(false)" placeholder="Nom ou prénom utilisé pour la réservation" (keyup.enter)="check()" />
              </div>
            }

            @if (error) { <p class="error">{{ error }}</p> }

            <button type="button" class="go" [disabled]="loading || !canCheck" (click)="check()">
              {{ loading ? 'Vérification...' : 'Vérifier mon flash' }}
            </button>
          </div>
        } @else {
          <p class="hint">Sélectionnez un type de soirée pour continuer.</p>
        }

        @if (result && !askName) {
          @if (!result.found) {
            <div class="res none">
              <div class="rico">?</div>
              <h3>Aucune soirée trouvée</h3>
              <p>Vérifiez le type, la date et le nom, ou contactez-nous : {{ s.phones[0] }}.</p>
            </div>
          } @else if (result.ready) {
            <div class="res ok">
              <div class="rico"><app-icon name="check" size="1.8rem" /></div>
              <h3>Votre flash est prêt</h3>
              <p>Contactez-nous pour le recevoir : {{ s.phones[0] }}.</p>
            </div>
          } @else {
            <div class="res wait">
              <div class="rico">…</div>
              <h3>Votre flash n'est pas encore prêt</h3>
              <p>Notre monteur y travaille. Revenez vérifier dans quelques jours.</p>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      --wine: #4a1622; --wine-2: #3a0f19; --cream: #f7ebe3; --cream-2: #f1e0d5;
      --rose: #b9795f; --rose-2: #d9a48c; --rose-soft: #c99a86; --muted: #6d4a4d;
      display: block; overflow-x: clip; background: var(--cream); color: var(--wine); line-height: 1.6;
      font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif; font-weight: 400;
    }
    .wrap { width: min(1180px, 92%); margin: 0 auto; }
    .narrow { max-width: 680px; }

    /* ---------- haut de page ---------- */
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

    .stl { display: flex; align-items: center; gap: 18px; font: 400 .86rem 'Jost', sans-serif; letter-spacing: .36em; text-transform: uppercase; color: var(--wine); margin: 0 0 26px; line-height: 1.5; }
    .stl::before, .stl::after { content: ''; flex: 1; height: 1px; background: var(--rose); opacity: .6; }
    .stl span { text-align: center; }

    /* ---------- pilules (même style que Services) ---------- */
    .plist { list-style: none; margin-bottom: 40px; }
    .plist li { position: relative; }
    .plist li + li { margin-top: 18px; }
    .plist li::before { content: ''; position: absolute; left: 7%; right: 7%; top: -7px; height: 60%; border-radius: 999px; background: var(--rose-soft); opacity: .28; z-index: 0; }
    .choice, input { background: linear-gradient(180deg, #fcf3ec, #f2e1d6); border: 1px solid rgba(185,121,95,.35);
      box-shadow: 0 10px 22px rgba(74,22,34,.10), inset 0 1px 0 rgba(255,255,255,.8); }
    .choice { position: relative; z-index: 1; display: flex; align-items: center; gap: 18px; width: 100%; text-align: left; padding: 16px 34px 16px 16px;
      border-radius: 999px; cursor: pointer; font: inherit; color: var(--wine); transition: background .3s, box-shadow .3s, transform .3s, border-color .3s; }
    .choice:hover, .choice.on { background: var(--wine); border-color: var(--wine); box-shadow: 0 16px 30px rgba(74,22,34,.28); }
    .choice:hover { transform: translateY(-3px); }
    .pic { width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--rose); color: var(--rose); display: grid; place-items: center; flex: none; transition: .3s; }
    .txt { display: flex; flex-direction: column; gap: 2px; }
    .txt strong { font: 500 .8rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); }
    .txt small { font-size: .95rem; color: #6d4a4d; }
    .choice:hover strong, .choice.on strong { color: var(--cream); }
    .choice:hover small, .choice.on small { color: #ead3c8; }
    .choice:hover .pic, .choice.on .pic { border-color: var(--rose-soft); color: var(--rose-2); }

    /* ---------- formulaire ---------- */
    .form { animation: up .45s ease both; }
    @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    .field { margin-bottom: 22px; }
    label { display: block; margin: 0 0 8px 22px; font: 500 .72rem 'Jost', sans-serif; letter-spacing: .22em; text-transform: uppercase; color: var(--wine); }
    input { width: 100%; padding: 15px 26px; border-radius: 999px; font: 400 1rem 'Jost', sans-serif; color: var(--wine); transition: border-color .2s, box-shadow .2s; }
    input::placeholder { color: #a98a86; }
    input:focus { outline: none; border-color: var(--rose); box-shadow: 0 0 0 3px rgba(185,121,95,.2), 0 10px 22px rgba(74,22,34,.10); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .error { margin: -6px 0 18px 22px; }
    .go { display: flex; align-items: center; justify-content: center; width: 100%; padding: 17px 20px; border: 1px solid var(--wine); border-radius: 999px; cursor: pointer;
      background: var(--wine); color: var(--cream); font: 400 .76rem 'Jost', sans-serif; letter-spacing: .24em; text-transform: uppercase; transition: background .25s, border-color .25s; }
    .go:hover:not(:disabled) { background: var(--rose); border-color: var(--rose); }
    .go:disabled { opacity: .45; cursor: not-allowed; }
    .hint { text-align: center; color: var(--muted); font-style: italic; }

    /* ---------- résultat ---------- */
    .res { margin-top: 34px; padding: 34px 30px; border-radius: 34px; text-align: center; border: 1px solid rgba(185,121,95,.4);
      background: linear-gradient(180deg, #fcf3ec, #f2e1d6); box-shadow: 0 14px 30px rgba(74,22,34,.12); animation: up .45s ease both; }
    .res h3 { font: 400 1.9rem/1.15 'Italiana', Georgia, serif; text-transform: uppercase; letter-spacing: .04em; margin: 14px 0 6px; color: var(--wine); }
    .res p { color: var(--muted); }
    .rico { width: 58px; height: 58px; border-radius: 50%; margin: 0 auto; display: grid; place-items: center; font: 400 1.7rem 'Jost', sans-serif; border: 1px solid var(--rose); color: var(--rose); }
    .res.ok { background: var(--wine-2); border-color: var(--wine-2); box-shadow: 0 24px 50px rgba(58,15,25,.32); }
    .res.ok h3 { color: var(--cream); } .res.ok p { color: #ead3c8; } .res.ok .rico { border-color: var(--rose-2); color: var(--rose-2); }

    @media (max-width: 780px) {
      .htop { font-size: 9px; letter-spacing: .14em; gap: 10px; }
      .htr { letter-spacing: .14em; line-height: 1.5; }
      .giant { font-size: 12.6vw; margin: 14px 0 4px; }
      .rule { width: 46%; margin-bottom: 18px; }
      .lede { font-size: .95rem; padding-left: 14px; }
      .main { padding: 30px 0 70px; }
    }
    @media (max-width: 560px) {
      .choice { padding: 14px 18px 14px 14px; border-radius: 30px; }
      .row { grid-template-columns: 1fr; }
      .res { border-radius: 28px; padding: 28px 20px; }
      .stl { letter-spacing: .22em; gap: 12px; font-size: .78rem; }
    }
  `],
})
export class FlashComponent {
  private api = inject(ReservationService);
  s = STUDIO;
  choices = CHOICES;

  type = '';
  day = '';
  nom = '';
  prenomHomme = '';
  prenomFemme = '';
  loading = false;
  error = '';
  result: FlashCheck | null = null;
  askName = false; // plusieurs soirées le même jour : on demande le nom

  pick(id: string) { this.type = id; this.reset(); }

  reset(clearNom = true) { this.result = null; this.askName = false; this.error = ''; if (clearNom) this.nom = ''; }

  get canCheck() {
    if (!this.type || !this.day) return false;
    if (this.type === 'mariage') return !!this.prenomHomme.trim() && !!this.prenomFemme.trim();
    return !!this.nom.trim(); // homme / femme : le nom du client est obligatoire
  }

  check() {
    if (!this.canCheck) return;
    this.error = '';
    this.loading = true;
    this.api.flashCheck({ type: this.type, day: this.day, nom: this.nom, prenomHomme: this.prenomHomme, prenomFemme: this.prenomFemme }).subscribe({
      next: (r) => {
        this.loading = false;
        this.result = r;
        this.askName = !!r.multiple && !this.nom.trim();
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || (e.status ? `Erreur serveur (${e.status})` : 'Impossible de contacter le serveur');
      },
    });
  }
}
