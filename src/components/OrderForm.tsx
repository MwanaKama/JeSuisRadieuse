import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Loader2, MapPin, Package, Truck, User, X } from 'lucide-react';

import { defaultShippingOptions } from '../data/store';
import {
  createPayPalCheckout,
  createStripeCheckout,
  fetchPickupPoints,
  fetchShippingOptions
} from '../services/storeApi';
import type { CartItem, CheckoutCustomer, MondialRelayPoint, PickupPoint, PaymentMethodCode, ShippingOption } from '../types/shop';
import MondialRelayPicker from './MondialRelayPicker';

interface OrderFormProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

const initialCustomer: CheckoutCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'FR',
  notes: ''
};

const OrderForm: React.FC<OrderFormProps> = ({ items, total, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(defaultShippingOptions);
  const [shippingMethodCode, setShippingMethodCode] = useState<ShippingOption['code']>('colissimo_home');
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [pickupPointId, setPickupPointId] = useState('');
  const [selectedMondialRelayPoint, setSelectedMondialRelayPoint] = useState<MondialRelayPoint | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode>('stripe');

  const serializedItems = useMemo(
    () => items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    [items]
  );

  const selectedShipping = useMemo(
    () => shippingOptions.find((option) => option.code === shippingMethodCode) || shippingOptions[0],
    [shippingMethodCode, shippingOptions]
  );

  const totalWithShipping = total + (selectedShipping?.price || 0);

  useEffect(() => {
    const shouldFetch = customer.country.length === 2 && customer.postalCode.trim().length >= 4 && items.length > 0;

    if (!shouldFetch) {
      return;
    }

    let cancelled = false;

    async function loadShipping() {
      setIsLoadingShipping(true);
      try {
        const options = await fetchShippingOptions(customer.country, customer.postalCode, serializedItems);
        if (!cancelled && options.length > 0) {
          setShippingOptions(options);
          if (!options.some((option) => option.code === shippingMethodCode)) {
            setShippingMethodCode(options[0].code);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger les modes de livraison.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingShipping(false);
        }
      }
    }

    loadShipping();

    return () => {
      cancelled = true;
    };
  }, [customer.country, customer.postalCode, items.length, serializedItems, shippingMethodCode]);

  useEffect(() => {
    if (!selectedShipping?.requiresPickupPoint || customer.postalCode.trim().length < 4) {
      setPickupPoints([]);
      setPickupPointId('');
      return;
    }

    let cancelled = false;

    async function loadPickupPoints() {
      try {
        const points = await fetchPickupPoints(customer.postalCode, customer.country);
        if (!cancelled) {
          setPickupPoints(points);
          setPickupPointId((current) => current || points[0]?.id || '');
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Impossible de recuperer les points relais.');
        }
      }
    }

    loadPickupPoints();

    return () => {
      cancelled = true;
    };
  }, [customer.country, customer.postalCode, selectedShipping?.requiresPickupPoint]);

  function updateCustomerField(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setCustomer((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        items: serializedItems,
        customer,
        shippingMethodCode,
        pickupPointId: selectedMondialRelayPoint?.id || pickupPointId || undefined,
        pickupPointLabel:
          selectedMondialRelayPoint?.name ||
          pickupPoints.find((point) => point.id === pickupPointId)?.name,
        pickupPointAddress: selectedMondialRelayPoint?.address,
        pickupPointPostalCode: selectedMondialRelayPoint?.postalCode,
        pickupPointCity: selectedMondialRelayPoint?.city,
        pickupPointCountry: selectedMondialRelayPoint?.country,
        pickupPointLatitude: selectedMondialRelayPoint?.latitude,
        pickupPointLongitude: selectedMondialRelayPoint?.longitude,
        paymentMethod
      };

      const response = paymentMethod === 'stripe'
        ? await createStripeCheckout(payload)
        : await createPayPalCheckout(payload);

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
        return;
      }

      onSuccess(response.orderNumber);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Le checkout a echoue.');
    } finally {
      setIsSubmitting(false);
    }
  }

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
                    value={customer.firstName}
                    onChange={updateCustomerField}
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
                    value={customer.lastName}
                    onChange={updateCustomerField}
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
                    value={customer.email}
                    onChange={updateCustomerField}
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
                    value={customer.phone}
                    onChange={updateCustomerField}
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
                    value={customer.address}
                    onChange={updateCustomerField}
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
                    value={customer.postalCode}
                    onChange={updateCustomerField}
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
                    value={customer.city}
                    onChange={updateCustomerField}
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
                    value={customer.country}
                    onChange={updateCustomerField}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                  </select>
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Mode de livraison</h4>
                <div className="space-y-3">
                  {shippingOptions.map((method) => {
                    const IconComponent = method.requiresPickupPoint ? Truck : Package;
                    return (
                      <label key={method.code} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.code}
                          checked={shippingMethodCode === method.code}
                          onChange={() => setShippingMethodCode(method.code)}
                          className="mr-4"
                        />
                        <IconComponent className="h-5 w-5 mr-3 text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{method.eta}</div>
                        </div>
                        <div className="font-semibold text-purple-700">
                          {method.price.toFixed(2)}€
                        </div>
                      </label>
                    );
                  })}
                </div>
                {isLoadingShipping && (
                  <p className="text-sm text-gray-500 mt-3">Calcul des frais de livraison...</p>
                )}
              </div>

              {selectedShipping?.requiresPickupPoint && selectedShipping?.carrier === 'mondialrelay' && (
                <div>
                  <MondialRelayPicker
                    address={customer.address}
                    postalCode={customer.postalCode}
                    country={customer.country}
                    limit={15}
                    selectedPoint={selectedMondialRelayPoint}
                    onSelect={(point) => {
                      setSelectedMondialRelayPoint(point);
                      setPickupPointId(point.id);
                    }}
                  />
                </div>
              )}

              {selectedShipping?.requiresPickupPoint && selectedShipping?.carrier !== 'mondialrelay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Point relais choisi
                  </label>
                  <select
                    value={pickupPointId}
                    onChange={(event) => setPickupPointId(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {pickupPoints.length === 0 && <option value="">Aucun point relais disponible</option>}
                    {pickupPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.name} - {point.city}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selectionnez le point relais le plus pratique pour votre retrait.
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
                    <span>Livraison ({selectedShipping?.label})</span>
                    <span>{(selectedShipping?.price || 0).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{totalWithShipping.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informations de livraison</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                  <p>{customer.address}</p>
                  <p>{customer.postalCode} {customer.city}</p>
                  <p>{customer.email} • {customer.phone}</p>
                  {selectedShipping?.requiresPickupPoint && selectedMondialRelayPoint && (
                    <>
                      <p className="pt-2"><strong>Point relais:</strong> {selectedMondialRelayPoint.name}</p>
                      <p>{selectedMondialRelayPoint.address} {selectedMondialRelayPoint.postalCode} {selectedMondialRelayPoint.city}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Notes optionnelles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  name="notes"
                  value={customer.notes}
                  onChange={updateCustomerField}
                  rows={3}
                  placeholder="Instructions de livraison, allergies, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Mode de paiement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                    />
                    <CreditCard className="h-5 w-5 text-purple-700" />
                    <div>
                      <div className="font-medium text-gray-900">Carte bancaire via Stripe</div>
                      <div className="text-sm text-gray-500">Paiement securise avec redirection Stripe Checkout</div>
                    </div>
                  </label>
                  <label className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                    />
                    <Truck className="h-5 w-5 text-purple-700" />
                    <div>
                      <div className="font-medium text-gray-900">PayPal</div>
                      <div className="text-sm text-gray-500">Validation via la page de paiement PayPal</div>
                    </div>
                  </label>
                </div>
              </div>

              {errorMessage && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">{errorMessage}</div>}

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
                  disabled={
                    isSubmitting ||
                    (selectedShipping?.requiresPickupPoint &&
                      (selectedShipping?.carrier === 'mondialrelay'
                        ? !selectedMondialRelayPoint?.id
                        : !pickupPointId))
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-medium transition-all"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirection vers le paiement...
                    </span>
                  ) : (
                    'Payer ma commande'
                  )}
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
