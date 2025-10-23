import React, { useState } from 'react';
import { X, Package, Truck, CreditCard, User, MapPin, Mail, Phone } from 'lucide-react';

interface OrderFormProps {
  items: any[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ items, total, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Adresse de livraison
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Mode de livraison
    shippingMethod: 'colissimo',
    
    // Point relais (pour Mondial Relay)
    relayPoint: '',
    
    // Notes
    notes: ''
  });

  const shippingMethods = {
    colissimo: {
      name: 'Colissimo',
      description: 'Livraison standard 48-72h',
      price: 6.90,
      icon: Package
    },
    mondialRelay: {
      name: 'Mondial Relay',
      description: 'Point relais économique',
      price: 4.90,
      icon: Truck
    },
    chronopost: {
      name: 'Chronopost',
      description: 'Livraison express 24h',
      price: 12.90,
      icon: Package
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getShippingPrice = () => {
    return shippingMethods[formData.shippingMethod as keyof typeof shippingMethods].price;
  };

  const getTotalWithShipping = () => {
    return total + getShippingPrice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici vous enverriez les données à votre backend
    const orderData = {
      items,
      customerInfo: formData,
      subtotal: total,
      shipping: getShippingPrice(),
      total: getTotalWithShipping(),
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Simulation d'envoi au backend
      console.log('Commande envoyée:', orderData);
      
      // Ici vous feriez un appel API réel :
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      
      // Simulation d'attente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la commande:', error);
      alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="font-poppins text-2xl font-bold text-purple-900">
            Finaliser ma commande
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Informations personnelles */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="font-poppins text-xl font-semibold text-purple-900">
                  Informations personnelles
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-medium transition-all"
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 2: Adresse et livraison */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="font-poppins text-xl font-semibold text-purple-900">
                  Adresse de livraison
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Numéro et nom de rue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Mode de livraison</h4>
                <div className="space-y-3">
                  {Object.entries(shippingMethods).map(([key, method]) => {
                    const IconComponent = method.icon;
                    return (
                      <label key={key} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={key}
                          checked={formData.shippingMethod === key}
                          onChange={handleInputChange}
                          className="mr-4"
                        />
                        <IconComponent className="h-5 w-5 mr-3 text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                        <div className="font-semibold text-purple-700">
                          {method.price.toFixed(2)}€
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {formData.shippingMethod === 'mondialRelay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Point relais choisi
                  </label>
                  <input
                    type="text"
                    name="relayPoint"
                    value={formData.relayPoint}
                    onChange={handleInputChange}
                    placeholder="Sélectionnez un point relais"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous recevrez un lien pour choisir votre point relais après validation de la commande
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full font-medium transition-all"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-medium transition-all"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Récapitulatif et validation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="font-poppins text-xl font-semibold text-purple-900">
                  Récapitulatif de commande
                </h3>
              </div>

              {/* Récapitulatif des produits */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Produits commandés</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison ({shippingMethods[formData.shippingMethod as keyof typeof shippingMethods].name})</span>
                    <span>{getShippingPrice().toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{getTotalWithShipping().toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informations de livraison</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                  <p>{formData.address}</p>
                  <p>{formData.postalCode} {formData.city}</p>
                  <p>{formData.email} • {formData.phone}</p>
                </div>
              </div>

              {/* Notes optionnelles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Instructions de livraison, allergies, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Information de paiement */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">Paiement par virement</h4>
                </div>
                <p className="text-sm text-blue-800">
                  Après validation de votre commande, vous recevrez un email avec les informations 
                  de paiement par virement bancaire. Vos tisanes seront préparées et expédiées 
                  dès réception du paiement.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full font-medium transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-medium transition-all"
                >
                  Valider ma commande
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
