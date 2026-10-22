import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18n } from './i18n.service';

// Utilisation : {{ 'Texte français' | t }}  →  traduit en arabe si la langue choisie est l'arabe.
// Impure : se met à jour dès que l'on change de langue.
@Pipe({ name: 't', standalone: true, pure: false })
export class TPipe implements PipeTransform {
  private i18n = inject(I18n);
  transform(value: string | number | null | undefined): string {
    return this.i18n.t(value == null ? '' : String(value));
  }
}
