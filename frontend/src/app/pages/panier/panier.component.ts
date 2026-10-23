import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/reservation.model';
import { IconComponent } from '../../components/icon/icon.component';
import { CartService } from '../../services/cart.service';
import { ReservationService } from '../../services/reservation.service';
import { LABELS, SHOOTING_TYPES, STUDIO, soireeSummary } from '../../studio.config';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <section class="section soft">
      <div class="container narrow">
        <div class="section-head">
          <span class="eyebrow">Panier</span>
          <h2>Mes <em class="it">réservations</em></h2>
          <p>Les réservations faites depuis cet appareil.</p>
        </div>

        @if (error) { <div class="alert alert-err">{{ error }}</div> }

        @if (loading) {
          <p class="muted center">Chargement...</p>
        } @else if (items.length === 0) {
          <div class="card empty">
            <div class="big"><app-icon name="cart" size="2.8rem" /></div>
            <h3>Votre panier est vide</h3>
            <p>Choisissez une formule de soirée ou un shooting pour réserver votre date.</p>
            <div class="btns">
              <a routerLink="/services" class="btn btn-red">Faire une réservation</a>
            </div>
          </div>
        } @else {
          <div class="alert alert-ok"><app-icon name="check" size="1.25em" /> Votre réservation est enregistrée. Nous vous contacterons très bientôt pour la confirmer.</div>

          @for (i of items; track i._id) {
            <div class="card item">
              <div class="info">
                <h3>{{ title(i) }}</h3>
                @if (detail(i)) { <p class="who">{{ detail(i) }}</p> }
                <p class="meta">
                  <span><app-icon name="calendar" size="1.05em" /> {{ fmt(i.day) }}</span>
                  <span><app-icon name="pin" size="1.05em" /> {{ i.lieu }}</span>
                </p>
                <p class="who">{{ i.nom }} {{ i.prenom }}</p>
                <span class="st {{ i.status }}">{{ L(i.status) }}</span>
              </div>
              <div class="side">
                <b>{{ i.price ? i.price + ' DT' : 'Sur devis' }}</b>
                <button class="rm" (click)="remove(i._id)">Retirer</button>
              </div>
            </div>
          }

          <div class="card total">
            <span>Total</span>
            <strong>{{ total }} DT</strong>
          </div>

          <div class="card contact">
            <h3>Une question ? Appelez le studio</h3>
            @for (p of s.phones; track p) {
              <a [href]="'tel:' + p.replaceAll(' ', '')"><app-icon name="phone" size="1.05em" /> {{ p }}</a>
            }
            <a [href]="'mailto:' + s.email"><app-icon name="mail" size="1.05em" /> {{ s.email }}</a>
          </div>

          <div class="more">
            <a routerLink="/services" class="btn btn-outline">+ Ajouter une autre réservation</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .narrow { max-width: 780px; }
    .muted { color: var(--muted); } .center { text-align: center; }
    .empty { text-align: center; padding: 48px 30px; }
    .big { color: var(--gold-dark); margin-bottom: 10px; }
    .empty p { color: var(--muted); margin: 8px 0 24px; }
    .btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .item { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 16px; padding: 24px; }
    .info h3 { font-size: 1.15rem; margin-bottom: 8px; }
    .info p { color: var(--muted); font-size: .92rem; }
    .meta { display: flex; flex-wrap: wrap; gap: 6px 20px; }
    .meta span { display: inline-flex; align-items: center; gap: 7px; }
    .meta app-icon { color: var(--gold-dark); }
    .alert app-icon { vertical-align: -0.22em; margin-right: 8px; }
    .who { margin: 4px 0 10px; }
    .side { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
    .side b { font-family: 'Playfair Display', Georgia, serif; font-size: 1.4rem; color: var(--gold-dark); }
    .rm { background: none; border: 0; color: var(--muted); cursor: pointer; font: 500 .85rem 'Cormorant Garamond', Georgia, serif; text-decoration: underline; }
    .rm:hover { color: var(--red); }
    .st { display: inline-block; padding: 3px 12px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .st.en_attente { background: #fff4d9; color: #9a6500; }
    .st.confirmee { background: #e0f5ea; color: #0c7a45; }
    .st.annulee { background: var(--red-soft); color: var(--red-dark); }
    .total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 20px 24px; }
    .total strong { font-family: 'Playfair Display', Georgia, serif; font-size: 1.7rem; color: var(--gold-dark); }
    .contact { margin-bottom: 20px; padding: 22px 24px; }
    .contact h3 { font-size: 1.05rem; margin-bottom: 12px; }
    .contact a { display: flex; align-items: center; gap: 10px; padding: 4px 0; color: var(--muted); }
    .contact a app-icon { color: var(--gold-dark); }
    .contact a:hover { color: var(--gold-dark); }
    .more { text-align: center; }
    @media (max-width: 560px) { .item { flex-direction: column; } .side { align-items: flex-start; gap: 10px; } }
  `],
})
export class PanierComponent implements OnInit {
  private api = inject(ReservationService);
  private cart = inject(CartService);

  s = STUDIO;
  items: CartItem[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    const ids = this.cart.ids();
    if (!ids.length) {
      this.loading = false;
      return;
    }
    this.api.mine(ids).subscribe({
      next: (rows) => {
        this.items = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        // retire du panier les réservations qui n'existent plus
        const found = new Set(rows.map((r) => r._id));
        ids.filter((id) => !found.has(id)).forEach((id) => this.cart.remove(id));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de charger le panier. Vérifiez que le serveur est lancé.';
      },
    });
  }

  L(k?: string) { return (k && LABELS[k]) || k || ''; }
  fmt(d: string) { return d ? d.split('-').reverse().join('/') : ''; }

  title(i: CartItem) {
    return i.category === 'soiree'
      ? (i.options ? this.L(i.eventType) : `${this.L(i.eventType)} – Formule ${this.L(i.pack)}`)
      : `${SHOOTING_TYPES.find((t) => t.id === i.shootingType)?.name ?? 'Shooting'} – ${this.L(i.shootingOption)}`;
  }

  detail(i: CartItem) { return i.category === 'soiree' && i.options ? soireeSummary(i.options) : ''; }

  get total() {
    return this.items
      .filter((i) => i.status !== 'annulee')
      .reduce((sum, i) => sum + (i.price || 0), 0);
  }

  remove(id: string) {
    this.cart.remove(id);
    this.items = this.items.filter((i) => i._id !== id);
  }
}
