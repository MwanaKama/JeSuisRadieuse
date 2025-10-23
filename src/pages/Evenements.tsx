import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, MapPin, Users, Filter, Search } from 'lucide-react';

const Evenements = () => {
  const [filter, setFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

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

  // SECURE newsletter handler - no API key in frontend
const handleNewsletterSubscription = async (e) => {
  e.preventDefault();
  
  if (!newsletterEmail) return;
  
  setSubscriptionStatus('loading');
  setSubscriptionMessage('');

  try {
    // Call our secure Netlify function
    const response = await fetch('/.netlify/functions/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: newsletterEmail }),
    });

    const data = await response.json();

    if (response.ok) {
      setSubscriptionStatus('success');
      setSubscriptionMessage(data.message);
      setNewsletterEmail('');
    } else {
      setSubscriptionStatus('error');
      setSubscriptionMessage(data.error || '❌ Erreur lors de l\'inscription');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    setSubscriptionStatus('error');
    setSubscriptionMessage('❌ Erreur réseau. Veuillez réessayer.');
  }
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

  const getEventTypeColor = (type) => {
    const colors = {
      'atelier': 'bg-purple-100 text-purple-800',
      'cercle': 'bg-pink-100 text-pink-800',
      'formation': 'bg-blue-100 text-blue-800',
      'conference': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (date) => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all p-4 md:p-6 border-l-4 border-purple-400">
      <div className="flex flex-col md:flex-row justify-between items-start mb-3 md:mb-4">
        <div className="flex-1 mb-3 md:mb-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
              {eventTypes[event.type]}
            </span>
            {event.price === 0 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Gratuit</span>}
          </div>
          <h3 className="font-poppins text-lg md:text-xl font-bold text-purple-900 mb-2">{event.title}</h3>
          <p className="font-inter text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">{event.description}</p>
        </div>
        {event.price > 0 && <div className="text-right text-xl md:text-2xl font-bold text-purple-700 self-end md:self-auto">{event.price}€</div>}
      </div>
      <div className="space-y-2 md:space-y-3 mb-4 text-gray-600 text-xs md:text-sm">
        <div className="flex items-center"><Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 text-purple-500" />{formatDate(event.date)}</div>
        <div className="flex items-center"><Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 text-purple-500" />{formatTime(event.date)} - {formatTime(event.endDate)}</div>
        <div className="flex items-center"><MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2 text-purple-500" />{event.location}</div>
        <div className="flex items-center"><Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-purple-500" />{event.participants}/{event.maxParticipants} participants</div>
      </div>
      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-lg md:rounded-full font-poppins font-semibold text-sm md:text-base transition-all hover:shadow-lg">
        S'inscrire
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Événements & Ateliers</title>
        <meta name="description" content="Découvrez tous nos événements : ateliers préparation accouchement, cercles de parole, formations massage bébé." />
        <meta name="keywords" content="ateliers doula Paris, formation massage bébé, cercle parole post-partum, préparation accouchement" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-4 md:mb-6">Événements & Ateliers</h1>
            <p className="font-inter text-sm md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Rejoignez nos ateliers, formations et cercles de parole pour enrichir votre parcours de maternité.
            </p>
          </div>

          {/* Filtre et recherche */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 md:h-5 md:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
              >
                {Object.entries(eventTypes).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>

          {/* Événements à venir */}
          <div className="mb-10 md:mb-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900 mb-6 md:mb-8 flex items-center">
              <Calendar className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-purple-600" /> 
              Événements à venir ({upcomingEvents.length})
            </h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            ) : (
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 text-center shadow-lg">
                <Calendar className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                <h3 className="font-poppins text-lg md:text-xl font-semibold text-gray-600 mb-2">Aucun événement à venir</h3>
                <p className="text-gray-500 text-sm md:text-base">Les prochains événements seront bientôt annoncés.</p>
              </div>
            )}
          </div>

          {/* Événements passés */}
          <div className="mb-10 md:mb-12">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900 mb-6 md:mb-8">Événements passés ({pastEvents.length})</h2>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {pastEvents.map(event => <div key={event.id} className="opacity-75"><EventCard event={event} /></div>)}
              </div>
            ) : (
              <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg">
                <p className="text-gray-500 text-sm md:text-base">Aucun événement passé trouvé avec ces critères.</p>
              </div>
            )}
          </div>

          {/* Newsletter Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center text-white">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ne ratez aucun événement</h2>
            <p className="font-inter text-sm md:text-lg mb-6 md:mb-8 opacity-90">Inscrivez-vous à notre newsletter pour être informée en priorité.</p>
            
            <form onSubmit={handleNewsletterSubscription} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={subscriptionStatus === 'loading'}
                  className="flex-1 px-4 py-2 md:py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base" 
                  required
                />
                <button 
                  type="submit"
                  disabled={subscriptionStatus === 'loading'}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 md:py-3 rounded-full font-medium transition-all text-sm md:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscriptionStatus === 'loading' ? 'Inscription...' : "S'inscrire"}
                </button>
              </div>
              
              {/* Status Messages */}
              {subscriptionStatus === 'success' && (
                <p className="mt-4 text-green-200 font-medium">{subscriptionMessage}</p>
              )}
              {subscriptionStatus === 'error' && (
                <p className="mt-4 text-red-200 font-medium">{subscriptionMessage}</p>
              )}
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Evenements;
