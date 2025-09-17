import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search } from 'lucide-react';

const Evenements = () => {
  const [filter, setFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Événements passés et à venir
  const events = [
    {
      id: 1,
      title: 'Atelier Préparation à l\'Accouchement',
      date: new Date('2024-12-15T10:00:00'),
      endDate: new Date('2024-12-15T12:00:00'),
      location: 'Cabinet Paris 11ème',
      participants: 8,
      maxParticipants: 10,
      type: 'atelier',
      status: 'passe',
      description: 'Atelier collectif pour préparer sereinement l\'accouchement avec techniques de respiration et relaxation.',
      price: 45
    },
    {
      id: 2,
      title: 'Cercle de Parole Post-partum',
      date: new Date('2024-11-28T14:30:00'),
      endDate: new Date('2024-11-28T16:30:00'),
      location: 'En ligne (Zoom)',
      participants: 6,
      maxParticipants: 8,
      type: 'cercle',
      status: 'passe',
      description: 'Espace d\'échange et de soutien pour les nouvelles mamans.',
      price: 25
    },
    {
      id: 3,
      title: 'Formation Massage Bébé',
      date: new Date('2025-01-20T10:00:00'),
      endDate: new Date('2025-01-20T12:30:00'),
      location: 'Cabinet Paris 11ème',
      participants: 4,
      maxParticipants: 6,
      type: 'formation',
      status: 'a-venir',
      description: 'Apprenez les techniques de massage pour bébé, favorisant détente et complicité.',
      price: 65
    },
    {
      id: 4,
      title: 'Atelier Portage Physiologique',
      date: new Date('2025-02-10T14:00:00'),
      endDate: new Date('2025-02-10T16:00:00'),
      location: 'Cabinet Paris 11ème',
      participants: 2,
      maxParticipants: 8,
      type: 'atelier',
      status: 'a-venir',
      description: 'Découvrez les différents moyens de portage et leurs bienfaits pour bébé et parents.',
      price: 50
    },
    {
      id: 5,
      title: 'Conférence Allaitement Maternel',
      date: new Date('2025-03-05T19:00:00'),
      endDate: new Date('2025-03-05T21:00:00'),
      location: 'Maison de la Parentalité - Paris 12ème',
      participants: 15,
      maxParticipants: 25,
      type: 'conference',
      status: 'a-venir',
      description: 'Conférence gratuite sur l\'allaitement maternel : conseils, difficultés et solutions.',
      price: 0
    }
  ];

  const eventTypes = {
    'tous': 'Tous les événements',
    'atelier': 'Ateliers',
    'cercle': 'Cercles de parole',
    'formation': 'Formations',
    'conference': 'Conférences'
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'tous' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === 'a-venir');
  const pastEvents = filteredEvents.filter(event => event.status === 'passe');

  const getEventTypeColor = (type: string) => {
    const colors = {
      'atelier': 'bg-purple-100 text-purple-800',
      'cercle': 'bg-pink-100 text-pink-800',
      'formation': 'bg-blue-100 text-blue-800',
      'conference': 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-purple-400">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
              {eventTypes[event.type as keyof typeof eventTypes]}
            </span>
            {event.price === 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Gratuit
              </span>
            )}
          </div>
          <h3 className="font-poppins text-xl font-bold text-purple-900 mb-2">
            {event.title}
          </h3>
          <p className="font-inter text-gray-600 text-sm leading-relaxed mb-4">
            {event.description}
          </p>
        </div>
        {event.price > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-700">{event.price}€</div>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600 text-sm">
          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="h-4 w-4 mr-2 text-purple-500" />
          <span>{formatTime(event.date)} - {formatTime(event.endDate)}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-2 text-purple-500" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm">
          <Users className="h-4 w-4 mr-2 text-purple-500" />
          <span>{event.participants}/{event.maxParticipants} participants</span>
        </div>
      </div>

      {event.status === 'a-venir' && (
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 px-4 rounded-full font-medium text-sm transition-all">
            S'inscrire
          </button>
          <button className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full font-medium text-sm transition-all">
            En savoir plus
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Événements & Ateliers - [Nom] Doula Paris | Formations et Cercles de Parole</title>
        <meta name="description" content="Découvrez tous nos événements : ateliers préparation accouchement, cercles de parole, formations massage bébé. Inscriptions en ligne." />
        <meta name="keywords" content="ateliers doula Paris, formation massage bébé, cercle parole post-partum, préparation accouchement" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              Événements & Ateliers
            </h1>
            <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Rejoignez nos ateliers, formations et cercles de parole pour enrichir votre parcours 
              de maternité et rencontrer d'autres parents dans un cadre bienveillant.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un événement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Object.entries(eventTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all"
              >
                <Plus className="h-5 w-5" />
                <span>Ajouter un événement</span>
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-8 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-purple-600" />
              Événements à venir ({upcomingEvents.length})
            </h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-poppins text-xl font-semibold text-gray-600 mb-2">
                  Aucun événement à venir
                </h3>
                <p className="text-gray-500">
                  Les prochains événements seront bientôt annoncés. Restez connectée !
                </p>
              </div>
            )}
          </div>

          {/* Past Events */}
          <div className="mb-12">
            <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-8">
              Événements passés ({pastEvents.length})
            </h2>
            
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastEvents.map(event => (
                  <div key={event.id} className="opacity-75">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <p className="text-gray-500">Aucun événement passé trouvé avec ces critères.</p>
              </div>
            )}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="font-poppins text-3xl font-bold mb-4">
              Ne ratez aucun événement
            </h2>
            <p className="font-inter text-lg mb-8 opacity-90">
              Inscrivez-vous à notre newsletter pour être informée en priorité de nos nouveaux ateliers et événements
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-poppins text-2xl font-bold text-purple-900">
                  Ajouter un nouvel événement
                </h2>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Atelier Préparation à l'Accouchement"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'événement *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="atelier">Atelier</option>
                      <option value="cercle">Cercle de parole</option>
                      <option value="formation">Formation</option>
                      <option value="conference">Conférence</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Décrivez votre événement..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (heures) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0 pour gratuit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Cabinet Paris 11ème"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre max de participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-full font-medium transition-all"
                  >
                    Créer l'événement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-full font-medium transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Evenements;