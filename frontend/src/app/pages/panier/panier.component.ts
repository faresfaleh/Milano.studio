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
    <!-- ===== Haut de page (comme Services) ===== -->
    <section class="head">
      <div class="wrap">
        <div class="htop">
          <span class="htl">Mes réservations</span>
          <span class="line"></span>
          <span class="star">✦</span>
          <span class="htr">Soirées<br />Mariages<br />Shootings</span>
        </div>
        <h1 class="giant">Mon panier</h1>
        <div class="rule"><i></i><b>◆</b><i></i></div>
        <p class="lede">Les réservations faites depuis cet appareil.</p>
      </div>
    </section>

    <section class="main">
      <div class="wrap narrow">
        @if (error) { <div class="alert err">{{ error }}</div> }

        @if (loading) {
          <p class="hint">Chargement...</p>
        } @else if (items.length === 0) {
          <div class="empty">
            <span class="pic big"><app-icon name="cart" size="2.2rem" /></span>
            <h3>Votre panier est vide</h3>
            <p>Choisissez une formule de soirée ou un shooting pour réserver votre date.</p>
            <a routerLink="/services" class="go">Faire une réservation</a>
          </div>
        } @else {
          <div class="alert ok"><app-icon name="check" size="1.3em" /><span>Votre réservation est enregistrée. Nous vous contacterons très bientôt pour la confirmer.</span></div>

          <h2 class="stl"><span>Vos réservations</span></h2>
          <ul class="plist">
            @for (i of items; track i._id) {
              <li>
                <div class="item">
                  <span class="pic"><app-icon [name]="icon(i)" size="1.5rem" /></span>
                  <div class="info">
                    <strong class="tt">{{ title(i) }}</strong>
                    @if (detail(i)) { <p class="dt">{{ detail(i) }}</p> }
                    <p class="meta">
                      <span><app-icon name="calendar" size="1.05em" /> {{ fmt(i.day) }}</span>
                      <span><app-icon name="pin" size="1.05em" /> {{ i.lieu }}</span>
                    </p>
                    <p class="who">{{ i.nom }} {{ i.prenom }}</p>
                    <span class="st {{ i.status }}">{{ L(i.status) }}</span>
                  </div>
                  <div class="side">
                    <b>{{ i.price ? i.price + ' DT' : 'Sur devis' }}</b>
                    <button type="button" class="rm" (click)="remove(i._id)">Retirer</button>
                  </div>
                </div>
              </li>
            }
          </ul>

          <div class="total">
            <div class="tl"><span>Total</span><small>Prix sans transport</small></div>
            <strong>{{ total }} <small>DT</small></strong>
          </div>

          <h2 class="stl"><span>Une question ?</span></h2>
          <div class="contact">
            @for (p of s.phones; track p) {
              <a [href]="'tel:' + p.replaceAll(' ', '')"><span class="ci"><app-icon name="phone" size="1.1rem" /></span>{{ p }}</a>
            }
            <a [href]="'mailto:' + s.email"><span class="ci"><app-icon name="mail" size="1.1rem" /></span>{{ s.email }}</a>
          </div>

          <div class="more">
            <a routerLink="/services" class="again">+ Ajouter une autre réservation</a>
          </div>
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
    .narrow { max-width: 760px; }

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
    .hint { text-align: center; color: var(--muted); font-style: italic; }

    /* ---------- messages ---------- */
    .alert { display: flex; align-items: center; gap: 14px; padding: 16px 26px; border-radius: 999px; margin-bottom: 40px; font-size: .98rem; line-height: 1.45; }
    .alert app-icon { flex: none; }
    .alert.ok { background: var(--cream-2); border: 1px solid rgba(185,121,95,.45); color: var(--wine); }
    .alert.ok app-icon { color: var(--rose); }
    .alert.err { background: #f6dcd8; border: 1px solid #e3b4ad; color: #8f1d17; margin-bottom: 26px; }

    /* ---------- réservations (cartes arrondies, même style que Services) ---------- */
    .plist { list-style: none; margin-bottom: 40px; }
    .plist li { position: relative; }
    .plist li + li { margin-top: 20px; }
    .plist li::before { content: ''; position: absolute; left: 7%; right: 7%; top: -7px; height: 60%; border-radius: 40px; background: var(--rose-soft); opacity: .28; z-index: 0; }
    .item { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 20px; padding: 24px 34px 24px 22px; border-radius: 44px;
      background: linear-gradient(180deg, #fcf3ec, #f2e1d6); border: 1px solid rgba(185,121,95,.35);
      box-shadow: 0 10px 22px rgba(74,22,34,.10), inset 0 1px 0 rgba(255,255,255,.8); }
    .pic { width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--rose); color: var(--rose); display: grid; place-items: center; flex: none; }
    .pic.big { width: 84px; height: 84px; margin: 0 auto 22px; }
    .info { flex: 1; min-width: 0; }
    .tt { display: block; font: 500 .8rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); margin-bottom: 6px; }
    .dt { color: var(--muted); font-size: .95rem; line-height: 1.45; margin-bottom: 8px; }
    .meta { display: flex; flex-wrap: wrap; gap: 4px 20px; color: var(--muted); font-size: .95rem; }
    .meta span { display: inline-flex; align-items: center; gap: 7px; }
    .meta app-icon { color: var(--rose); }
    .who { color: var(--wine); font-size: .95rem; margin: 6px 0 12px; }
    .st { display: inline-block; padding: 4px 16px; border-radius: 999px; font: 500 .66rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; }
    .st.en_attente { background: #f3dccd; color: #8a4a30; border: 1px solid #e3bfa9; }
    .st.confirmee { background: #dff0e5; color: #2a6a47; border: 1px solid #b7dcc4; }
    .st.annulee { background: #f6dcd8; color: #8f1d17; border: 1px solid #e3b4ad; }
    .side { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; align-self: stretch; gap: 14px; }
    .side b { font: 400 1.7rem 'Italiana', Georgia, serif; color: var(--rose); white-space: nowrap; }
    .rm { padding: 7px 18px; background: transparent; border: 1px solid var(--rose); border-radius: 999px; color: var(--wine); cursor: pointer;
      font: 400 .66rem 'Jost', sans-serif; letter-spacing: .2em; text-transform: uppercase; transition: background .25s, color .25s, border-color .25s; }
    .rm:hover { background: var(--wine); border-color: var(--wine); color: var(--cream); }

    /* ---------- total ---------- */
    .total { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 38px; margin-bottom: 46px; border-radius: 999px; color: var(--cream);
      background: radial-gradient(ellipse at 100% 0%, rgba(255,255,255,.09), transparent 55%), var(--wine-2); border: 1px solid rgba(217,164,140,.5); box-shadow: 0 22px 46px rgba(58,15,25,.3); }
    .tl { display: flex; flex-direction: column; line-height: 1.3; }
    .tl span { font-size: .78rem; letter-spacing: .3em; text-transform: uppercase; color: var(--rose-2); }
    .tl small { font-size: .8rem; color: rgba(247,235,227,.6); margin-top: 2px; }
    .total strong { font: 400 3rem/1 'Italiana', Georgia, serif; color: var(--cream); }
    .total strong small { font-size: 1.1rem; color: var(--rose-2); letter-spacing: .06em; }

    /* ---------- contact ---------- */
    .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-bottom: 44px; }
    .contact a { display: inline-flex; align-items: center; gap: 12px; padding: 8px 26px 8px 8px; border-radius: 999px; color: var(--wine); font-size: 1rem;
      background: linear-gradient(180deg, #fcf3ec, #f2e1d6); border: 1px solid rgba(185,121,95,.35); box-shadow: 0 8px 18px rgba(74,22,34,.08); transition: background .3s, color .3s, transform .3s; }
    .contact a:hover { background: var(--wine); color: var(--cream); transform: translateY(-2px); }
    .ci { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--rose); color: var(--rose); }
    .contact a:hover .ci { border-color: var(--rose-soft); color: var(--rose-2); }

    /* ---------- boutons ---------- */
    .more { text-align: center; }
    .go, .again { display: inline-flex; align-items: center; justify-content: center; padding: 15px 34px; border-radius: 999px; font: 400 .76rem 'Jost', sans-serif; letter-spacing: .24em; text-transform: uppercase; transition: background .25s, color .25s, border-color .25s; }
    .go { background: var(--wine); color: var(--cream); border: 1px solid var(--wine); }
    .go:hover { background: var(--rose); border-color: var(--rose); }
    .again { background: transparent; color: var(--wine); border: 1px solid var(--rose); }
    .again:hover { background: var(--wine); border-color: var(--wine); color: var(--cream); }

    .empty { text-align: center; padding: 44px 30px 48px; border-radius: 44px; background: linear-gradient(180deg, #fcf3ec, #f2e1d6); border: 1px solid rgba(185,121,95,.35);
      box-shadow: 0 14px 30px rgba(74,22,34,.10); }
    .empty h3 { font: 400 2rem/1.15 'Italiana', Georgia, serif; text-transform: uppercase; letter-spacing: .04em; color: var(--wine); margin-bottom: 8px; }
    .empty p { color: var(--muted); margin: 0 auto 26px; max-width: 420px; }

    @media (max-width: 780px) {
      .htop { font-size: 9px; letter-spacing: .14em; gap: 10px; }
      .htr { letter-spacing: .14em; line-height: 1.5; }
      .giant { font-size: 12.6vw; margin: 14px 0 4px; }
      .rule { width: 46%; margin-bottom: 18px; }
      .lede { font-size: .95rem; padding-left: 14px; }
      .main { padding: 30px 0 70px; }
    }
    @media (max-width: 560px) {
      .alert { border-radius: 28px; padding: 14px 20px; }
      .item { flex-wrap: wrap; gap: 14px; padding: 20px 20px 18px 16px; border-radius: 30px; }
      .info { flex-basis: calc(100% - 70px); }
      .side { flex-direction: row; align-items: center; justify-content: space-between; align-self: auto; flex-basis: 100%; padding-top: 12px; border-top: 1px solid rgba(185,121,95,.3); }
      .plist li::before { border-radius: 30px; }
      .total { padding: 18px 26px; }
      .total strong { font-size: 2.5rem; }
      .contact a { width: 100%; }
      .empty { border-radius: 30px; padding: 36px 20px 40px; }
      .stl { letter-spacing: .22em; gap: 12px; font-size: .78rem; }
    }
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

  icon(i: CartItem) { return i.category === 'shooting' ? 'camera' : ({ soiree_homme: 'man', soiree_femme: 'woman', mariage: 'rings' } as Record<string, string>)[i.eventType ?? ''] ?? 'calendar'; }
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
