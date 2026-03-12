import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Award,
  CheckCircle,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import OrderForm from '../components/OrderForm';
import { storeProducts } from '../data/store';
import { useCart } from '../hooks/useCart';
import { fetchProducts } from '../services/storeApi';
import type { Product } from '../types/shop';

/* Image hero — licence Unsplash (usage commercial gratuit) */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1600&auto=format&fit=crop&q=80';

const TRUST_BADGES = [
  {
    icon: Truck,
    label: 'Livraison France',
    sub: 'Colissimo · Mondial Relay · Chronopost',
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600',
  },
  {
    icon: Award,
    label: '100 % Naturel',
    sub: 'Plantes sélectionnées avec soin',
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
  },
  {
    icon: Sparkles,
    label: 'Artisanal',
    sub: 'Préparé à la main en France',
    bgClass: 'bg-pink-100',
    iconClass: 'text-pink-600',
  },
  {
    icon: CheckCircle,
    label: 'Paiement sécurisé',
    sub: 'Stripe · PayPal',
    bgClass: 'bg-blue-100',
    iconClass: 'text-blue-600',
  },
] as const;

const Boutique = () => {
  const [products, setProducts] = useState<Product[]>(storeProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const { quantities, items, subtotal, addToCart, removeFromCart, clearCart } = useCart(products);
  const [searchParams, setSearchParams] = useSearchParams();

  /* Ouvrir le formulaire si on arrive depuis la bulle panier ?checkout=1 */
  useEffect(() => {
    if (searchParams.get('checkout') === '1') {
      setShowOrderForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  /* Chargement catalogue API (fallback sur storeProducts) */
  useEffect(() => {
    let isMounted = true;
    fetchProducts()
      .then((catalog) => { if (isMounted && catalog.length > 0) setProducts(catalog); })
      .catch(() => { /* garde les produits statiques */ })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filteredProducts = useMemo(
    () => (activeCategory === 'Tous' ? products : products.filter((p) => p.category === activeCategory)),
    [products, activeCategory],
  );

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Boutique Tisanes Artisanales</title>
        <meta
          name="description"
          content="Boutique bien-être féminin — tisanes artisanales, yoni steam, paiement sécurisé, livraison France."
        />
        <meta
          name="keywords"
          content="tisanes grossesse, cycle feminin, menopause, yoni steam, boutique bien-etre feminin"
        />
      </Helmet>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Tisanes bien-être artisanales Je Suis Radieuse"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: 'brightness(0.52)' }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-white/30">
            <Sparkles className="h-3.5 w-3.5" />
            Préparations artisanales françaises
          </span>
          <h1 className="font-poppins text-4xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-xl">
            Boutique<br />bien-être féminin
          </h1>
          <p className="font-inter text-white/90 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Tisanes, rituels yoni steam et soins naturels pensés pour chaque étape de la vie des femmes.
          </p>
          <a
            href="#catalogue"
            className="bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 text-white font-poppins font-semibold px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            Découvrir les produits
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST BADGES
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-purple-50 py-6 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label, sub, bgClass, iconClass }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${bgClass}`}>
                <Icon className={`h-5 w-5 ${iconClass}`} />
              </div>
              <div>
                <p className="font-poppins font-semibold text-purple-900 text-sm leading-tight">{label}</p>
                <p className="text-gray-500 text-xs leading-tight mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CATALOGUE
      ══════════════════════════════════════════════════════════ */}
      <div id="catalogue" className="min-h-screen bg-gradient-to-br from-pink-50/70 to-purple-50/70 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

          {/* Lien suivi commande */}
          <div className="flex justify-end mb-8">
            <Link
              to="/suivi-commande"
              className="text-sm font-medium text-purple-700 hover:text-purple-900 underline underline-offset-2 transition"
            >
              Suivre ma commande →
            </Link>
          </div>

          {/* ── Onglets catégories ────────────────────────────────── */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent shadow-md'
                    : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                {cat}
                {cat !== 'Tous' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({products.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
            {isLoading && (
              <span className="text-sm text-gray-400 ml-2 animate-pulse">Mise à jour du catalogue…</span>
            )}
          </div>

          {/* ── Grille produits ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] ?? 0;
              const isInCart = qty > 0;
              const isOutOfStock = product.stock === 0;

              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-purple-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                        isOutOfStock
                          ? 'bg-red-100 text-red-700'
                          : product.stock <= 5
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isOutOfStock ? 'Rupture' : `${product.stock} en stock`}
                    </span>
                    {isInCart && (
                      <div className="absolute inset-0 bg-purple-900/10 flex items-end pb-3 pl-3">
                        <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {qty} au panier
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2 className="font-poppins text-base font-bold text-purple-900 leading-snug">
                          {product.name}
                        </h2>
                        <span className="font-poppins font-bold text-purple-600 text-lg whitespace-nowrap flex-shrink-0">
                          {product.price.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-pink-300 text-pink-300" />
                        ))}
                        <span className="text-gray-400 text-xs ml-1.5">· Artisanal</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Bienfaits */}
                    <ul className="space-y-1 mb-4 flex-1">
                      {product.benefits.slice(0, 2).map((benefit) => (
                        <li key={benefit} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* Instructions en italique */}
                    <p className="text-xs text-gray-400 italic mb-4 leading-relaxed line-clamp-2">
                      {product.usageInstructions}
                    </p>

                    {/* CTA */}
                    {isInCart ? (
                      <div className="flex items-center justify-between bg-purple-50 rounded-2xl p-1.5">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-9 h-9 bg-white hover:bg-gray-100 rounded-xl flex items-center justify-center shadow-sm transition"
                          aria-label="Retirer une unité"
                        >
                          <Minus className="h-4 w-4 text-purple-700" />
                        </button>
                        <span className="font-poppins font-bold text-purple-900 text-sm">
                          {qty} × {product.price.toFixed(2)} €
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center shadow-sm transition"
                          aria-label="Ajouter une unité"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={isOutOfStock}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter au panier
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* ── Bannière bas de page ─────────────────────────────── */}
          <div className="mt-20 bg-gradient-to-r from-purple-700 to-pink-500 rounded-3xl p-10 md:p-14 text-white text-center">
            <Heart className="h-10 w-10 mx-auto mb-5 fill-white/30 text-white" />
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3">Préparées avec amour</h2>
            <p className="font-inter text-base md:text-lg opacity-90 max-w-2xl mx-auto mb-6 leading-relaxed">
              Chaque commande est préparée à la main avec des plantes soigneusement sélectionnées pour
              accompagner chaque étape de votre vie de femme.
            </p>
            <Link
              to="/suivi-commande"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold px-6 py-2.5 rounded-full transition"
            >
              Suivre ma commande →
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FORMULAIRE DE COMMANDE
      ══════════════════════════════════════════════════════════ */}
      {showOrderForm && (
        <OrderForm
          items={items}
          total={subtotal}
          onClose={() => setShowOrderForm(false)}
          onSuccess={() => {
            clearCart();
            setShowOrderForm(false);
          }}
        />
      )}
    </>
  );
};

export default Boutique;
