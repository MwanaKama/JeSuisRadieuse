export const storeProducts = [
  {
    id: 'pregnancy-herbal-tea',
    slug: 'tisane-bien-etre-grossesse',
    name: 'Tisane bien-etre grossesse',
    description:
      'Une infusion douce aux plantes selectionnees pour accompagner la grossesse avec chaleur, confort digestif et apaisement.',
    priceCents: 1590,
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
    description:
      'Une tisane rituel pensee pour le bien-etre feminin global, au parfum floral et a l equilibre vegetal enveloppant.',
    priceCents: 1650,
    image: '/accompagnement-bienveillant.png',
    category: 'Tisanes',
    stock: 18,
    benefits: ['Favorise l equilibre feminin', 'Soutient les temps de fatigue', 'Offre un moment de recentrage'],
    usageInstructions: '1 tasse le matin et 1 le soir. Infusion 10 minutes dans une tasse couverte.'
  },
  {
    id: 'cycle-herbal-tea',
    slug: 'tisane-cycle-feminin',
    name: 'Tisane cycle feminin',
    description:
      'Un melange de plantes traditionnelles pour accompagner les differentes phases du cycle avec douceur et regularite.',
    priceCents: 1590,
    image: '/choisir-doula.png',
    category: 'Tisanes',
    stock: 20,
    benefits: ['Accompagne le confort premenstruel', 'Soutient l equilibre du cycle', 'Aide a relacher les tensions'],
    usageInstructions: 'Commencer quelques jours avant les regles. 1 a 2 tasses par jour selon le besoin.'
  },
  {
    id: 'menopause-herbal-tea',
    slug: 'tisane-menopause',
    name: 'Tisane menopause',
    description:
      'Une formule reconfortante pour accompagner les transitions hormonales avec serenite et chaleur interieure.',
    priceCents: 1750,
    image: '/rebozo.jpg',
    category: 'Tisanes',
    stock: 16,
    benefits: ['Apaise les inconforts de transition', 'Soutient le sommeil', 'Invite au ralentissement'],
    usageInstructions: '2 tasses par jour, plutot en fin d apres-midi et en soiree.'
  },
  {
    id: 'postpartum-yoni-steam',
    slug: 'yoni-steam-post-partum',
    name: 'Yoni steam post-partum',
    description:
      'Un melange de plantes pour accompagner le post-partum dans une logique de confort, de repos et de rituel de soin.',
    priceCents: 2490,
    image: '/post-partum.png',
    category: 'Yoni steam',
    stock: 12,
    benefits: ['Rituel de bien-etre post-partum', 'Invite au relachement', 'Accompagne le temps de recuperation'],
    usageInstructions: 'Utiliser uniquement hors contre-indication, sur une duree courte, selon vos recommandations d accompagnement.'
  },
  {
    id: 'clean-hydrate-yoni-steam',
    slug: 'yoni-steam-nettoyant-hydratant',
    name: 'Yoni steam nettoyant et hydratant',
    description:
      'Une synergie vegetale pour un rituel intime bien-etre centre sur la sensation de fraicheur et de confort.',
    priceCents: 2390,
    image: '/yoni-steam.png',
    category: 'Yoni steam',
    stock: 14,
    benefits: ['Sensation de fraicheur', 'Rituel feminin enveloppant', 'Moment de soin a domicile'],
    usageInstructions: '1 a 2 utilisations par semaine maximum, en respectant les precautions d usage et sans surchauffe.'
  }
];

export const shippingOptions = [
  {
    code: 'colissimo_home',
    carrier: 'colissimo',
    label: 'Colissimo domicile',
    description: 'Livraison standard 48-72h a domicile',
    priceCents: 690,
    eta: '2 a 4 jours ouvres',
    requiresPickupPoint: false
  },
  {
    code: 'mondialrelay_point',
    carrier: 'mondialrelay',
    label: 'Mondial Relay point relais',
    description: 'Option economique en point relais',
    priceCents: 490,
    eta: '3 a 5 jours ouvres',
    requiresPickupPoint: true
  },
  {
    code: 'chronopost_express',
    carrier: 'chronopost',
    label: 'Chronopost express',
    description: 'Livraison express 24h a domicile',
    priceCents: 1290,
    eta: '1 a 2 jours ouvres',
    requiresPickupPoint: false
  }
];

export function toFrontendProduct(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number((product.priceCents / 100).toFixed(2)),
    image: product.image,
    category: product.category,
    stock: product.stock,
    benefits: product.benefits,
    usageInstructions: product.usageInstructions
  };
}

export function toFrontendShipping(option) {
  return {
    code: option.code,
    carrier: option.carrier,
    label: option.label,
    description: option.description,
    price: Number((option.priceCents / 100).toFixed(2)),
    eta: option.eta,
    requiresPickupPoint: option.requiresPickupPoint
  };
}
