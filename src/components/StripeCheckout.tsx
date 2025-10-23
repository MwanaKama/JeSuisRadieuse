import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface StripeCheckoutProps {
  items: any[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ items, total, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Ici vous intégreriez Stripe avec:
      // 1. loadStripe() pour initialiser Stripe
      // 2. stripe.createPaymentIntent() 
      // 3. stripe.confirmCardPayment()
      
      // Simulation du paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      onSuccess();
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-poppins text-2xl font-bold text-purple-900">
            Paiement sécurisé
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Récapitulatif de la commande</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Mode de paiement</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                <span>Carte bancaire</span>
              </label>
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center text-sm text-green-800">
            <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Paiement 100% sécurisé via Stripe. Vos données bancaires ne sont jamais stockées.</span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-full font-poppins font-semibold text-lg flex items-center justify-center space-x-2 transition-all hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Traitement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>Payer {total.toFixed(2)}€</span>
              </>
            )}
          </button>

          {/* Technical Note */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note :</strong> Cette interface simule Stripe. Pour la production, 
              configurez votre compte Stripe et implémentez l'API avec vos clés secrètes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;