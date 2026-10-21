import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlashCheck } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { STUDIO } from '../../studio.config';

// Choix du client : « Homme », « Femme » ou « Homme et femme » (mariage)
const CHOICES = [
  { id: 'homme', label: 'Homme', hint: 'Soirée homme' },
  { id: 'femme', label: 'Femme', hint: 'Soirée femme' },
  { id: 'mariage', label: 'Homme et femme', hint: 'Mariage' },
];

@Component({
  selector: 'app-flash',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <header class="page-hero">
      <div class="container">
        <span class="eyebrow">Flash de soirée</span>
        <h2>Mon <em class="it">flash</em> est-il prêt ?</h2>
        <p>Indiquez le type de votre soirée et sa date : nous vous disons si votre flash est monté.</p>
      </div>
    </header>

    <section class="section soft">
      <div class="container narrow">

        <div class="card">
          <div class="field">
            <label>Type de soirée</label>
            <div class="choices">
              @for (c of choices; track c.id) {
                <button type="button" class="choice" [class.on]="type === c.id" (click)="pick(c.id)">
                  <b>{{ c.label }}</b><small>{{ c.hint }}</small>
                </button>
              }
            </div>
          </div>

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

          @if (askName) {
            <div class="field">
              <label for="nom">Plusieurs soirées ce jour-là : entrez votre nom</label>
              <input id="nom" [(ngModel)]="nom" placeholder="Votre nom ou prénom" (keyup.enter)="check()" />
            </div>
          }

          @if (error) { <p class="error">{{ error }}</p> }

          <button class="btn btn-red full" [disabled]="loading || !canCheck" (click)="check()">
            {{ loading ? 'Vérification...' : 'Vérifier mon flash' }}
          </button>
        </div>

        @if (result && !askName) {
          @if (!result.found) {
            <div class="res none">
              <div class="ico">?</div>
              <h3>Aucune soirée trouvée</h3>
              <p>Vérifiez le type et la date, ou contactez-nous : {{ s.phones[0] }}.</p>
            </div>
          } @else if (result.ready) {
            <div class="res ok">
              <div class="ico">✓</div>
              <h3>Votre flash est prêt</h3>
              <p>Contactez-nous pour le recevoir : {{ s.phones[0] }}.</p>
            </div>
          } @else {
            <div class="res wait">
              <div class="ico">…</div>
              <h3>Votre flash n'est pas encore prêt</h3>
              <p>Notre monteur y travaille. Revenez vérifier dans quelques jours.</p>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .narrow { max-width: 640px; }
    .choices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .choice { padding: 14px 8px; border: 1px solid var(--line); border-radius: 8px; background: var(--card-2); cursor: pointer;
      font: inherit; color: var(--text); display: flex; flex-direction: column; gap: 2px; transition: .2s; }
    .choice small { color: var(--muted); font-size: .8rem; }
    .choice:hover { border-color: var(--gold); }
    .choice.on { border-color: var(--ink); background: linear-gradient(180deg, #2a241d, #0e0c0a); color: #fff; box-shadow: 0 6px 16px rgba(20,17,15,.25); }
    .choice.on small { color: var(--gold-light); }
    .card { border-top: 3px solid var(--gold); }
    .full { width: 100%; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 480px) { .row { grid-template-columns: 1fr; gap: 0; } }
    .res { margin-top: 24px; padding: 28px; border-radius: 8px; text-align: center; border: 1px solid var(--line); background: var(--card); }
    .res h3 { font: 600 1.6rem 'Cormorant Garamond', Georgia, serif; margin: 8px 0 4px; }
    .res p { color: var(--muted); }
    .ico { width: 52px; height: 52px; border-radius: 50%; margin: 0 auto; display: grid; place-items: center; font-size: 1.6rem; font-weight: 700; color: #fff; }
    .res.ok { border-color: #b6e6cc; background: #e8f7ef; } .res.ok .ico { background: var(--ok); } .res.ok h3 { color: #0c7a45; }
    .res.wait { border-color: #f0dca8; background: #fff8e6; } .res.wait .ico { background: var(--warn); } .res.wait h3 { color: #9a6500; }
    .res.none .ico { background: var(--muted); }
    @media (max-width: 480px) { .choices { grid-template-columns: 1fr; } }
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
    return this.type !== 'mariage' || (!!this.prenomHomme.trim() && !!this.prenomFemme.trim());
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
