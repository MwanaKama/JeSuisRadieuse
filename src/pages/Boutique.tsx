import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Plus, Minus, Star, Leaf, Heart, Truck, Package, Clock } from 'lucide-react';
import OrderForm from '../components/OrderForm';

const Boutique = () => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showOrderForm, setShowOrderForm] = useState(false);

  const tisanes = [
    {
      id: 'tisane-grossesse',
      name: 'Tisane Grossesse Sérénité',
      price: 15,
      image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Mélange délicat de camomille, feuilles de framboisier et mélisse pour accompagner votre grossesse en douceur.',
      benefits: ['Apaise les nausées', 'Favorise la détente', 'Riche en minéraux'],
      ingredients: 'Camomille, feuilles de framboisier, mélisse, ortie',
      weight: '100g',
      available: false,
    },
    {
      id: 'tisane-allaitement',
      name: 'Tisane Allaitement Douceur',
      price: 15,
      image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: "Synergie de fenouil, anis vert et galega pour soutenir naturellement l'allaitement maternel.",
      benefits: ['Stimule la lactation', 'Facilite la digestion', 'Goût doux et agréable'],
      ingredients: 'Fenouil, anis vert, galega, verveine',
      weight: '100g',
      available: false,
    },
    {
      id: 'tisane-postpartum',
      name: 'Tisane Post-partum Récupération',
      price: 15,
      image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        "Mélange reminéralisant d'ortie, achillée millefeuille et rose pour une récupération optimale.",
      benefits: ['Tonifie l’organisme', 'Apporte fer et vitamines', 'Soutient la récupération'],
      ingredients: 'Ortie, achillée millefeuille, pétales de rose, avoine',
      weight: '100g',
      available: false,
    },
    {
      id: 'tisane-feminin',
      name: 'Tisane Cycle Féminin',
      price: 15,
      image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Harmonise le cycle féminin avec un mélange de sauge, achillée et calendula.',
      benefits: ['Équilibre hormonal', 'Soulage les tensions', 'Régularise le cycle'],
      ingredients: 'Sauge, achillée, calendula, mélisse',
      weight: '100g',
      available: false,
    },
  ];

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = tisanes.find((t) => t.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getCartItems = () => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = tisanes.find((t) => t.id === productId);
        return product ? { ...product, quantity } : null;
      })
      .filter(Boolean);
  };

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Boutique Tisanes Artisanales</title>
        <meta
          name="description"
          content="Tisanes artisanales bio pour grossesse, allaitement et bien-être féminin. Mélanges traditionnels préparés avec soin."
        />
        <meta
          name="keywords"
          content="tisanes grossesse, tisane allaitement, herboristerie femme, tisanes bio Paris"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-6">
              Boutique Tisanes
            </h1>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-600 mr-3" />
                <h2 className="font-poppins text-xl md:text-2xl font-bold text-purple-900">Tisanes à venir</h2>
              </div>
              <p className="font-inter text-base md:text-lg text-gray-700 leading-relaxed">
                Mes tisanes artisanales spécialement conçues pour accompagner chaque étape de votre parcours de femme
                seront bientôt disponibles.
              </p>
            </div>
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
            {tisanes.map((tisane) => (
              <div
                key={tisane.id}
                className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl hover:shadow-2xl transition-all overflow-hidden relative"
              >
                {!tisane.available && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      Bientôt disponible
                    </span>
                  </div>
                )}

                <div className="h-56 md:h-64 overflow-hidden relative">
                  <img
                    src={tisane.image}
                    alt={tisane.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      !tisane.available ? 'opacity-75' : 'hover:scale-110'
                    }`}
                  />
                  {!tisane.available && (
                    <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center">
                      <Clock className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-poppins text-lg md:text-xl font-bold text-purple-900 mb-2">{tisane.name}</h3>
                      <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 mb-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span>{tisane.weight}</span>
                        <span>•</span>
                        <span>Bio & Artisanal</span>
                      </div>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-purple-700">{tisane.price.toFixed(2)}€</div>
                  </div>

                  <p className="font-inter text-sm md:text-base text-gray-600 mb-4 leading-relaxed">{tisane.description}</p>

                  <div className="mb-4">
                    <h4 className="font-poppins font-semibold text-purple-900 mb-2 text-sm md:text-base">Bienfaits</h4>
                    <ul className="space-y-1">
                      {tisane.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                          <Star className="h-3 w-3 text-pink-400" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6 text-xs text-gray-500">
                    <strong>Ingrédients :</strong> {tisane.ingredients}
                  </div>

                  <div className="flex items-center justify-between">
                    {tisane.available ? (
                      cart[tisane.id] ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => removeFromCart(tisane.id)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold text-purple-900 min-w-[2rem] text-center">
                            {cart[tisane.id]}
                          </span>
                          <button
                            onClick={() => addToCart(tisane.id)}
                            className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(tisane.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 md:py-3 rounded-full font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Ajouter au panier</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => addToCart(tisane.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 md:py-3 rounded-full font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Commander</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {Object.keys(cart).length > 0 && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-8 mb-6 md:mb-8">
              <h2 className="font-poppins text-lg md:text-2xl font-bold text-purple-900 mb-4 md:mb-6 flex items-center">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Votre panier
              </h2>

              {/* Items */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {getCartItems().map((item) => (
                  <div key={item!.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-900 text-sm md:text-base">{item!.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {item!.price.toFixed(2)}€ × {item!.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-purple-700 text-sm md:text-base">
                      {(item!.price * item!.quantity).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-4 md:mb-6 text-base md:text-xl font-bold text-purple-900 border-t border-gray-200 pt-3 md:pt-4">
                <span>Total :</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 md:py-4 rounded-full font-poppins font-semibold text-sm md:text-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Finaliser ma commande
              </button>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white text-center">
            <Heart className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 md:mb-6" />
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3 md:mb-4">Préparées avec amour</h2>
            <p className="font-inter text-base md:text-lg opacity-90 max-w-3xl mx-auto">
              Toutes mes tisanes seront préparées artisanalement avec des plantes bio sélectionnées pour leurs
              propriétés thérapeutiques et leur qualité exceptionnelle.
            </p>
          </div>
        </div>
      </div>

      {showOrderForm && (
        <OrderForm
          items={getCartItems()}
          total={getCartTotal()}
          onClose={() => setShowOrderForm(false)}
          onSuccess={() => {
            setCart({});
            setShowOrderForm(false);
            alert('Commande enregistrée ! Vous recevrez un email de confirmation.');
          }}
        />
      )}
    </>
  );
};

export default Boutique;
