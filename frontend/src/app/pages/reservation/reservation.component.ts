import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { EVENT_TYPES, INCLUDED_ALL, PACKS, SHOOTING_OPTIONS, SHOOTING_TYPES } from '../../studio.config';
import { ReservationService } from '../../services/reservation.service';
import { Availability } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="section soft">
      <div class="container narrow">
        <div class="section-head">
          <span class="eyebrow">Réservation</span>
          <h2>Réservez votre date</h2>
          <p>Remplissez le formulaire, nous vous confirmons rapidement.</p>
        </div>

        @if (success) { <div class="alert alert-ok">✅ {{ success }}</div> }
        @if (error) { <div class="alert alert-err">⚠️ {{ error }}</div> }

        <form [formGroup]="form" (ngSubmit)="submit()" class="card">
          <div class="tabs">
            <button type="button" [class.on]="category === 'soiree'" (click)="setCategory('soiree')">Mariage / Soirée</button>
            <button type="button" [class.on]="category === 'shooting'" (click)="setCategory('shooting')">Shooting</button>
          </div>

          @if (category === 'soiree') {
            <div class="field">
              <label>Type de soirée</label>
              <select formControlName="eventType">
                @for (e of eventTypes; track e.id) { <option [value]="e.id">{{ e.label }}</option> }
              </select>
            </div>

            <div class="field">
              <label>Choix ({{ included.join(' & ') }} inclus)</label>
              <div class="packs">
                @for (p of packs; track p.id) {
                  <label class="pack" [class.sel]="form.value.pack === p.id">
                    <input type="radio" formControlName="pack" [value]="p.id" />
                    <span><strong>{{ p.name }}</strong><small>{{ p.features.join(' + ') }}</small></span>
                    <b>{{ p.price }} DT</b>
                  </label>
                }
              </div>
            </div>
          } @else {
            <div class="field">
              <label>Type de shooting</label>
              <div class="chips">
                @for (t of shootingTypes; track t.id) {
                  <label class="chip" [class.sel]="form.value.shootingType === t.id">
                    <input type="radio" formControlName="shootingType" [value]="t.id" />{{ t.name }}
                  </label>
                }
              </div>
            </div>

            <div class="field">
              <label>Choix du shooting</label>
              <div class="packs">
                @for (o of shootingOptions; track o.id) {
                  <label class="pack" [class.sel]="form.value.shootingOption === o.id">
                    <input type="radio" formControlName="shootingOption" [value]="o.id" />
                    <span><strong>{{ o.name }}</strong><small>{{ o.desc }}</small></span>
                    <b>{{ o.price }} DT</b>
                  </label>
                }
              </div>
            </div>
          }

          <div class="row">
            <div class="field">
              <label>Nom</label>
              <input formControlName="nom" />
              @if (bad('nom')) { <p class="error">Nom obligatoire</p> }
            </div>
            <div class="field">
              <label>Prénom</label>
              <input formControlName="prenom" />
              @if (bad('prenom')) { <p class="error">Prénom obligatoire</p> }
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label>CIN</label>
              <input formControlName="cin" inputmode="numeric" maxlength="8" placeholder="8 chiffres" />
              @if (bad('cin')) { <p class="error">CIN invalide (8 chiffres)</p> }
            </div>
            <div class="field">
              <label>Téléphone</label>
              <input formControlName="telephone" inputmode="numeric" maxlength="8" placeholder="8 chiffres" />
              @if (bad('telephone')) { <p class="error">Téléphone invalide (8 chiffres)</p> }
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label>Lieu</label>
              <input formControlName="lieu" placeholder="Salle / ville" />
              @if (bad('lieu')) { <p class="error">Lieu obligatoire</p> }
            </div>
            <div class="field">
              <label>Date</label>
              <input type="date" formControlName="date" [min]="today" />
              @if (bad('date')) { <p class="error">Date obligatoire</p> }
              @if (category === 'soiree' && availability) {
                @if (availability.available) {
                  <p class="avail ok">✔ Date disponible ({{ availability.max - availability.count }} place(s) restante(s))</p>
                } @else {
                  <p class="avail no">✖ Cette date est complète. Choisissez une autre date.</p>
                }
              }
            </div>
          </div>

          <div class="field">
            <label>Message (optionnel)</label>
            <textarea rows="3" formControlName="message"></textarea>
          </div>

          @if (selectedPrice) {
            <p class="total">Total : <strong>{{ selectedPrice }} DT</strong></p>
          }

          <button class="btn btn-red full" [disabled]="loading || dateFull">
            {{ loading ? 'Envoi...' : 'Confirmer la réservation' }}
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .narrow { max-width: 780px; }
    .tabs { display: flex; gap: 6px; padding: 5px; background: var(--bg-soft); border-radius: 12px; margin-bottom: 26px; }
    .tabs button { flex: 1; padding: 11px; background: transparent; color: var(--muted); border: 0; border-radius: 9px;
      cursor: pointer; font: 600 .92rem 'Cormorant Garamond', Georgia, serif; transition: .15s; }
    .tabs button.on { background: #fff; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .chips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .chip { margin: 0; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; cursor: pointer; text-align: center;
      font-weight: 500; transition: .15s; }
    .chip input { display: none; }
    .chip.sel { border-color: var(--red); background: var(--red-soft); color: var(--red-dark); }
    .packs { display: grid; gap: 10px; }
    .pack { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px;
      border: 1px solid var(--line); border-radius: 12px; cursor: pointer; margin: 0; transition: .15s; }
    .pack input { display: none; }
    .pack span { display: flex; flex-direction: column; }
    .pack small { color: var(--muted); font-weight: 400; }
    .pack b { font-family: 'Playfair Display', Georgia, serif; color: var(--red); }
    .pack.sel { border-color: var(--red); background: var(--red-soft); }
    .avail { font-size: .82rem; margin-top: 6px; font-weight: 500; }
    .avail.ok { color: var(--ok); } .avail.no { color: var(--red); }
    .total { text-align: right; margin-bottom: 16px; }
    .total strong { font-family: 'Playfair Display', Georgia, serif; color: var(--red); font-size: 1.5rem; }
    .full { width: 100%; }
    @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
  `],
})
export class ReservationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private api = inject(ReservationService);
  private router = inject(Router);
  private cart = inject(CartService);

  packs = PACKS;
  included = INCLUDED_ALL;
  eventTypes = EVENT_TYPES;
  shootingOptions = SHOOTING_OPTIONS;
  shootingTypes = SHOOTING_TYPES;
  today = new Date().toLocaleDateString('en-CA');

  category: 'soiree' | 'shooting' = 'soiree';
  availability: Availability | null = null;
  loading = false;
  success = '';
  error = '';

  form = this.fb.nonNullable.group({
    eventType: ['mariage'],
    pack: ['normale'],
    shootingType: ['individuel'],
    shootingOption: ['photo'],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    cin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    message: [''],
  });

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    if (q.get('category') === 'shooting') this.category = 'shooting';
    if (q.get('pack')) this.form.patchValue({ pack: q.get('pack')! });
    if (q.get('eventType')) this.form.patchValue({ eventType: q.get('eventType')! });
    if (q.get('shootingType')) this.form.patchValue({ shootingType: q.get('shootingType')! });
    if (q.get('shootingOption')) this.form.patchValue({ shootingOption: q.get('shootingOption')! });
    this.form.controls.date.valueChanges.subscribe(() => this.checkAvailability());
  }

  get selectedPrice() {
    return this.category === 'soiree'
      ? this.packs.find((p) => p.id === this.form.value.pack)?.price
      : this.shootingOptions.find((o) => o.id === this.form.value.shootingOption)?.price;
  }

  get dateFull() {
    return this.category === 'soiree' && !!this.availability && !this.availability.available;
  }

  setCategory(c: 'soiree' | 'shooting') {
    this.category = c;
    this.checkAvailability();
  }

  checkAvailability() {
    const date = this.form.controls.date.value;
    if (this.category !== 'soiree' || !date) {
      this.availability = null;
      return;
    }
    this.api.availability(date).subscribe({
      next: (a) => (this.availability = a),
      error: () => (this.availability = null),
    });
  }

  bad(name: string) {
    const c = this.form.get(name)!;
    return c.invalid && (c.dirty || c.touched);
  }

  submit() {
    this.success = this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const base = { nom: v.nom, prenom: v.prenom, cin: v.cin, telephone: v.telephone, lieu: v.lieu, date: v.date, message: v.message };
    const payload =
      this.category === 'soiree'
        ? { category: 'soiree' as const, eventType: v.eventType, pack: v.pack, ...base }
        : { category: 'shooting' as const, shootingType: v.shootingType, shootingOption: v.shootingOption, ...base };

    this.loading = true;
    this.api.create(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.form.reset({ eventType: 'mariage', pack: 'normale', shootingType: 'individuel', shootingOption: 'photo' });
        this.availability = null;
        this.cart.add(res.id);              // ajoute la réservation au panier
        this.router.navigateByUrl('/panier'); // et ouvre le panier
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Impossible de contacter le serveur.';
        this.checkAvailability();
      },
    });
  }
}
