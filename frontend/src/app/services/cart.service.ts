import { Injectable, computed, signal } from '@angular/core';

// Le panier garde les identifiants des réservations faites depuis cet appareil
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly KEY = 'milano_cart';

  ids = signal<string[]>(this.load());
  count = computed(() => this.ids().length);

  add(id: string) {
    if (this.ids().includes(id)) return;
    this.ids.set([...this.ids(), id]);
    this.save();
  }

  remove(id: string) {
    this.ids.set(this.ids().filter((x) => x !== id));
    this.save();
  }

  private load(): string[] {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }

  private save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.ids()));
    } catch {}
  }
}
