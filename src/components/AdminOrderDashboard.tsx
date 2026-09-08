import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Filter, Loader2, Lock, Package, Search, Save, Boxes, ExternalLink, FileText, Download } from 'lucide-react';

import {
  adminLogin,
  downloadInvoice,
  fetchAdminOrders,
  fetchAdminStock,
  setOrderTracking,
  updateAdminAvailability,
  updateAdminOrderStatus,
  updateAdminStock,
  type AdminStockItem
} from '../services/storeApi';
import type { AdminOrderSummary, OrderStatusCode } from '../types/shop';

const statusOptions: OrderStatusCode[] = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'];

const statusLabels: Record<OrderStatusCode, string> = {
  pending: 'En attente',
  paid: 'Payée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
};

const statusClasses: Record<OrderStatusCode, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800'
};

const carrierLabels: Record<string, string> = {
  colissimo_home: 'Colissimo',
  mondialrelay_point: 'Mondial Relay',
  chronopost_express: 'Chronopost'
};

const AdminOrderDashboard = () => {
  const [token, setToken] = useState<string | null>(() => window.localStorage.getItem('jsr-admin-token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [stockItems, setStockItems] = useState<AdminStockItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'invoices'>('orders');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (token) {
      void refreshOrders();
      void refreshStock();
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
      await loadStock(result.token);
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
    const inputs: Record<string, string> = {};
    data.forEach((order) => {
      inputs[order.orderNumber] = order.trackingNumber || '';
    });
    setTrackingInputs(inputs);
  }

  async function loadStock(authToken: string) {
    const data = await fetchAdminStock(authToken);
    setStockItems(data);
    const inputs: Record<string, string> = {};
    data.forEach((item) => {
      inputs[item.id] = String(item.stock);
    });
    setStockInputs(inputs);
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

  async function refreshStock() {
    if (!token) {
      return;
    }
    try {
      await loadStock(token);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger le stock.');
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
      if (result.order?.cancelled) {
        // La commande a été annulée et supprimée : on la retire de la liste.
        setOrders((current) => current.filter((order) => order.orderNumber !== orderNumber));
      } else {
        setOrders((current) =>
          current.map((order) => (order.orderNumber === orderNumber ? result.order : order))
        );
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Mise à jour impossible.');
    }
  }

  async function saveTracking(order: AdminOrderSummary) {
    if (!token) {
      return;
    }
    const trackingNumber = (trackingInputs[order.orderNumber] || '').trim();
    if (!trackingNumber) {
      setErrorMessage('Veuillez saisir un numéro de suivi.');
      return;
    }

    setErrorMessage('');
    try {
      const result = await setOrderTracking(token, order.orderNumber, trackingNumber, order.shippingMethodCode);
      setOrders((current) =>
        current.map((item) =>
          item.orderNumber === order.orderNumber
            ? { ...item, trackingNumber: result.trackingNumber, trackingUrl: result.trackingUrl }
            : item
        )
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de sauvegarder le suivi.');
    }
  }

  async function saveStock(productId: string) {
    if (!token) {
      return;
    }
    const rawValue = (stockInputs[productId] || '').trim();
    const stock = Number(rawValue);
    if (rawValue === '' || !Number.isInteger(stock) || stock < 0) {
      setErrorMessage('Veuillez saisir un stock valide (entier positif).');
      return;
    }

    setErrorMessage('');
    try {
      const result = await updateAdminStock(token, productId, stock);
      setStockItems((current) =>
        current.map((item) => (item.id === productId ? result.product : item))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de mettre à jour le stock.');
    }
  }

  async function toggleAvailability(item: AdminStockItem) {
    if (!token) {
      return;
    }
    setErrorMessage('');
    try {
      const result = await updateAdminAvailability(token, item.id, !item.available);
      setStockItems((current) =>
        current.map((it) => (it.id === item.id ? result.product : it))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de changer la disponibilité.');
    }
  }

  async function handleDownloadInvoice(order: AdminOrderSummary) {
    if (!token) {
      return;
    }
    setErrorMessage('');
    try {
      await downloadInvoice(token, order.orderNumber, order.invoiceNumber);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de télécharger la facture.');
    }
  }

  function exportInvoicesCsv() {
    const invoices = orders.filter((order) => order.invoiceNumber);
    if (invoices.length === 0) {
      setErrorMessage('Aucune facture à exporter.');
      return;
    }

    const header = ['N° Facture', 'Commande', 'Client', 'Email', 'Date', 'Total TTC'];
    const rows = invoices.map((order) => [
      order.invoiceNumber || '',
      order.orderNumber,
      order.customerName,
      order.customerEmail,
      new Date(order.createdAt).toLocaleDateString('fr-FR'),
      order.total.toFixed(2).replace('.', ',')
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'factures.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function logout() {
    window.localStorage.removeItem('jsr-admin-token');
    setToken(null);
    setOrders([]);
    setStockItems([]);
    setEmail('');
    setPassword('');
    setActiveTab('orders');
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la boutique</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  void refreshOrders();
                  void refreshStock();
                }}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white"
              >
                Rafraîchir
              </button>
              <button onClick={logout} className="px-4 py-2 rounded-full border border-gray-200 bg-white">
                Déconnexion
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Package className="h-4 w-4" />
                Commandes ({orders.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                Stock
              </span>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-5 py-2.5 rounded-full font-semibold transition ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Factures ({orders.filter((o) => o.invoiceNumber).length})
              </span>
            </button>
          </div>

          {errorMessage && (
            <p className="mb-4 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <>
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par numéro, nom ou email"
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

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraison</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° de suivi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-gray-50 align-top">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-900">
                            {order.total.toFixed(2)}€
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {carrierLabels[order.shippingMethodCode] || order.shippingMethodCode}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
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
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-purple-700 underline mt-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Suivi transporteur
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={trackingInputs[order.orderNumber] || ''}
                                onChange={(event) =>
                                  setTrackingInputs((current) => ({
                                    ...current,
                                    [order.orderNumber]: event.target.value
                                  }))
                                }
                                placeholder="Ex: 6A12345678901"
                                className="w-36 px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                              />
                              <button
                                onClick={() => saveTracking(order)}
                                className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                title="Enregistrer le suivi"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center text-gray-500">Aucune commande trouvée.</div>
                )}
              </div>
            </>
          )}

          {/* STOCK TAB */}
          {activeTab === 'stock' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibilité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockItems.map((item) => {
                      const low = item.stock <= 5;
                      const out = item.stock <= 0;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                              />
                              <span className="font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{item.price.toFixed(2)}€</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                out ? 'bg-red-100 text-red-700' : low ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {out ? 'Rupture' : `${item.stock} unités`}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleAvailability(item)}
                              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                                item.available ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              title={item.available ? 'Cliquer pour passer en "Bientôt disponible"' : 'Cliquer pour rendre disponible'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                  item.available ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <span className={`ml-2 text-xs font-medium ${item.available ? 'text-green-700' : 'text-purple-700'}`}>
                              {item.available ? 'Disponible' : 'Bientôt'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={stockInputs[item.id] ?? ''}
                                onChange={(event) =>
                                  setStockInputs((current) => ({
                                    ...current,
                                    [item.id]: event.target.value
                                  }))
                                }
                                className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                              />
                              <button
                                onClick={() => saveStock(item.id)}
                                className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                title="Mettre à jour le stock"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {stockItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Aucun produit trouvé. Vérifiez que la base de données est configurée.
                </div>
              )}
            </div>
          )}

          {/* INVOICES TAB */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  {orders.filter((order) => order.invoiceNumber).length} facture(s)
                </h3>
                <button
                  onClick={exportInvoicesCsv}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                >
                  <Download className="h-4 w-4" />
                  Exporter CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Facture</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total TTC</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Télécharger</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.filter((order) => order.invoiceNumber).map((order) => (
                      <tr key={order.orderNumber} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-gray-900">{order.invoiceNumber}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{order.orderNumber}</td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-4 font-semibold text-gray-900">{order.total.toFixed(2)}€</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.filter((order) => order.invoiceNumber).length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Aucune facture pour le moment. Les factures apparaissent dès qu'un paiement est confirmé.
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="mt-6 flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDashboard;
