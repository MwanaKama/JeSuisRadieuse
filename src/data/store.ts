import type { Product, ShippingOption } from '../types/shop';

export const storeProducts: Product[] = [
  {
    id: 'pregnancy-herbal-tea',
    slug: 'tisane-bien-etre-grossesse',
    name: 'Tisane bien-etre grossesse',
    description: 'Une infusion douce aux plantes selectionnees pour accompagner la grossesse avec chaleur, confort digestif et apaisement.',
    price: 15.9,
    image: '/prénatale.png',
    category: 'Tisanes',
    stock: 24,
    benefits: ['Apaise les inconforts digestifs', 'Favorise la detente', 'Soutient l hydratation au quotidien'],
    usageInstructions: '1 a 2 tasses par jour. Laisser infuser 8 a 10 minutes dans une eau fremissante.'
  },
  {
    id: 'women-secret-herbal-tea',
    slug: 'tisane-secret-des-femmes',
    name: 'Tisane secret des femmes',
    description: 'Une tisane rituel pensee pour le bien-etre feminin global, au parfum floral et a l equilibre vegetal enveloppant.',
    price: 16.5,
    image: '/prénatale.png',
    category: 'Tisanes',
    stock: 18,
    benefits: ['Favorise l equilibre feminin', 'Soutient les temps de fatigue', 'Offre un moment de recentrage'],
    usageInstructions: '1 tasse le matin et 1 le soir. Infusion 10 minutes dans une tasse couverte.'
  },
  {
    id: 'cycle-herbal-tea',
    slug: 'tisane-cycle-feminin',
    name: 'Tisane cycle feminin',
    description: 'Un melange de plantes traditionnelles pour accompagner les differentes phases du cycle avec douceur et regularite.',
    price: 15.9,
    image: '/prénatale.png',
    category: 'Tisanes',
    stock: 20,
    benefits: ['Accompagne le confort premenstruel', 'Soutient l equilibre du cycle', 'Aide a relacher les tensions'],
    usageInstructions: 'Commencer quelques jours avant les regles. 1 a 2 tasses par jour selon le besoin.'
  },
  {
    id: 'menopause-herbal-tea',
    slug: 'tisane-menopause',
    name: 'Tisane menopause',
    description: 'Une formule reconfortante pour accompagner les transitions hormonales avec serenite et chaleur interieure.',
    price: 17.5,
    image: '/prénatale.png',
    category: 'Tisanes',
    stock: 16,
    benefits: ['Apaise les inconforts de transition', 'Soutient le sommeil', 'Invite au ralentissement'],
    usageInstructions: '2 tasses par jour, plutot en fin d apres-midi et en soiree.'
  },
  {
    id: 'postpartum-yoni-steam',
    slug: 'yoni-steam-post-partum',
    name: 'Yoni steam post-partum',
    description: 'Un melange de plantes pour accompagner le post-partum dans une logique de confort, de repos et de rituel de soin.',
    price: 24.9,
    image: '/post-partum.png',
    category: 'Yoni steam',
    stock: 12,
    benefits: ['Rituel de bien-etre post-partum', 'Invite au relachement', 'Accompagne le temps de recuperation'],
    usageInstructions: 'Utiliser uniquement hors contre-indication, sur une duree courte, selon vos recommandations.'
  },
  {
    id: 'clean-hydrate-yoni-steam',
    slug: 'yoni-steam-nettoyant-hydratant',
    name: 'Yoni steam nettoyant et hydratant',
    description: 'Une synergie vegetale pour un rituel intime bien-etre centre sur la sensation de fraicheur et de confort.',
    price: 23.9,
    image: '/yoni-steam.png',
    category: 'Yoni steam',
    stock: 14,
    benefits: ['Sensation de fraicheur', 'Rituel feminin enveloppant', 'Moment de soin a domicile'],
    usageInstructions: '1 a 2 utilisations par semaine maximum, en respectant les precautions d usage et sans surchauffe.'
  }
];

export const defaultShippingOptions: ShippingOption[] = [
  {
    code: 'colissimo_home',
    carrier: 'colissimo',
    label: 'Colissimo domicile',
    description: 'Livraison standard 48-72h a domicile',
    price: 6.9,
    eta: '2 a 4 jours ouvres',
    requiresPickupPoint: false
  },
  {
    code: 'mondialrelay_point',
    carrier: 'mondialrelay',
    label: 'Mondial Relay point relais',
    description: 'Option economique en point relais',
    price: 4.9,
    eta: '3 a 5 jours ouvres',
    requiresPickupPoint: true
  },
  {
    code: 'chronopost_express',
    carrier: 'chronopost',
    label: 'Chronopost express',
    description: 'Livraison express 24h a domicile',
    price: 12.9,
    eta: '1 a 2 jours ouvres',
    requiresPickupPoint: false
  }
];
