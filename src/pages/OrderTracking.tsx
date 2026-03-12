import { FormEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PackageSearch, Truck } from 'lucide-react';

import { trackOrder } from '../services/storeApi';
import type { TrackedOrder } from '../types/shop';

const statusLabels: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Paiement confirme',
  preparing: 'Commande en preparation',
  shipped: 'Commande expediee',
  delivered: 'Commande livree',
  cancelled: 'Commande annulee'
};

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage('');
    setResult(null);
    setIsLoading(true);

    try {
      const trackedOrder = await trackOrder(orderNumber, email);
      setResult(trackedOrder);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de retrouver cette commande.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Suivi de commande | Je Suis Radieuse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
                <PackageSearch className="h-7 w-7 text-purple-700" />
              </div>
              <div>
                <h1 className="font-poppins text-3xl font-bold text-purple-900">Suivre ma commande</h1>
                <p className="text-gray-600">Entrez votre numero de commande et l’email utilise lors du paiement.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numero de commande</label>
                <input
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="JSR-20260312-ABC123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="vous@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                {isLoading ? 'Recherche en cours...' : 'Afficher le suivi'}
              </button>
            </form>

            {errorMessage && <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-xl">{errorMessage}</div>}

            {result && (
              <div className="mt-8 border border-purple-100 rounded-2xl p-6 bg-purple-50/50">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-500">Commande</p>
                    <p className="font-semibold text-purple-900">{result.orderNumber}</p>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white text-purple-900 font-medium border border-purple-200">
                    {statusLabels[result.status] || result.status}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
                  <div>
                    <p className="text-gray-500">Paiement</p>
                    <p className="font-medium">{result.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-medium">{result.total.toFixed(2)}€</p>
                  </div>
                </div>

                {result.trackingNumber && (
                  <div className="mt-6 bg-white rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2 text-purple-900 font-medium">
                      <Truck className="h-4 w-4" />
                      Suivi transporteur
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Numero de suivi: {result.trackingNumber}</p>
                    {result.trackingUrl && (
                      <a
                        href={result.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-purple-700 underline"
                      >
                        Ouvrir le suivi colis
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;