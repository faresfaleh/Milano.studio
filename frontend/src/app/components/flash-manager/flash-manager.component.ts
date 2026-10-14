import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlashRow } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { LABELS } from '../../studio.config';

// Suivi des flashs : le monteur (ou l'admin) indique si le flash d'une soirée est prêt
@Component({
  selector: 'app-flash-manager',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card box">
      <h3>Flashs de soirée <small>({{ readyCount }} prêts / {{ rows.length }})</small></h3>
      @if (error) { <div class="alert alert-err">{{ error }}</div> }
      <div class="filters">
        <input [(ngModel)]="search" placeholder="Rechercher (nom, lieu, date)..." />
        <select [(ngModel)]="filter">
          <option value="todo">Flash pas prêt</option>
          <option value="done">Flash prêt</option>
          <option value="">Tous</option>
        </select>
      </div>
      <div class="scroll">
        <table>
          <thead><tr><th>Date</th><th>Soirée</th><th>Client</th><th>Lieu</th><th>Flash</th></tr></thead>
          <tbody>
            @for (r of filtered; track r._id) {
              <tr>
                <td><strong>{{ fmt(r.day) }}</strong></td>
                <td>{{ L(r.eventType) }}</td>
                <td>
                  @if (r.eventType === 'mariage' && r.mariePrenomHomme) {
                    {{ r.mariePrenomHomme }} &amp; {{ r.mariePrenomFemme }} <small class="muted">({{ r.nom }} {{ r.prenom }})</small>
                  } @else { {{ r.nom }} {{ r.prenom }} }
                </td>
                <td>{{ r.lieu }}</td>
                <td>
                  <button class="tog" [class.on]="r.flashReady" [disabled]="busy === r._id" (click)="toggle(r)">
                    {{ r.flashReady ? '✔ Prêt' : 'Pas prêt' }}
                  </button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="muted center">Aucune soirée.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .box { padding: 24px; margin-bottom: 24px; }
    .box h3 { margin-bottom: 16px; font-size: 1.1rem; } .box h3 small { color: var(--muted); font-weight: 500; }
    .muted { color: var(--muted); } .center { text-align: center; }
    .filters { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 18px; }
    .scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: .88rem; }
    th, td { padding: 12px 10px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
    th { color: var(--muted); font-weight: 600; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; }
    .tog { padding: 6px 14px; border-radius: 99px; border: 1px solid #f0dca8; background: #fff4d9; color: #9a6500; font: inherit; font-size: .8rem; font-weight: 600; cursor: pointer; }
    .tog.on { border-color: #b6e6cc; background: #e0f5ea; color: #0c7a45; }
    .tog:disabled { opacity: .5; cursor: wait; }
    @media (max-width: 700px) { .filters { grid-template-columns: 1fr; } }
  `],
})
export class FlashManagerComponent implements OnInit {
  @Input({ required: true }) adminKey = '';
  private api = inject(ReservationService);

  rows: FlashRow[] = [];
  search = '';
  filter = 'todo';
  error = '';
  busy = '';

  ngOnInit() { this.load(); }

  load() {
    this.api.flashList(this.adminKey).subscribe({
      next: (r) => (this.rows = r),
      error: (e) => (this.error = e.error?.message || 'Erreur'),
    });
  }

  get readyCount() { return this.rows.filter((r) => r.flashReady).length; }

  get filtered(): FlashRow[] {
    const q = this.search.trim().toLowerCase();
    return this.rows.filter((r) => {
      if (this.filter === 'todo' && r.flashReady) return false;
      if (this.filter === 'done' && !r.flashReady) return false;
      return !q || [r.nom, r.prenom, r.mariePrenomHomme, r.mariePrenomFemme, r.lieu, this.fmt(r.day)].join(' ').toLowerCase().includes(q);
    });
  }

  toggle(r: FlashRow) {
    this.error = '';
    this.busy = r._id;
    this.api.setFlash(this.adminKey, r._id, !r.flashReady).subscribe({
      next: (u) => { r.flashReady = u.flashReady; r.flashReadyAt = u.flashReadyAt; this.busy = ''; },
      error: (e) => { this.error = e.error?.message || 'Erreur'; this.busy = ''; },
    });
  }

  L(k: string) { return LABELS[k] || k; }
  fmt(d: string) { return d ? d.split('-').reverse().join('/') : ''; }
}
