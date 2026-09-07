import React from 'react';
import { ShoppingCart } from 'lucide-react';

import type { CartProduct } from '../context/CartContext';
import { useCartContext } from '../context/CartContext';

interface AddToCartButtonProps {
  product: CartProduct;
  label?: string;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  label = 'Ajouter au panier',
  className,
}) => {
  const { addItem } = useCartContext();

  return (
    <button
      onClick={() => addItem(product)}
      className={
        className ||
        'group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 px-5 rounded-full shadow-md hover:shadow-xl active:scale-95 transition-all duration-200 text-sm md:text-base'
      }
    >
      <ShoppingCart className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      <span>{label}</span>
    </button>
  );
};

export default AddToCartButton;
