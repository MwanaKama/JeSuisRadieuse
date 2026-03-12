import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Leaf, Minus, Package, Plus, ShoppingCart, Sparkles, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

import OrderForm from '../components/OrderForm';
import { storeProducts } from '../data/store';
import { useCart } from '../hooks/useCart';
import { fetchProducts } from '../services/storeApi';
import type { Product } from '../types/shop';

const Boutique = () => {
  const [products, setProducts] = useState<Product[]>(storeProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { quantities, items, subtotal, itemCount, addToCart, removeFromCart, clearCart } = useCart(products);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const catalog = await fetchProducts();
        if (isMounted && catalog.length > 0) {
          setProducts(catalog);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedProducts = useMemo(() => {
    return products.reduce<Record<string, Product[]>>((groups, product) => {
      groups[product.category] = [...(groups[product.category] || []), product];
      return groups;
    }, {});
  }, [products]);

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Boutique Tisanes Artisanales</title>
        <meta
          name="description"
          content="Boutique bien-etre feminin avec tisanes, yoni steam, paiements Stripe et PayPal, livraison Colissimo, Mondial Relay et Chronopost."
        />
        <meta
          name="keywords"
          content="tisanes grossesse, cycle feminin, menopause, yoni steam, boutique bien-etre feminin"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-6">
              Boutique bien-etre feminin
            </h1>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-600 mr-3" />
                <h2 className="font-poppins text-xl md:text-2xl font-bold text-purple-900">La boutique est active</h2>
              </div>
              <p className="font-inter text-base md:text-lg text-gray-700 leading-relaxed">
                Decouvrez les produits naturels Je Suis Radieuse pour la grossesse, le cycle feminin, la menopause et les rituels de soin intime, avec panier, checkout securise et suivi de commande.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/suivi-commande" className="px-6 py-3 rounded-full border border-purple-200 text-purple-900 font-semibold bg-white shadow-sm">
                Suivre une commande
              </Link>
              <Link to="/admin/commandes" className="px-6 py-3 rounded-full bg-white/70 text-purple-800 font-semibold border border-white/80 shadow-sm">
                Dashboard admin
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 mb-12">
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-purple-900 text-center mb-6">
              Livraison en France
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">Colissimo</h3>
                <p className="font-inter text-gray-600 text-sm">Livraison standard 48-72h</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 md:h-8 md:w-8 text-green-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">Mondial Relay</h3>
                <p className="font-inter text-gray-600 text-sm">Point relais économique</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-red-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">Chronopost</h3>
                <p className="font-inter text-gray-600 text-sm">Livraison express 24h</p>
              </div>
            </div>
          </div>

          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <section key={category} className="mb-14">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 className="font-poppins text-2xl font-bold text-purple-900">{category}</h2>
                  <p className="text-sm text-gray-600">Produits artisanaux disponibles en stock</p>
                </div>
                {isLoading && <span className="text-sm text-gray-500">Chargement du catalogue...</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                  >
                    <div className="h-56 md:h-64 overflow-hidden relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      <div className="absolute top-4 right-4 z-10 bg-white/90 text-purple-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        Stock {product.stock}
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div>
                          <h3 className="font-poppins text-lg md:text-xl font-bold text-purple-900 mb-2">{product.name}</h3>
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 mb-2">
                            <Leaf className="h-4 w-4 text-green-500" />
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>Preparation artisanale</span>
                          </div>
                        </div>
                        <div className="text-lg md:text-2xl font-bold text-purple-700">{product.price.toFixed(2)}€</div>
                      </div>

                      <p className="font-inter text-sm md:text-base text-gray-600 mb-4 leading-relaxed">{product.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-5">
                        <div>
                          <h4 className="font-poppins font-semibold text-purple-900 mb-2 text-sm md:text-base">Bienfaits</h4>
                          <ul className="space-y-1">
                            {product.benefits.map((benefit) => (
                              <li key={benefit} className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                                <Star className="h-3 w-3 text-pink-400" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-poppins font-semibold text-purple-900 mb-2 text-sm md:text-base">Mode d’utilisation</h4>
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{product.usageInstructions}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        {quantities[product.id] ? (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-semibold text-purple-900 min-w-[2rem] text-center">{quantities[product.id]}</span>
                            <button
                              onClick={() => addToCart(product.id)}
                              className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product.id)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Ajouter au panier</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {items.length > 0 && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-8 mb-6 md:mb-8">
              <h2 className="font-poppins text-lg md:text-2xl font-bold text-purple-900 mb-4 md:mb-6 flex items-center">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Votre panier ({itemCount})
              </h2>

              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900 text-sm md:text-base">{item.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {item.price.toFixed(2)}€ × {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-purple-700 text-sm md:text-base">
                      {(item.price * item.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 md:mb-6 text-base md:text-xl font-bold text-purple-900 border-t border-gray-200 pt-3 md:pt-4">
                <span>Sous-total :</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 md:py-4 rounded-full font-poppins font-semibold text-sm md:text-lg transition-all hover:shadow-xl hover:scale-105"
                >
                  Finaliser ma commande
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border border-purple-200 text-purple-900 py-3 md:py-4 rounded-full font-poppins font-semibold text-sm md:text-lg bg-white"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white text-center">
            <Heart className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 md:mb-6" />
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3 md:mb-4">Préparées avec amour</h2>
            <p className="font-inter text-base md:text-lg opacity-90 max-w-3xl mx-auto">
              Chaque commande est preparee avec soin pour offrir une experience e-commerce simple, fiable et chaleureuse, de la selection produit jusqu’au suivi de livraison.
            </p>
          </div>
        </div>
      </div>

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
