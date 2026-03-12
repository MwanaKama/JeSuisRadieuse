import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Filter, Loader2, Lock, Package, Search } from 'lucide-react';

import { adminLogin, fetchAdminOrders, updateAdminOrderStatus } from '../services/storeApi';
import type { AdminOrderSummary, OrderStatusCode } from '../types/shop';

const statusOptions: OrderStatusCode[] = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];

const statusLabels: Record<OrderStatusCode, string> = {
  pending: 'En attente',
  paid: 'Payee',
  preparing: 'En preparation',
  shipped: 'Expediee',
  delivered: 'Livree',
  cancelled: 'Annulee'
};

const statusClasses: Record<OrderStatusCode, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800'
};

const AdminOrderDashboard = () => {
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem('jsr-admin-token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      void refreshOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return orders;
    }

    return orders.filter((order) =>
      [order.orderNumber, order.customerName, order.customerEmail].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [orders, searchTerm]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);
      window.localStorage.setItem('jsr-admin-token', result.token);
      setToken(result.token);
      await loadOrders(result.token, statusFilter);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Connexion admin impossible.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadOrders(authToken: string, status: string) {
    const data = await fetchAdminOrders(authToken, {
      status: status || undefined
    });
    setOrders(data);
  }

  async function refreshOrders() {
    if (!token) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await loadOrders(token, statusFilter);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger les commandes.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onFilterChange(nextStatus: string) {
    setStatusFilter(nextStatus);
    if (!token) {
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await loadOrders(token, nextStatus);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de filtrer les commandes.');
    } finally {
      setIsLoading(false);
    }
  }

  async function changeStatus(orderNumber: string, status: OrderStatusCode) {
    if (!token) {
      return;
    }

    setErrorMessage('');

    try {
      const result = await updateAdminOrderStatus(token, orderNumber, status);
      setOrders((current) =>
        current.map((order) => (order.orderNumber === orderNumber ? result.order : order))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Mise a jour impossible.');
    }
  }

  function logout() {
    window.localStorage.removeItem('jsr-admin-token');
    setToken(null);
    setOrders([]);
    setEmail('');
    setPassword('');
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-purple-700" />
            <h1 className="text-2xl font-bold text-purple-900">Espace admin</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email admin</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-500 font-semibold"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
            <div className="flex items-center gap-2">
              <button onClick={refreshOrders} className="px-4 py-2 rounded-full border border-gray-200 bg-white">
                Rafraichir
              </button>
              <button onClick={logout} className="px-4 py-2 rounded-full border border-gray-200 bg-white">
                Deconnexion
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numero, nom ou email"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(event) => onFilterChange(event.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tous les statuts</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && <p className="mt-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{order.total.toFixed(2)}€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.paymentStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                        <select
                          className="text-xs border border-gray-200 rounded px-2 py-1"
                          value={order.status}
                          onChange={(event) => changeStatus(order.orderNumber, event.target.value as OrderStatusCode)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des commandes...
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDashboard;
