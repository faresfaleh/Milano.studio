import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability, CartItem, FlashCheck, FlashRow, Reservation, ReservationPayload } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private api = '/api/reservations';

  create(payload: ReservationPayload): Observable<{ message: string; id: string }> {
    return this.http.post<{ message: string; id: string }>(this.api, payload);
  }

  availability(day: string): Observable<Availability> {
    return this.http.get<Availability>(`${this.api}/availability`, { params: { day } });
  }

  mine(ids: string[]): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.api}/mine`, { params: { ids: ids.join(',') } });
  }

  // Mon flash (public)
  flashCheck(q: { type: string; day: string; nom?: string; prenomHomme?: string; prenomFemme?: string }): Observable<FlashCheck> {
    return this.http.get<FlashCheck>(`${this.api}/flash/check`, {
      params: { type: q.type, day: q.day, nom: q.nom || '', prenomHomme: q.prenomHomme || '', prenomFemme: q.prenomFemme || '' },
    });
  }

  // --- Monteur / Admin ---
  whoami(key: string): Observable<{ role: 'admin' | 'monteur' }> {
    return this.http.get<{ role: 'admin' | 'monteur' }>(`${this.api}/flash/whoami`, this.headers(key));
  }
  flashList(key: string): Observable<FlashRow[]> {
    return this.http.get<FlashRow[]>(`${this.api}/flash/list`, this.headers(key));
  }
  setFlash(key: string, id: string, ready: boolean) {
    return this.http.patch<{ _id: string; flashReady: boolean; flashReadyAt?: string }>(`${this.api}/${id}/flash`, { ready }, this.headers(key));
  }

  // --- Admin ---
  private headers(key: string) {
    return { headers: new HttpHeaders({ 'x-admin-key': key }) };
  }
  list(key: string): Observable<{ max: number; items: Reservation[] }> {
    return this.http.get<{ max: number; items: Reservation[] }>(this.api, this.headers(key));
  }
  setStatus(key: string, id: string, status: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.api}/${id}/status`, { status }, this.headers(key));
  }
  remove(key: string, id: string) {
    return this.http.delete(`${this.api}/${id}`, this.headers(key));
  }
}
