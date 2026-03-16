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
        'flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 md:py-3 rounded-full font-semibold transition-all hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base'
      }
    >
      <ShoppingCart className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
};

export default AddToCartButton;
