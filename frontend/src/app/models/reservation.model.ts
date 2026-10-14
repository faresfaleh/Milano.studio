import { SoireeOptions } from '../studio.config';

export interface ReservationPayload {
  category: 'soiree' | 'shooting';
  eventType?: string;
  pack?: string; // anciennes réservations
  options?: SoireeOptions;
  mariePrenomHomme?: string; // mariage : prénom du marié
  mariePrenomFemme?: string; // mariage : prénom de la mariée
  shootingType?: string;
  shootingOption?: string;
  nom: string;
  prenom: string;
  cin: string;
  telephone: string;
  lieu: string;
  date: string;
  message?: string;
}

export interface Reservation extends ReservationPayload {
  _id: string;
  day?: string;
  price?: number;
  status: 'en_attente' | 'confirmee' | 'annulee';
  createdAt: string;
  sms?: string | null; // résultat de l'envoi du SMS lors de la confirmation (admin)
}

export interface Availability {
  day: string;
  count: number;
  max: number;
  available: boolean;
}

// Réservation affichée dans le panier (sans CIN ni téléphone)
export interface CartItem {
  _id: string;
  category: 'soiree' | 'shooting';
  eventType?: string;
  pack?: string;
  options?: SoireeOptions;
  price?: number;
  shootingType?: string;
  shootingOption?: string;
  lieu: string;
  day: string;
  nom: string;
  prenom: string;
  status: 'en_attente' | 'confirmee' | 'annulee';
  createdAt: string;
}

// Réponse de « Mon flash » (public)
export interface FlashCheck {
  found: boolean;
  ready?: boolean;
  multiple?: boolean; // plusieurs soirées ce jour-là : le client doit donner son nom
}

// Ligne du suivi des flashs (monteur / admin)
export interface FlashRow {
  _id: string;
  eventType: string;
  nom: string;
  prenom: string;
  mariePrenomHomme?: string;
  mariePrenomFemme?: string;
  lieu: string;
  day: string;
  status: 'en_attente' | 'confirmee' | 'annulee';
  flashReady: boolean;
  flashReadyAt?: string;
}
