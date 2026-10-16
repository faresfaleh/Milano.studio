import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/reservation.model';
import { IconComponent } from '../../components/icon/icon.component';
import { ReservationService } from '../../services/reservation.service';
import { LABELS, STUDIO, soireeSummary } from '../../studio.config';

interface DayRow { day: string; count: number; full: boolean; }

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <section class="section soft">
      <div class="container">
        @if (!logged) {
          <div class="card login">
            <h2>Espace admin</h2>
            <p>Entrez la clé admin pour accéder aux réservations.</p>
            <input type="password" [(ngModel)]="key" placeholder="Clé admin" (keyup.enter)="login()" />
            @if (error) { <p class="error">{{ error }}</p> }
            <button class="btn btn-red" (click)="login()">Se connecter</button>
          </div>
        } @else {
          <div class="top">
            <h2>Tableau de bord</h2>
            <div class="top-actions">
              <button class="btn btn-outline btn-sm" (click)="refresh()">↻ Actualiser</button>
              <button class="btn btn-dark btn-sm" (click)="logout()">Déconnexion</button>
            </div>
          </div>
          @if (error) { <div class="alert alert-err">{{ error }}</div> }
          @if (info) {
            <div class="alert alert-ok">{{ info }}
              @if (waUrl) { <a class="wa-link" [href]="waUrl" target="_blank" rel="noopener">💬 Envoyer sur WhatsApp</a> }
            </div>
          }

          <div class="stats">
            <div class="stat"><span>Total</span><b>{{ items.length }}</b></div>
            <div class="stat"><span>En attente</span><b class="warn">{{ count('en_attente') }}</b></div>
            <div class="stat"><span>Confirmées</span><b class="ok">{{ count('confirmee') }}</b></div>
            <div class="stat"><span>Annulées</span><b class="no">{{ count('annulee') }}</b></div>
          </div>

          <div class="card box">
            <h3>Disponibilité des soirées <small>(max {{ max }} par jour)</small></h3>
            @if (days.length === 0) { <p class="muted">Aucune soirée à venir.</p> }
            <div class="days">
              @for (d of days; track d.day) {
                <div class="day" [class.full]="d.full">
                  <strong>{{ fmt(d.day) }}</strong>
                  <div class="bar"><i [style.width.%]="(d.count / max) * 100"></i></div>
                  <span>{{ d.count }}/{{ max }} {{ d.full ? '• Complet' : '' }}</span>
                </div>
              }
            </div>
          </div>

          <div class="card box">
            <div class="filters">
              <input [(ngModel)]="search" placeholder="Rechercher (nom, CIN, tél, lieu)..." />
              <select [(ngModel)]="fCategory">
                <option value="">Toutes catégories</option>
                <option value="soiree">Soirées</option>
                <option value="shooting">Shootings</option>
              </select>
              <select [(ngModel)]="fStatus">
                <option value="">Tous statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmées</option>
                <option value="annulee">Annulées</option>
              </select>
            </div>

            <div class="scroll">
              <table>
                <thead>
                  <tr><th>Date</th><th>Service</th><th>Client</th><th>CIN</th><th>Téléphone</th><th>Lieu</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  @for (r of filtered; track r._id) {
                    <tr>
                      <td><strong>{{ fmt(dayOf(r)) }}</strong></td>
                      <td>
                        @if (r.category === 'soiree') { {{ L(r.eventType) }} <small>({{ r.options ? soireeText(r.options) : L(r.pack) }})</small> }
                        @else { {{ shootLabel(r) }} <small>({{ L(r.shootingOption) }})</small> }
                      </td>
                      <td>{{ r.nom }} {{ r.prenom }}</td>
                      <td>{{ r.cin }}</td>
                      <td><a [href]="'tel:' + r.telephone">{{ r.telephone }}</a></td>
                      <td>{{ r.lieu }}</td>
                      <td>{{ r.price ? r.price + ' DT' : '—' }}</td>
                      <td><span class="st {{ r.status }}">{{ L(r.status) }}</span></td>
                      <td class="acts">
                        <button class="a ok" title="Confirmer" (click)="set(r, 'confirmee')">✔</button>
                        @if (r.status === 'confirmee') {
                          <a class="a" title="Envoyer la confirmation sur WhatsApp" [href]="whatsappLink(r)" target="_blank" rel="noopener">💬</a>
                          <a class="a" title="Envoyer la confirmation par SMS (depuis un téléphone)" [href]="smsLink(r)">📱</a>
                        }
                        <button class="a no" title="Annuler" (click)="set(r, 'annulee')">✖</button>
                        <button class="a" title="Supprimer" (click)="del(r)"><app-icon name="trash" size="1.1em" /></button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="9" class="muted center">Aucune réservation.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .login { max-width: 420px; margin: 40px auto; text-align: center; }
    .login h2 { margin-bottom: 8px; } .login p { color: var(--muted); margin-bottom: 18px; }
    .login input { margin-bottom: 14px; }
    .top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
    .top-actions { display: flex; gap: 10px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; }
    .stat span { color: var(--muted); font-size: .85rem; display: block; }
    .stat b { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; }
    .warn { color: var(--warn); } .ok { color: var(--ok); } .no { color: var(--red); }
    .box { padding: 24px; margin-bottom: 24px; }
    .box h3 { margin-bottom: 16px; font-size: 1.1rem; } .box h3 small { color: var(--muted); font-weight: 500; }
    .muted { color: var(--muted); } .center { text-align: center; }
    .days { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
    .day { border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; font-size: .88rem; }
    .day.full { border-color: var(--red); background: var(--red-soft); }
    .bar { height: 6px; background: var(--line); border-radius: 99px; margin: 8px 0; overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--ok); }
    .day.full .bar i { background: var(--red); }
    .filters { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 18px; }
    .scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .88rem; }
    th, td { padding: 12px 10px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
    th { color: var(--muted); font-weight: 600; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; }
    td small { color: var(--muted); }
    .st { padding: 3px 11px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .st.en_attente { background: #fff4d9; color: #9a6500; }
    .st.confirmee { background: #e0f5ea; color: #0c7a45; }
    .st.annulee { background: var(--red-soft); color: var(--red-dark); }
    .acts { display: flex; gap: 6px; }
    .a { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line); background: var(--card-2); color: var(--text); cursor: pointer; font-size: .95rem; }
    .a:hover { background: var(--bg-soft); }
    .wa-link { display: inline-block; margin-left: 12px; padding: 6px 14px; border-radius: 8px; background: #25D366; color: #fff; font-weight: 700; text-decoration: none; }
    a.a { display: grid; place-items: center; text-decoration: none; }
    .a.ok { color: var(--ok); } .a.no { color: var(--red); }
    @media (max-width: 700px) { .filters { grid-template-columns: 1fr; } }
  `],
})
export class AdminComponent implements OnInit {
  private api = inject(ReservationService);

  key = '';
  logged = false;
  items: Reservation[] = [];
  max = 3;
  error = '';
  info = '';
  waUrl = '';

  search = '';
  fCategory = '';
  fStatus = '';

  ngOnInit() {
    const saved = sessionStorage.getItem('adminKey');
    if (saved) {
      this.key = saved;
      this.login();
    }
  }

  shootLabel(r: Reservation) {
    return r.shootingType ? 'Shooting ' + (r.shootingType === 'mariage' ? 'de mariage' : 'individuel') : 'Shooting';
  }
  soireeText = soireeSummary;

  // Message de confirmation
  messageText(r: Reservation) {
    const service = r.category === 'soiree'
      ? (r.options ? `${this.L(r.eventType)} (${soireeSummary(r.options)})` : `${this.L(r.eventType)} (${this.L(r.pack)})`)
      : `${this.shootLabel(r)} (${this.L(r.shootingOption)})`;
    const price = r.price ? ` Prix : ${r.price} DT (sans transport).` : '';
    return `Bonjour ${r.prenom}, Milano Studio confirme votre réservation : ${service}, le ${this.fmt(this.dayOf(r))} à ${r.lieu}.${price} Merci de votre confiance ! Contact : ${STUDIO.smsPhone}`;
  }

  // Lien WhatsApp : ouvre la discussion avec le client, message déjà écrit (WhatsApp Web ou application)
  whatsappLink(r: Reservation) {
    return `https://wa.me/216${r.telephone}?text=${encodeURIComponent(this.messageText(r))}`;
  }

  // Lien SMS : ouvre l'application Messages du téléphone (envoi depuis votre SIM)
  smsLink(r: Reservation) {
    return `sms:+216${r.telephone}?&body=${encodeURIComponent(this.messageText(r))}`;
  }
  L(k?: string) { return (k && LABELS[k]) || k || ''; }
  dayOf(r: Reservation) { return r.day || r.date.slice(0, 10); }
  fmt(d: string) { return d ? d.split('-').reverse().join('/') : ''; }
  count(status: string) { return this.items.filter((r) => r.status === status).length; }

  login() {
    this.error = '';
    this.api.list(this.key).subscribe({
      next: (res) => {
        this.items = res.items;
        this.max = res.max;
        this.logged = true;
        sessionStorage.setItem('adminKey', this.key);
      },
      error: (e) => {
        this.logged = false;
        sessionStorage.removeItem('adminKey');
        this.error = e.error?.message || (e.status ? `Erreur serveur (${e.status})` : 'Impossible de contacter le serveur');
      },
    });
  }

  refresh() {
    this.api.list(this.key).subscribe({
      next: (res) => { this.items = res.items; this.max = res.max; },
      error: (e) => (this.error = e.error?.message || 'Erreur'),
    });
  }

  logout() {
    sessionStorage.removeItem('adminKey');
    this.logged = false;
    this.key = '';
    this.items = [];
  }

  // Soirées à venir (hors annulées) avec le nombre par jour
  get days(): DayRow[] {
    const today = new Date().toLocaleDateString('en-CA');
    const map = new Map<string, number>();
    for (const r of this.items) {
      if (r.category !== 'soiree' || r.status === 'annulee') continue;
      const d = this.dayOf(r);
      if (d < today) continue;
      map.set(d, (map.get(d) || 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, count]) => ({ day, count, full: count >= this.max }));
  }

  get filtered(): Reservation[] {
    const q = this.search.trim().toLowerCase();
    return this.items.filter((r) => {
      if (this.fCategory && r.category !== this.fCategory) return false;
      if (this.fStatus && r.status !== this.fStatus) return false;
      if (!q) return true;
      return [r.nom, r.prenom, r.cin, r.telephone, r.lieu].join(' ').toLowerCase().includes(q);
    });
  }

  set(r: Reservation, status: string) {
    this.error = '';
    this.info = '';
    this.waUrl = '';
    this.api.setStatus(this.key, r._id, status).subscribe({
      next: (u) => {
        r.status = u.status;
        if (u.sms === 'sent') this.info = `SMS de confirmation envoyé à ${r.prenom} (+216 ${r.telephone}).`;
        else if (u.sms) {
          if (u.sms !== 'disabled') this.error = `Le SMS automatique n'est pas parti (${u.sms.replace('failed:', '')}).`;
          this.info = `Réservation confirmée pour ${r.prenom}.`;
          if (status === 'confirmee') this.waUrl = this.whatsappLink(r);
        }
      },
      error: (e) => (this.error = e.error?.message || 'Erreur'),
    });
  }

  del(r: Reservation) {
    if (!confirm('Supprimer cette réservation ?')) return;
    this.api.remove(this.key, r._id).subscribe(() => (this.items = this.items.filter((x) => x._id !== r._id)));
  }
}
