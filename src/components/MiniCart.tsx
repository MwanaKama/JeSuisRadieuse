import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

import { useCartContext } from '../context/CartContext';

interface MiniCartProps {
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { items, total, addItem, removeOne, removeItem } = useCartContext();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-purple-100 shadow-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-100 bg-gradient-to-r from-pink-50 to-purple-50">
        <h3 className="font-poppins font-semibold text-purple-900">Mon panier</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white text-gray-500"
          aria-label="Fermer le mini panier"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <ShoppingBag className="h-10 w-10 mx-auto text-purple-200 mb-3" />
          <p className="text-gray-600 text-sm">Votre panier est vide</p>
          <Link
            to="/boutique"
            onClick={onClose}
            className="mt-4 inline-block text-sm font-medium text-purple-700 hover:text-purple-900"
          >
            Voir la boutique
          </Link>
        </div>
      ) : (
        <>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 px-3 py-2">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-start gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-purple-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.price.toFixed(2)}€</p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => removeOne(item.id)}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      aria-label="Retirer une unité"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold text-purple-800 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="w-6 h-6 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center"
                      aria-label="Ajouter une unité"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-purple-700">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-1 text-red-400 hover:text-red-600"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-base font-bold text-purple-900">{total.toFixed(2)}€</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/boutique');
                  onClose();
                }}
                className="w-full border border-purple-200 text-purple-800 rounded-full py-2.5 text-sm font-semibold bg-white hover:bg-purple-50 transition"
              >
                Voir le panier
              </button>
              <button
                onClick={() => {
                  navigate('/boutique?checkout=1');
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full py-2.5 text-sm font-semibold transition"
              >
                Commander
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCart;
