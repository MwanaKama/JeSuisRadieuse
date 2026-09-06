import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Leaf, Heart, Truck, Package, Clock, Minus, Plus, Loader2, Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import AddToCartButton from '../components/AddToCartButton';
import { useCartContext } from '../context/CartContext';
import { fetchProducts } from '../services/storeApi';
import { storeProducts } from '../data/store';
import type { Product } from '../types/shop';

const Boutique = () => {
  const [products, setProducts] = useState<Product[]>(storeProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, total, addItem, removeOne, clearCart } = useCartContext();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await fetchProducts();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch {
        // le catalogue de secours est déjà chargé
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('checkout') === '1') {
      if (items.length > 0) {
        setShowOrderForm(true);
      }
      setSearchParams({}, { replace: true });
    }
  }, [items.length, searchParams, setSearchParams]);

  const quantityById = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});
  }, [items]);

  const stockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
          Rupture de stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
          Plus que {stock} en stock
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        En stock
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Boutique Tisanes Artisanales</title>
        <meta
          name="description"
          content="Tisanes artisanales bio pour grossesse, allaitement, cycle féminin et ménopause. Livraison Colissimo, Mondial Relay et Chronopost partout en France."
        />
        <meta
          name="keywords"
          content="tisanes grossesse, tisane allaitement, tisane cycle féminin, tisane ménopause, herboristerie femme, tisanes bio Paris"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-6">
              Boutique Tisanes
            </h1>
            <p className="font-inter text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Des tisanes artisanales préparées avec des plantes bio, conçues pour accompagner chaque étape
              de votre parcours de femme. Expédiées rapidement partout en France.
            </p>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 mb-12">
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-purple-900 text-center mb-6">
              Livraison en France
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">
                  Colissimo <span className="text-purple-600">6,90 €</span>
                </h3>
                <p className="font-inter text-gray-600 text-sm">Livraison à domicile en 48-72h</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 md:h-8 md:w-8 text-green-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">
                  Mondial Relay <span className="text-purple-600">4,90 €</span>
                </h3>
                <p className="font-inter text-gray-600 text-sm">Point relais économique, 3-5 jours</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-red-700" />
                </div>
                <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 mb-2">
                  Chronopost <span className="text-purple-600">12,90 €</span>
                </h3>
                <p className="font-inter text-gray-600 text-sm">Livraison express en 24h</p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-12 text-purple-700">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Chargement des tisanes...</span>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {products.map((product) => {
                const quantity = quantityById[product.id] || 0;
                const isOutOfStock = product.stock <= 0;
                const reachedMax = quantity >= product.stock;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col"
                  >
                    <div className="h-56 md:h-64 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'opacity-60' : 'hover:scale-110'}`}
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 z-10">
                        {stockBadge(product.stock)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-poppins text-lg font-bold text-purple-900">{product.name}</h3>
                        <div className="text-xl font-bold text-purple-700 whitespace-nowrap ml-3">
                          {product.price.toFixed(2)}€
                        </div>
                      </div>

                      <p className="font-inter text-sm text-gray-600 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-poppins font-semibold text-purple-900 mb-2 text-sm">Bienfaits</h4>
                        <ul className="space-y-1">
                          {product.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                              <Star className="h-3 w-3 text-pink-400 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6 text-xs text-gray-500 bg-purple-50 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span>{product.usageInstructions}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        {isOutOfStock ? (
                          <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 py-3 rounded-full font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            <Clock className="h-4 w-4" />
                            <span>Indisponible</span>
                          </button>
                        ) : quantity === 0 ? (
                          <AddToCartButton
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                            }}
                            label="Ajouter au panier"
                          />
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => removeOne(product.id)}
                                className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                                aria-label="Retirer une unité"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-semibold text-purple-900 min-w-[1.5rem] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
                                }
                                disabled={reachedMax}
                                className="w-9 h-9 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                                aria-label="Ajouter une unité"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">
                              {reachedMax ? 'Stock max' : `${product.stock} dispo`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white text-center">
            <Heart className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 md:mb-6" />
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3 md:mb-4">Préparées avec amour</h2>
            <p className="font-inter text-base md:text-lg opacity-90 max-w-3xl mx-auto">
              Toutes mes tisanes sont préparées artisanalement avec des plantes bio sélectionnées pour leurs
              propriétés thérapeutiques et leur qualité exceptionnelle.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Leaf className="h-5 w-5" />
              <span className="text-sm opacity-90">100% naturelles · Sans additifs · Emballées à la main</span>
            </div>
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderForm
          items={items as any}
          total={total}
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
