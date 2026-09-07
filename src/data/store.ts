import type { Product, ShippingOption } from '../types/shop';

export const storeProducts: Product[] = [
  {
    id: 'pregnancy-herbal-tea',
    slug: 'tisane-bien-etre-grossesse',
    name: 'Tisane bien-être grossesse',
    description:
      'Une infusion douce aux plantes sélectionnées pour accompagner la grossesse avec chaleur, confort digestif et apaisement.',
    price: 15.9,
    image: '/tisane-4.jpg',
    category: 'Tisanes',
    stock: 24,
    available: false,
    benefits: ['Apaise les inconforts digestifs', 'Favorise la détente', "Soutient l'hydratation au quotidien"],
    usageInstructions: '1 à 2 tasses par jour. Laisser infuser 8 à 10 minutes dans une eau frémissante.'
  },
  {
    id: 'women-secret-herbal-tea',
    slug: 'tisane-secret-des-femmes',
    name: 'Tisane secret des femmes',
    description:
      "Une tisane rituel pensée pour le bien-être féminin global, au parfum floral et à l'équilibre végétal enveloppant.",
    price: 16.5,
    image: '/tisane-4.jpg',
    category: 'Tisanes',
    stock: 18,
    available: false,
    benefits: ["Favorise l'équilibre féminin", 'Soutient les temps de fatigue', 'Offre un moment de recentrage'],
    usageInstructions: '1 tasse le matin et 1 le soir. Infusion 10 minutes dans une tasse couverte.'
  },
  {
    id: 'cycle-herbal-tea',
    slug: 'tisane-cycle-feminin',
    name: 'Tisane cycle féminin',
    description:
      'Un mélange de plantes traditionnelles pour accompagner les différentes phases du cycle avec douceur et régularité.',
    price: 15.9,
    image: '/tisane-4.jpg',
    category: 'Tisanes',
    stock: 20,
    available: false,
    benefits: ['Accompagne le confort prémenstruel', "Soutient l'équilibre du cycle", 'Aide à relâcher les tensions'],
    usageInstructions: 'Commencer quelques jours avant les règles. 1 à 2 tasses par jour selon le besoin.'
  },
  {
    id: 'menopause-herbal-tea',
    slug: 'tisane-menopause',
    name: 'Tisane ménopause',
    description:
      'Une formule réconfortante pour accompagner les transitions hormonales avec sérénité et chaleur intérieure.',
    price: 17.5,
    image: '/tisane-4.jpg',
    category: 'Tisanes',
    stock: 16,
    available: false,
    benefits: ['Apaise les inconforts de transition', 'Soutient le sommeil', 'Invite au ralentissement'],
    usageInstructions: "2 tasses par jour, plutôt en fin d'après-midi et en soirée."
  },
  {
    id: 'postpartum-yoni-steam',
    slug: 'yoni-steam-post-partum',
    name: 'Yoni steam post-partum',
    description:
      'Un mélange de plantes pour accompagner le post-partum dans une logique de confort, de repos et de rituel de soin.',
    price: 24.9,
    image: '/post-partum.jpg',
    category: 'Yoni steam',
    stock: 12,
    available: true,
    benefits: ['Rituel de bien-être post-partum', 'Invite au relâchement', 'Accompagne le temps de récupération'],
    usageInstructions: "Utiliser uniquement hors contre-indication, sur une durée courte, selon vos recommandations d'accompagnement."
  },
  {
    id: 'clean-hydrate-yoni-steam',
    slug: 'yoni-steam-nettoyant-hydratant',
    name: 'Yoni steam nettoyant et hydratant',
    description:
      "Une synergie végétale pour un rituel intime bien-être centré sur la sensation de fraîcheur et de confort.",
    price: 23.9,
    image: '/yoni-steam.jpg',
    category: 'Yoni steam',
    stock: 14,
    available: true,
    benefits: ['Sensation de fraîcheur', 'Rituel féminin enveloppant', 'Moment de soin à domicile'],
    usageInstructions: "1 à 2 utilisations par semaine maximum, en respectant les précautions d'usage et sans surchauffe."
  }
];

export const defaultShippingOptions: ShippingOption[] = [
  {
    code: 'colissimo_home',
    carrier: 'colissimo',
    label: 'Colissimo domicile',
    description: 'Livraison standard 48-72h à domicile',
    price: 5.9,
    eta: '2 à 4 jours ouvrés',
    requiresPickupPoint: false
  },
  {
    code: 'mondialrelay_point',
    carrier: 'mondialrelay',
    label: 'Mondial Relay point relais',
    description: 'Option économique en point relais',
    price: 4.4,
    eta: '3 à 5 jours ouvrés',
    requiresPickupPoint: true
  },
  {
    code: 'chronopost_express',
    carrier: 'chronopost',
    label: 'Chronopost express',
    description: 'Livraison express 24h à domicile',
    price: 12.9,
    eta: '1 à 2 jours ouvrés',
    requiresPickupPoint: false
  }
];
