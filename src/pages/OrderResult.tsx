import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Package, Truck, Loader2 } from 'lucide-react';

import { fetchOrderSummary } from '../services/storeApi';
import type { OrderSummary } from '../types/shop';

interface OrderResultProps {
  mode: 'success' | 'cancel';
}

const statusLabels: Record<string, string> = {
  pending: 'En attente de paiement',
  paid: 'Paiement confirmé',
  preparing: 'Commande en préparation',
  shipped: 'Commande expédiée',
  delivered: 'Commande livrée',
  cancelled: 'Commande annulée'
};

const OrderResult = ({ mode }: OrderResultProps) => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode !== 'success' || !orderNumber) {
      return;
    }

    const num = orderNumber;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchOrderSummary(num);
        if (!cancelled) {
          setSummary(data);
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [mode, orderNumber]);

  if (mode === 'cancel') {
    return (
      <>
        <Helmet>
          <title>Paiement annulé | Je Suis Radieuse</title>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4 py-16">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="font-poppins text-3xl font-bold text-purple-900 mb-4">Paiement annulé</h1>
            <p className="text-gray-600 mb-6">
              Aucun débit n'a été effectué. Vous pouvez retourner à la boutique et reprendre votre commande.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/boutique"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold"
              >
                Retour à la boutique
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Commande confirmée | Je Suis Radieuse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="font-poppins text-3xl font-bold text-purple-900 mb-2">Merci pour votre commande !</h1>
              {orderNumber && (
                <p className="font-medium text-purple-800">
                  Numéro de commande : <span className="font-bold">{orderNumber}</span>
                </p>
              )}
              {summary && (
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 font-medium text-sm">
                  {statusLabels[summary.status] || summary.status}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-8 text-purple-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Chargement de votre commande...</span>
              </div>
            )}

            {!isLoading && summary && (
              <>
                {/* Articles */}
                <div className="mb-6">
                  <h2 className="font-poppins font-semibold text-purple-900 mb-3">Vos articles</h2>
                  <div className="divide-y divide-gray-100">
                    {summary.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-2.5 text-sm">
                        <span className="text-gray-700">
                          {item.name} <span className="text-gray-400">× {item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totaux */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{summary.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Livraison</span>
                    <span>{summary.shipping.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 font-bold text-base text-purple-900">
                    <span>Total</span>
                    <span>{summary.total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Suivi si déjà disponible */}
                {summary.trackingNumber && (
                  <div className="mb-6 bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-1 text-purple-900 font-medium text-sm">
                      <Truck className="h-4 w-4" />
                      Suivi transporteur
                    </div>
                    <p className="text-sm text-gray-700">Numéro de suivi : {summary.trackingNumber}</p>
                    {summary.trackingUrl && (
                      <a
                        href={summary.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-purple-700 underline inline-flex items-center gap-1 mt-1"
                      >
                        Suivre mon colis en ligne
                      </a>
                    )}
                  </div>
                )}

                {/* Paiement en attente ? */}
                {summary.paymentStatus === 'pending' && (
                  <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3 mb-6">
                    Votre paiement est en cours de validation. Vous recevrez un email de confirmation dès qu'il sera confirmé.
                  </p>
                )}
              </>
            )}

            {!isLoading && !summary && (
              <p className="text-center text-gray-500 mb-6">
                Un email de confirmation vous sera envoyé dès la validation du paiement.
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Link
                to="/suivi-commande"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-center inline-flex items-center justify-center gap-2"
              >
                <Package className="h-4 w-4" />
                Suivre ma commande
              </Link>
              <Link
                to="/boutique"
                className="px-6 py-3 rounded-full border border-purple-200 text-purple-900 font-semibold bg-white text-center"
              >
                Retour à la boutique
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderResult;
