import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, MapPin, Users, Filter, Search } from 'lucide-react';

const Evenements = () => {
  const [filter, setFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  // Liste des événements
  const events = [
    {
      id: 1,
      title: 'Cercle de Parole Post-partum',
      date: new Date('2024-11-28T14:30:00'),
      endDate: new Date('2024-11-28T16:30:00'),
      location: 'Paris 20ème',
      participants: 6,
      maxParticipants: 8,
      type: 'cercle',
      status: 'passe',
      description: 'Espace d\'échange et de soutien pour les nouvelles mamans.',
      price: 25
    },
    {
      id: 2,
      title: 'Atelier Préparation à l\'Accouchement',
      date: new Date('2024-12-15T10:00:00'),
      endDate: new Date('2024-12-15T12:00:00'),
      location: 'Paris 19ème',
      participants: 8,
      maxParticipants: 10,
      type: 'atelier',
      status: 'passe',
      description: 'Atelier collectif pour préparer sereinement l\'accouchement.',
      price: 45
    },
    {
      id: 3,
      title: 'Atelier Projet de Naissance',
      date: new Date('2024-09-05T19:00:00'),
      endDate: new Date('2024-09-05T21:00:00'),
      location: 'En ligne',
      participants: 22,
      maxParticipants: 25,
      type: 'conference',
      status: 'passe',
      description: 'Conférence gratuite sur l\'allaitement maternel.',
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

  // Filtrage des événements
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

  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-purple-400">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
              {eventTypes[event.type as keyof typeof eventTypes]}
            </span>
            {event.price === 0 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Gratuit</span>}
          </div>
          <h3 className="font-poppins text-xl font-bold text-purple-900 mb-2">{event.title}</h3>
          <p className="font-inter text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
        </div>
        {event.price > 0 && <div className="text-right text-2xl font-bold text-purple-700">{event.price}€</div>}
      </div>
      <div className="space-y-3 mb-4 text-gray-600 text-sm">
        <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-purple-500" />{formatDate(event.date)}</div>
        <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-purple-500" />{formatTime(event.date)} - {formatTime(event.endDate)}</div>
        <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-purple-500" />{event.location}</div>
        <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-purple-500" />{event.participants}/{event.maxParticipants} participants</div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Événements & Ateliers - Doula Paris</title>
        <meta name="description" content="Découvrez tous nos événements : ateliers préparation accouchement, cercles de parole, formations massage bébé." />
        <meta name="keywords" content="ateliers doula Paris, formation massage bébé, cercle parole post-partum, préparation accouchement" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">Événements & Ateliers</h1>
            <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Rejoignez nos ateliers, formations et cercles de parole pour enrichir votre parcours de maternité.
            </p>
          </div>

          {/* Filtre et recherche */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                {Object.entries(eventTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>

          {/* Événements à venir */}
          <div className="mb-12">
            <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-8 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-purple-600" /> Événements à venir ({upcomingEvents.length})
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-poppins text-xl font-semibold text-gray-600 mb-2">Aucun événement à venir</h3>
                <p className="text-gray-500">Les prochains événements seront bientôt annoncés.</p>
              </div>
            )}
          </div>

          {/* Événements passés */}
          <div className="mb-12">
            <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-8">Événements passés ({pastEvents.length})</h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastEvents.map(event => <div key={event.id} className="opacity-75"><EventCard event={event} /></div>)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <p className="text-gray-500">Aucun événement passé trouvé avec ces critères.</p>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="font-poppins text-3xl font-bold mb-4">Ne ratez aucun événement</h2>
            <p className="font-inter text-lg mb-8 opacity-90">Inscrivez-vous à notre newsletter pour être informée en priorité.</p>
            <div className="max-w-md mx-auto flex gap-3">
              <input type="email" placeholder="Votre adresse email" className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white" />
              <button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all">S'inscrire</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Evenements;
