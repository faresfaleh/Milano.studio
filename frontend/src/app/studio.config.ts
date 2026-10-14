// ⚠️ Modifiez ici les vraies coordonnées du studio
export const STUDIO = {
  name: 'Milano Studio',
  tagline: 'Photography',
  president: 'Hamza Faleh',
  email: 'milano.studio.photo@gmail.com',
  phones: ['+216 92 343 403', '+216 55 587 602', '+216 94 313 130'],
  smsPhone: '92 343 403', // numéro indiqué à la fin du SMS de confirmation
  instagram: 'https://www.instagram.com/milano_studio_photography?vrfl=MXVzZDNkbjg2bDY3aw==',
  instagramHandle: '@milano_studio_photography',
  facebook: 'https://www.facebook.com/Milanostudiophotography/',
  facebookName: 'Milano Studio Photography',
  tiktok: 'https://www.tiktok.com/@milano_studio?is_from_webapp=1&sender_device=pc',
  tiktokHandle: '@milano_studio',
  maps: 'https://maps.app.goo.gl/MFpRUsTK3xMnpJA5A',
  lat: 34.582026,
  lng: 9.842579,
};

// Options choisies par le client pour une soirée
export interface SoireeOptions {
  cameras: 1 | 2 | 3; // caméras vidéo
  drone: 0 | 1;
  girafe: 0 | 1;
  regie: 0 | 1; // régie et écran
}

// Prix de la soirée (sans transport) : base (1 caméra vidéo + 1 appareil photo + parasols & lumières) + options
export const SOIREE_PRICING = {
  base: 400,        // 1 caméra vidéo + 1 appareil photo + parasols & lumières
  camera: 150,      // par caméra vidéo supplémentaire
  drone: 350,
  girafe: 500,
  regie: 1400,      // régie et écran
};

export const DEFAULT_SOIREE_OPTIONS: SoireeOptions = { cameras: 1, drone: 0, girafe: 0, regie: 0 };

export function soireePrice(o: SoireeOptions): number {
  const P = SOIREE_PRICING;
  return P.base + (o.cameras - 1) * P.camera + o.drone * P.drone + o.girafe * P.girafe + o.regie * P.regie;
}

// Texte récapitulatif, ex. « 2 caméras vidéo + appareil photo + drone »
export function soireeSummary(o: Partial<SoireeOptions>): string {
  const c = o.cameras || 1;
  const parts = [`${c} caméra${c > 1 ? 's' : ''} vidéo`, 'appareil photo', ...INCLUDED_ALL.map((x) => x.toLowerCase())];
  if (o.drone) parts.push('drone');
  if (o.girafe) parts.push('girafe');
  if (o.regie) parts.push('régie et écran');
  return parts.join(' + ');
}

// Inclus dans la base de toutes les soirées
export const INCLUDED_ALL = ['Parasols & lumières'];

export const EVENT_TYPES = [
  { id: 'soiree_homme', label: 'Soirée homme' },
  { id: 'soiree_femme', label: 'Soirée femme' },
  { id: 'mariage', label: 'Mariage' },
];

// Descriptions affichées sur la page Services
export const EVENT_INFO: Record<string, string> = {
  soiree_homme: 'Une couverture complète de votre soirée : l’ambiance, les moments forts et chaque détail, en photo et en vidéo.',
  soiree_femme: 'Une couverture soignée et raffinée : les tenues, les sourires et les plus beaux instants, immortalisés avec délicatesse.',
  mariage: 'Le plus beau jour de votre vie raconté avec émotion et élégance, de l’arrivée des mariés à la dernière danse.',
};

// Options supplémentaires d'une soirée (description + prix)
export const SOIREE_EXTRAS = [
  { key: 'drone' as const, name: 'Drone', desc: 'Des prises de vue aériennes spectaculaires de la salle et de ses abords.', price: SOIREE_PRICING.drone },
  { key: 'girafe' as const, name: 'Girafe', desc: 'Un bras de caméra pour des plans amples, fluides et cinématographiques.', price: SOIREE_PRICING.girafe },
  { key: 'regie' as const, name: 'Régie et écran', desc: 'Une régie vidéo et un grand écran pour projeter votre soirée en direct.', price: SOIREE_PRICING.regie },
];

export const SHOOTING_TYPES = [
  { id: 'individuel', name: 'Shooting individuel', desc: 'Une séance rien que pour vous : portrait, couple, famille...' },
  { id: 'mariage', name: 'Shooting de mariage', desc: 'La séance photo des mariés, en dehors de la soirée.' },
];

// Mêmes choix et mêmes prix pour le shooting individuel et le shooting de mariage
export const SHOOTING_OPTIONS = [
  { id: 'photo', name: 'Appareil photo', price: 150, desc: 'Séance photo avec appareil photo.' },
  { id: 'photo_video', name: 'Photo + vidéo', price: 300, desc: 'Appareil photo et caméra vidéo.' },
  { id: 'preparation', name: 'Préparation', price: 150, desc: 'Couverture de la préparation (coiffure, maquillage, habillage).' },
  { id: 'preparation_photo', name: 'Préparation + shooting photo', price: 300, desc: 'La préparation et la séance photo.' },
];

// Libellés lisibles (page admin)
export const LABELS: Record<string, string> = {
  mariage: 'Mariage', soiree_homme: 'Soirée homme', soiree_femme: 'Soirée femme',
  normale: 'Normale', medium: 'Medium', pro: 'Pro',
  photo: 'Appareil photo', photo_video: 'Photo + vidéo', preparation: 'Préparation', preparation_photo: 'Préparation + photo',
  individuel: 'individuel',
  en_attente: 'En attente', confirmee: 'Confirmée', annulee: 'Annulée',
  soiree: 'Soirée', shooting: 'Shooting',
};

// Photos affichées une par une dans le cercle de l'accueil (dossier src/assets/photos)
export const HERO_PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `assets/photos/photo-${n}.jpg`);
