import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

import { useCartContext } from '../context/CartContext';
import MiniCart from './MiniCart';

const CartIcon: React.FC = () => {
  const { itemCount } = useCartContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="relative bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 text-white rounded-full p-2.5 transition shadow-md"
        aria-label="Ouvrir le panier"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && <MiniCart onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default CartIcon;
