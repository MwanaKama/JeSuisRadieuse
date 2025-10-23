import React, { useState, useEffect } from 'react';
import { Package, Eye, Edit, Truck, Check, X, Search, Filter } from 'lucide-react';
import { Order } from '../types/Order';

const AdminOrderDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation de données - en production, ces données viendraient de votre API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'CMD-123456',
        items: [
          { id: 'tisane-grossesse', name: 'Tisane Grossesse Sérénité', price: 24.90, quantity: 2, weight: '100g', ingredients: 'Camomille, feuilles de framboisier' },
          { id: 'tisane-allaitement', name: 'Tisane Allaitement Douceur', price: 26.90, quantity: 1, weight: '100g', ingredients: 'Fenouil, anis vert' }
        ],
        customerInfo: {
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@email.com',
          phone: '06 12 34 56 78',
          address: '123 rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
          shippingMethod: 'colissimo'
        },
        subtotal: 76.70,
        shipping: 6.90,
        total: 83.60,
        orderDate: '2024-01-15T10:30:00Z',
        status: 'pending',
        paymentMethod: 'bank_transfer'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filtrage des commandes
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.customerInfo.firstName} ${order.customerInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-200 text-green-900',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      paid: 'Payée',
      preparing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
    ));
  };

  const OrderDetailModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-purple-900">Commande {order.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statut et actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
              <span className="text-gray-500">
                {new Date(order.orderDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
                <option value="preparing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Informations client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Nom:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
                <p><strong>Téléphone:</strong> {order.customerInfo.phone}</p>
              </div>
              <div>
                <p><strong>Adresse:</strong></p>
                <p>{order.customerInfo.address}</p>
                <p>{order.customerInfo.postalCode} {order.customerInfo.city}</p>
                <p>{order.customerInfo.country}</p>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Produits commandés</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.weight} • {item.ingredients}</p>
                  </div>
                  <div className="text-right">
                    <p>{item.quantity} × {item.price.toFixed(2)}€</p>
                    <p className="font-semibold">{(item.quantity * item.price).toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-300 mt-4 pt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{order.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison ({order.customerInfo.shippingMethod}):</span>
                <span>{order.shipping.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>{order.total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Mode de livraison */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Livraison</h3>
            <p><strong>Mode:</strong> {order.customerInfo.shippingMethod.toUpperCase()}</p>
            {order.customerInfo.relayPoint && (
              <p><strong>Point relais:</strong> {order.customerInfo.relayPoint}</p>
            )}
            {order.trackingNumber && (
              <p><strong>Numéro de suivi:</strong> {order.trackingNumber}</p>
            )}
          </div>

          {order.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des commandes</h1>
          
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="paid">Payées</option>
                <option value="preparing">En préparation</option>
                <option value="shipped">Expédiées</option>
                <option value="delivered">Livrées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">{order.total.toFixed(2)}€</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrderDashboard;
