import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { storeProducts } from '../data/store';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, quantities, subtotal, itemCount, addToCart, removeFromCart, clearCart } = useCart(storeProducts);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 z-50 overflow-hidden"
      style={{ animation: 'fadeInDown 0.2s ease' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-purple-600" />
          <span className="font-poppins font-semibold text-purple-900">
            Mon panier
          </span>
          {itemCount > 0 && (
            <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Cart items */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <ShoppingBag className="h-12 w-12 text-purple-200 mb-3" />
          <p className="text-gray-500 font-medium mb-1">Votre panier est vide</p>
          <p className="text-gray-400 text-sm mb-5">Découvrez nos produits bien-être</p>
          <Link
            to="/boutique"
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition"
          >
            Voir la boutique
          </Link>
        </div>
      ) : (
        <>
          {/* Items list */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 px-2">
            {storeProducts.map((product) => {
              const qty = quantities[product.id];
              if (!qty) return null;
              return (
                <div key={product.id} className="flex items-center gap-3 py-3 px-2">
                  {/* Product image */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-purple-50 border border-purple-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-purple-900 leading-tight truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.price.toFixed(2)} € / unité
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <Minus className="h-3 w-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold text-purple-800 w-4 text-center">{qty}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-6 h-6 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition"
                      >
                        <Plus className="h-3 w-3 text-purple-700" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-purple-700">
                      {(product.price * qty).toFixed(2)} €
                    </span>
                    <button
                      onClick={() => {
                        for (let i = 0; i < qty; i++) removeFromCart(product.id);
                      }}
                      className="text-red-300 hover:text-red-500 transition text-xs"
                      title="Supprimer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Sous-total</span>
              <span className="font-bold text-purple-900 text-base">{subtotal.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Frais de livraison calculés à la commande</p>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                to="/boutique?checkout=1"
                onClick={() => { onCheckout(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-semibold text-sm transition hover:shadow-lg"
              >
                Finaliser ma commande
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-purple-600 hover:text-purple-800 py-1 transition"
              >
                Continuer mes achats
              </button>
            </div>

            {/* Clear cart */}
            <button
              onClick={() => { clearCart(); }}
              className="mt-3 w-full text-center text-xs text-gray-400 hover:text-red-400 transition"
            >
              Vider le panier
            </button>
          </div>
        </>
      )}

      {/* Small arrow pointing up */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDropdown;
