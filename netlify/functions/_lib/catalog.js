export const storeProducts = [
  {
    id: 'pregnancy-herbal-tea',
    slug: 'tisane-bien-etre-grossesse',
    name: 'Tisane bien-être grossesse',
    description:
      'Une infusion douce aux plantes sélectionnées pour accompagner la grossesse avec chaleur, confort digestif et apaisement.',
    priceCents: 1590,
    image: '/tisane-1.jpg',
    category: 'Tisanes',
    stock: 24,
    benefits: ['Apaise les inconforts digestifs', 'Favorise la détente', "Soutient l'hydratation au quotidien"],
    usageInstructions: '1 à 2 tasses par jour. Laisser infuser 8 à 10 minutes dans une eau frémissante.'
  },
  {
    id: 'women-secret-herbal-tea',
    slug: 'tisane-secret-des-femmes',
    name: 'Tisane secret des femmes',
    description:
      "Une tisane rituel pensée pour le bien-être féminin global, au parfum floral et à l'équilibre végétal enveloppant.",
    priceCents: 1650,
    image: '/tisane-2.jpg',
    category: 'Tisanes',
    stock: 18,
    benefits: ["Favorise l'équilibre féminin", 'Soutient les temps de fatigue', 'Offre un moment de recentrage'],
    usageInstructions: '1 tasse le matin et 1 le soir. Infusion 10 minutes dans une tasse couverte.'
  },
  {
    id: 'cycle-herbal-tea',
    slug: 'tisane-cycle-feminin',
    name: 'Tisane cycle féminin',
    description:
      'Un mélange de plantes traditionnelles pour accompagner les différentes phases du cycle avec douceur et régularité.',
    priceCents: 1590,
    image: '/tisane-3.jpg',
    category: 'Tisanes',
    stock: 20,
    benefits: ['Accompagne le confort prémenstruel', "Soutient l'équilibre du cycle", 'Aide à relâcher les tensions'],
    usageInstructions: 'Commencer quelques jours avant les règles. 1 à 2 tasses par jour selon le besoin.'
  },
  {
    id: 'menopause-herbal-tea',
    slug: 'tisane-menopause',
    name: 'Tisane ménopause',
    description:
      'Une formule réconfortante pour accompagner les transitions hormonales avec sérénité et chaleur intérieure.',
    priceCents: 1750,
    image: '/tisane-4.jpg',
    category: 'Tisanes',
    stock: 16,
    benefits: ['Apaise les inconforts de transition', 'Soutient le sommeil', 'Invite au ralentissement'],
    usageInstructions: "2 tasses par jour, plutôt en fin d'après-midi et en soirée."
  },
  {
    id: 'postpartum-yoni-steam',
    slug: 'yoni-steam-post-partum',
    name: 'Yoni steam post-partum',
    description:
      'Un mélange de plantes pour accompagner le post-partum dans une logique de confort, de repos et de rituel de soin.',
    priceCents: 2490,
    image: '/post-partum.jpg',
    category: 'Yoni steam',
    stock: 12,
    benefits: ['Rituel de bien-être post-partum', 'Invite au relâchement', 'Accompagne le temps de récupération'],
    usageInstructions: "Utiliser uniquement hors contre-indication, sur une durée courte, selon vos recommandations d'accompagnement."
  },
  {
    id: 'clean-hydrate-yoni-steam',
    slug: 'yoni-steam-nettoyant-hydratant',
    name: 'Yoni steam nettoyant et hydratant',
    description:
      "Une synergie végétale pour un rituel intime bien-être centré sur la sensation de fraîcheur et de confort.",
    priceCents: 2390,
    image: '/yoni-steam.jpg',
    category: 'Yoni steam',
    stock: 14,
    benefits: ['Sensation de fraîcheur', 'Rituel féminin enveloppant', 'Moment de soin à domicile'],
    usageInstructions: "1 à 2 utilisations par semaine maximum, en respectant les précautions d'usage et sans surchauffe."
  }
];

export const shippingOptions = [
  {
    code: 'colissimo_home',
    carrier: 'colissimo',
    label: 'Colissimo domicile',
    description: 'Livraison standard 48-72h à domicile',
    priceCents: 690,
    eta: '2 à 4 jours ouvrés',
    requiresPickupPoint: false
  },
  {
    code: 'mondialrelay_point',
    carrier: 'mondialrelay',
    label: 'Mondial Relay point relais',
    description: 'Option économique en point relais',
    priceCents: 490,
    eta: '3 à 5 jours ouvrés',
    requiresPickupPoint: true
  },
  {
    code: 'chronopost_express',
    carrier: 'chronopost',
    label: 'Chronopost express',
    description: 'Livraison express 24h à domicile',
    priceCents: 1290,
    eta: '1 à 2 jours ouvrés',
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
