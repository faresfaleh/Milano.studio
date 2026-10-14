import { Component, Input } from '@angular/core';

// Icônes fines et élégantes (remplacent les émojis) : couleur = couleur du texte
@Component({
  selector: 'app-icon',
  standalone: true,
  host: { '[style.width]': 'size || null', '[style.height]': 'size || null' },
  template: `
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (name) {
        @case ('man') {
          <circle cx="24" cy="14" r="7" />
          <path d="M9 42c1-9 7-15 15-15s14 6 15 15" />
          <path d="M24 29l-2.5 3.5L24 41l2.5-8.5z" />
        }
        @case ('woman') {
          <circle cx="24" cy="12" r="6" />
          <path d="M20 19c-.5 5-1.500 8-5 11l-4 12h26l-4-12c-3.500-3-4.500-6-5-11" />
          <path d="M18 30h12" />
        }
        @case ('rings') {
          <circle cx="18" cy="30" r="9" />
          <circle cx="30" cy="30" r="9" />
          <path d="M24 6l3.500 4.500L24 15l-3.500-4.500z" />
        }
        @case ('camera') {
          <rect x="6" y="15" width="36" height="25" rx="3" />
          <circle cx="24" cy="27.500" r="7" />
          <path d="M17 15l2-6h10l2 6" />
        }
        @case ('cart') {
          <path d="M5 8h6l4.500 23h22L42 15H13" />
          <circle cx="19" cy="39" r="2.800" />
          <circle cx="34" cy="39" r="2.800" />
        }
        @case ('calendar') {
          <rect x="7" y="10" width="34" height="31" rx="3" />
          <path d="M7 20h34M16 6v8M32 6v8" />
        }
        @case ('pin') {
          <path d="M24 43s14-12.400 14-23a14 14 0 0 0-28 0c0 10.600 14 23 14 23z" />
          <circle cx="24" cy="20" r="5" />
        }
        @case ('phone') {
          <path d="M12 6h8l3 10-5 3a24 24 0 0 0 11 11l3-5 10 3v8a4 4 0 0 1-4 4C21 40 8 27 8 10a4 4 0 0 1 4-4z" />
        }
        @case ('mail') {
          <rect x="6" y="11" width="36" height="26" rx="3" />
          <path d="M7 14l17 13 17-13" />
        }
        @case ('check') {
          <circle cx="24" cy="24" r="17" />
          <path d="M16 24.500l6 6 11-12" />
        }
        @case ('video') {
          <rect x="5" y="14" width="26" height="20" rx="3.500" />
          <path d="M31 22l11-6v16l-11-6" />
        }
        @case ('drone') {
          <circle cx="24" cy="24" r="3.500" />
          <circle cx="9" cy="9" r="4.500" /><circle cx="39" cy="9" r="4.500" />
          <circle cx="9" cy="39" r="4.500" /><circle cx="39" cy="39" r="4.500" />
          <path d="M21.500 21.500L12.500 12.500M26.500 21.500l9-9M21.500 26.500l-9 9M26.500 26.500l9 9" />
        }
        @case ('crane') {
          <path d="M6 42h16M14 42V31M14 31L36 14" />
          <rect x="33" y="7" width="10" height="8" rx="1.800" />
          <circle cx="14" cy="31" r="1.600" />
        }
        @case ('screen') {
          <rect x="5" y="7" width="38" height="27" rx="3" />
          <path d="M16 42h16M24 34v8M21 15l9 5.500-9 5.500z" />
        }
        @case ('sun') {
          <circle cx="24" cy="24" r="6.500" />
          <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.500 10.500l4.200 4.200M33.300 33.300l4.200 4.200M37.500 10.500l-4.200 4.200M14.700 33.300l-4.200 4.200" />
        }
        @case ('shield') {
          <path d="M24 5l14 5v12c0 9-6 16-14 20-8-4-14-11-14-20V10z" />
          <path d="M18 24l4.500 4.500L31 19.500" />
        }
        @case ('arrow') {
          <path d="M7 24h32M28 13l11 11-11 11" />
        }
        @case ('trash') {
          <path d="M9 13h30M18 13V8h12v5M13 13l2 28h18l2-28M20 21v14M28 21v14" />
        }
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; width: 1.2em; height: 1.2em; flex: none; }
    svg { width: 100%; height: 100%; }
  `],
})
export class IconComponent {
  @Input() name = '';
  @Input() size = '';
}
