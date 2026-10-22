import { Injectable, effect, signal } from '@angular/core';
import { AR } from './translations';

export type Lang = 'fr' | 'ar';

const norm = (s: string) => s.replace(/[’‘]/g, "'").replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

const EXACT = new Map<string, string>();
const LOWER = new Map<string, string>();
for (const [k, v] of Object.entries(AR)) {
  EXACT.set(norm(k), v);
  LOWER.set(norm(k).toLowerCase(), v);
}

function lookup(s: string): string | undefined {
  return EXACT.get(s) ?? LOWER.get(s.toLowerCase());
}

function translate(input: string): string {
  const s = norm(input);
  if (!s) return input;
  const direct = lookup(s);
  if (direct) return direct;

  // « Erreur serveur (500) »
  const m = /^Erreur serveur \((\d+)\)$/.exec(s);
  if (m) return `خطأ في الخادم (${m[1]})`;

  // Textes composés : « a + b », « a – b », « a • b » → on traduit chaque morceau
  for (const sep of [' • ', ' – ', ' + ']) {
    if (s.includes(sep)) {
      const parts = s.split(sep).map((p) => translate(p));
      return parts.join(sep);
    }
  }
  return input;
}

@Injectable({ providedIn: 'root' })
export class I18n {
  lang = signal<Lang>(this.load());
  staff = signal(false); // pages admin / monteur : toujours en français

  constructor() {
    effect(() => {
      const l = this.staff() ? 'fr' : this.lang();
      const root = document.documentElement;
      root.lang = l;
      root.dir = l === 'ar' ? 'rtl' : 'ltr';
      try { localStorage.setItem('milano_lang', l); } catch { /* ignore */ }
    });
  }

  private load(): Lang {
    try { return localStorage.getItem('milano_lang') === 'ar' ? 'ar' : 'fr'; } catch { return 'fr'; }
  }

  get isAr() { return this.lang() === 'ar'; }

  toggle() { this.lang.set(this.lang() === 'fr' ? 'ar' : 'fr'); }

  t(s: string): string {
    return this.lang() === 'ar' && !this.staff() && s ? translate(s) : s;
  }
}
