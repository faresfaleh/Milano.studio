import { Component, EventEmitter, HostListener, Input, OnDestroy, Output, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EVENT_TYPES, SHOOTING_OPTIONS, SHOOTING_TYPES, SoireeOptions, soireePrice, soireeSummary } from '../../studio.config';
import { ReservationService } from '../../services/reservation.service';
import { CartService } from '../../services/cart.service';
import { Availability } from '../../models/reservation.model';

// Fenêtre de réservation : s'ouvre quand le client clique sur un choix de prix
@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="backdrop" (click)="close()">
      <form class="modal" [formGroup]="form" (ngSubmit)="submit()" (click)="$event.stopPropagation()"
            role="dialog" aria-modal="true" aria-labelledby="rtitle">

        <!-- Formulaire -->
        <div class="panel">
          <button type="button" class="x" (click)="close()" aria-label="Fermer">✕</button>

          <h3 id="rtitle" class="big">Réservation</h3>
          <p class="intro">Renseignez vos coordonnées pour finaliser votre réservation. Notre équipe vous contactera pour la confirmer.</p>

          <div class="recap">
            <div>
              <span class="lbl">Votre formule</span>
              <strong>{{ summary?.title }}</strong>
              @if (summary?.detail) { <small>{{ summary?.detail }}</small> }
            </div>
            <div class="price">{{ summary?.price }} <small>DT</small><span class="nt">sans transport</span></div>
          </div>

          @if (error) { <div class="alert alert-err">{{ error }}</div> }

          <div class="row">
            <div class="field">
              <label>Nom <i>*</i></label>
              <input formControlName="nom" autocomplete="family-name" />
              @if (bad('nom')) { <p class="error">Nom obligatoire</p> }
            </div>
            <div class="field">
              <label>Prénom <i>*</i></label>
              <input formControlName="prenom" autocomplete="given-name" />
              @if (bad('prenom')) { <p class="error">Prénom obligatoire</p> }
            </div>
          </div>

          @if (category === 'soiree' && eventType === 'mariage') {
            <div class="row">
              <div class="field">
                <label>Prénom du marié (homme) <i>*</i></label>
                <input formControlName="mariePrenomHomme" />
                @if (bad('mariePrenomHomme')) { <p class="error">Prénom du marié obligatoire</p> }
              </div>
              <div class="field">
                <label>Prénom de la mariée (femme) <i>*</i></label>
                <input formControlName="mariePrenomFemme" />
                @if (bad('mariePrenomFemme')) { <p class="error">Prénom de la mariée obligatoire</p> }
              </div>
            </div>
          }

          <div class="row">
            <div class="field">
              <label>CIN <i>*</i></label>
              <input formControlName="cin" inputmode="numeric" maxlength="8" placeholder="8 chiffres" />
              @if (bad('cin')) { <p class="error">CIN invalide (8 chiffres)</p> }
            </div>
            <div class="field">
              <label>Téléphone <i>*</i></label>
              <div class="phone">
                <span>+216</span>
                <input formControlName="telephone" inputmode="numeric" maxlength="8" placeholder="8 chiffres" autocomplete="tel-national" />
              </div>
              @if (bad('telephone')) { <p class="error">Téléphone invalide (8 chiffres)</p> }
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label>Date <i>*</i></label>
              <input type="date" formControlName="date" [min]="today" />
              @if (bad('date')) { <p class="error">Date obligatoire</p> }
              @if (category === 'soiree' && availability) {
                @if (availability.available) {
                  <p class="avail ok">✔ Date disponible ({{ availability.max - availability.count }} place(s) restante(s))</p>
                } @else {
                  <p class="avail no">✖ Date complète, choisissez une autre date</p>
                }
              }
            </div>
            <div class="field">
              <label>Lieu <i>*</i></label>
              <input formControlName="lieu" placeholder="Salle / ville" />
              @if (bad('lieu')) { <p class="error">Lieu obligatoire</p> }
            </div>
          </div>

          <div class="field">
            <label>Message <span class="opt">(optionnel)</span></label>
            <textarea rows="2" formControlName="message"></textarea>
          </div>

          <div class="actions">
            <button type="button" class="cancel" (click)="close()">Annuler</button>
            <button class="go" [disabled]="loading || dateFull">
              {{ loading ? 'Envoi en cours...' : 'Confirmer la réservation' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,.72); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 20px; animation: fade .2s ease; }
    .modal { width: min(640px, 100%); height: min(760px, calc(100vh - 40px)); display: grid; grid-template-columns: 1fr;
      background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 40px 90px rgba(0,0,0,.7); animation: up .25s ease; }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes up { from { opacity: 0; transform: translateY(24px) scale(.98); } to { opacity: 1; transform: none; } }

    .panel { position: relative; overflow-y: auto; padding: 56px 52px 40px; color: var(--ink); }
    .x { position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: 0; cursor: pointer;
      background: transparent; color: var(--ink); font-size: 1.05rem; transition: .15s; }
    .x:hover { background: var(--bg-soft); }

    .big { font: 500 clamp(2.2rem, 4vw, 3.1rem)/1.05 'Cormorant Garamond', Georgia, serif; text-transform: uppercase; letter-spacing: .02em; margin-bottom: 18px; }
    .intro { color: var(--ink); font-size: 1.02rem; line-height: 1.55; margin-bottom: 24px; max-width: 520px; }

    .recap { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; padding: 18px 0; margin-bottom: 26px;
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .lbl { display: block; font-size: .7rem; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); font-weight: 700; margin-bottom: 4px; }
    .recap strong { display: block; font-size: 1.15rem; line-height: 1.25; }
    .recap small { display: block; color: var(--muted); font-size: .88rem; margin-top: 2px; }
    .price { text-align: right; white-space: nowrap; font: 700 1.9rem 'Playfair Display', Georgia, serif; }
    .price small { display: inline; font-size: .9rem; margin: 0; }
    .nt { display: block; font: 600 .7rem sans-serif; color: var(--muted); letter-spacing: .03em; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { margin-bottom: 16px; }
    .field label { font-size: .85rem; font-weight: 700; color: var(--ink); margin-bottom: 7px; }
    .field label i { font-style: normal; font-weight: 500; }
    .opt { font-weight: 500; color: var(--muted); }
    .field input, .field textarea { background: #fff; border: 1px solid var(--ink); border-radius: 999px; padding: 12px 20px; }
    .field textarea { border-radius: 24px; resize: none; }
    .field input:focus, .field textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-soft); }
    .phone { display: flex; }
    .phone span { display: grid; place-items: center; padding: 0 14px 0 18px; background: #fff; border: 1px solid var(--ink);
      border-right: 0; border-radius: 999px 0 0 999px; color: var(--muted); font-weight: 700; }
    .field .phone input { border-radius: 0 999px 999px 0; padding-left: 10px; }
    .avail { font-size: .85rem; margin-top: 6px; font-weight: 700; }
    .avail.ok { color: var(--ok); } .avail.no { color: var(--red); }

    .actions { display: flex; justify-content: flex-end; align-items: center; gap: 22px; margin-top: 8px; }
    .cancel { background: none; border: 0; cursor: pointer; font: inherit; font-size: .8rem; font-weight: 700; letter-spacing: .12em;
      text-transform: uppercase; color: var(--muted); }
    .cancel:hover { color: var(--ink); }
    .go { background: var(--ink); color: #fff; border: 0; border-radius: 999px; padding: 15px 32px; cursor: pointer; font: inherit;
      font-size: .78rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; transition: .2s; }
    .go:hover { background: var(--gold-dark); transform: translateY(-2px); }
    .go:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    @media (max-width: 800px) {
      .backdrop { align-items: flex-end; padding: 0; }
      .modal { grid-template-columns: 1fr; height: 96vh; border-radius: 14px 14px 0 0; }
      .panel { padding: 28px 22px 28px; }
      .x { background: rgba(255,255,255,.85); }
      .row { grid-template-columns: 1fr; gap: 0; }
      .recap { flex-direction: column; align-items: flex-start; }
      .price { text-align: left; }
      .actions { justify-content: space-between; }
    }
  `],
})
export class ReservationFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private api = inject(ReservationService);
  private router = inject(Router);
  private cart = inject(CartService);
  private doc = inject(DOCUMENT);

  // Le choix est fait dans la page (cartes de prix) et transmis ici
  @Input() category: 'soiree' | 'shooting' = 'soiree';
  @Input() eventType: string | null = null;
  @Input() options: SoireeOptions | null = null;
  @Input() shootingType: string | null = null;
  @Input() shootingOption: string | null = null;
  @Output() closed = new EventEmitter<void>();

  today = new Date().toLocaleDateString('en-CA');
  availability: Availability | null = null;
  loading = false;
  error = '';

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    cin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    lieu: ['', Validators.required],
    date: ['', Validators.required],
    message: [''],
    mariePrenomHomme: [''],
    mariePrenomFemme: [''],
  });

  constructor() {
    this.doc.body.style.overflow = 'hidden'; // bloque le défilement derrière la fenêtre
    this.form.controls.date.valueChanges.subscribe(() => this.checkAvailability());
  }

  ngOnDestroy() {
    this.doc.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  close() {
    this.closed.emit();
  }

  get summary(): { title: string; detail?: string; price: number } | null {
    if (this.category === 'soiree') {
      const t = EVENT_TYPES.find((x) => x.id === this.eventType);
      return t && this.options ? { title: t.label, detail: soireeSummary(this.options), price: soireePrice(this.options) } : null;
    }
    const t = SHOOTING_TYPES.find((x) => x.id === this.shootingType);
    const o = SHOOTING_OPTIONS.find((x) => x.id === this.shootingOption);
    return t && o ? { title: `${t.name} – ${o.name}`, price: o.price } : null;
  }

  get dateFull() {
    return this.category === 'soiree' && !!this.availability && !this.availability.available;
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
    this.error = '';
    if (!this.summary) {
      this.error = 'Veuillez sélectionner une formule.';
      return;
    }
    const mariage = this.category === 'soiree' && this.eventType === 'mariage';
    const v = this.form.getRawValue();
    if (mariage) {
      // prénoms du marié et de la mariée obligatoires pour un mariage
      for (const k of ['mariePrenomHomme', 'mariePrenomFemme'] as const) {
        if (!v[k].trim()) this.form.controls[k].setErrors({ required: true });
      }
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const base = { nom: v.nom, prenom: v.prenom, cin: v.cin, telephone: v.telephone, lieu: v.lieu, date: v.date, message: v.message };
    const payload =
      this.category === 'soiree'
        ? { category: 'soiree' as const, eventType: this.eventType!, options: this.options!, ...base, ...(mariage ? { mariePrenomHomme: v.mariePrenomHomme.trim(), mariePrenomFemme: v.mariePrenomFemme.trim() } : {}) }
        : { category: 'shooting' as const, shootingType: this.shootingType!, shootingOption: this.shootingOption!, ...base };

    this.loading = true;
    this.api.create(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.cart.add(res.id);                 // ajoute la réservation au panier
        this.router.navigateByUrl('/panier');  // et ouvre le panier
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || (err.status ? `Erreur serveur (${err.status})` : 'Impossible de contacter le serveur.');
        this.checkAvailability();
      },
    });
  }
}
