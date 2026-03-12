import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

interface OrderResultProps {
  mode: 'success' | 'cancel';
}

const OrderResult = ({ mode }: OrderResultProps) => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <>
      <Helmet>
        <title>{mode === 'success' ? 'Commande confirmee' : 'Paiement annule'} | Je Suis Radieuse</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${mode === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {mode === 'success' ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h1 className="font-poppins text-3xl font-bold text-purple-900 mb-4">
            {mode === 'success' ? 'Commande enregistree' : 'Paiement annule'}
          </h1>
          <p className="text-gray-600 mb-6">
            {mode === 'success'
              ? 'Votre paiement a ete pris en compte. Vous recevrez un email de confirmation des que la commande sera validee par webhook.'
              : 'Aucun debit n’a ete effectue. Vous pouvez retourner a la boutique et reprendre votre checkout.'}
          </p>
          {orderNumber && (
            <p className="font-medium text-purple-800 mb-8">Numero de commande: {orderNumber}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/boutique" className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold">
              Retour a la boutique
            </Link>
            <Link to="/suivi-commande" className="px-6 py-3 rounded-full border border-purple-200 text-purple-900 font-semibold bg-white">
              Suivre ma commande
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderResult;