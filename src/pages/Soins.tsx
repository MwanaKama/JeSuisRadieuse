import { Helmet } from 'react-helmet-async';
import { Sparkles, Flower2, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RebozoImg from '../images/rebozo.jpg';
import YoniSteamImg from '../images/yoni-steam.png';

const Soins = () => {
  const location = useLocation();

  // Gestion du scroll vers les ancres au chargement de la page
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const yoniSteamBenefits = [
    'Nettoyage en douceur et purification',
    'Stimulation de la circulation sanguine',
    'Soutien hormonal naturel',
    'Détente profonde et reconnexion',
    'Préparation pré-conceptionnelle',
    'Récupération post-partum'
  ];

  const rebozoBenefits = [
    'Détente musculaire profonde',
    'Réalignement du bassin',
    'Massage thérapeutique traditionnel',
    'Soulagement des tensions',
    'Accompagnement émotionnel',
    'Rituel de fermeture post-partum'
  ];

  // Remplacez ces liens par vos propres liens Google Calendar
  const rebozoBookingLink = "https://calendly.com/jesuisradieuse/rencontredoula";
  const yoniSteamBookingLink = "https://calendly.com/jesuisradieuse/rencontredoula";

  const services = [
    const services = [
  {
    name: 'Massage Rebozo',
    id: 'rebozo',
    icon: Sparkles,
    duration: '1h30 min',
    price: '90€',
    description: 'Massage traditionnel mexicain',
    benefits: rebozoBenefits,
    image: RebozoImg, // ← ici
    bookingLink: rebozoBookingLink
  },
      {
    name: 'Yoni Steam',
    id: 'yoni-steam',
    icon: Flower2,
    duration: '60 min',
    price: '60€',
    description: 'Bain de vapeur aux plantes médicinales pour le bien-être féminin',
    benefits: yoniSteamBenefits,
    image: YoniSteamImg, // ← ici
    bookingLink: yoniSteamBookingLink
  }
  ];

  return (
    <>
      <Helmet>
        <title>Soins | Je suis Radieuse</title>
        <meta name="description" content="Soins traditionnels pour femmes : Massage Rebozo et Yoni Steam. Bien-être féminin, récupération post-partum. Séances à Paris." />
        <meta name="keywords" content="massage rebozo, yoni steam Paris, soins traditionnels femmes, bien-être féminin, récupération post-partum" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              Soins Traditionnels
            </h1>
            <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Des rituels ancestraux adaptés aux femmes d'aujourd'hui. 
              Reconnectez-vous à votre féminité dans un espace sacré de bien-être et de guérison.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-20">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  id={service.id}
                  className={`scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  {/* Content */}
                   <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mr-4">
                        <IconComponent className="h-8 w-8 text-purple-700" />
                      </div>
                      <div>
                        <h2 className="font-poppins text-3xl font-bold text-purple-900">
                          {service.name}
                        </h2>
                        <div className="flex items-center space-x-4 text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{service.duration}</span>
                          </div>
                          <div className="text-2xl font-bold text-purple-700">
                            {service.price}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="font-inter text-gray-700 mb-8 text-lg leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="mb-8">
                      <h3 className="font-poppins text-xl font-semibold text-purple-900 mb-4">
                        Bienfaits
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                            <span className="font-inter text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <CalendlyButton 
                      text="Réserver une séance"
                      size="lg"
                    />
                  </div>

                  {/* Image */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="relative">
                      <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                        <img 
                          src={service.image}
                          alt={`Soin ${service.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <IconComponent className="h-12 w-12 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Information Section */}
          <div className="mt-20 bg-white rounded-3xl p-12 shadow-xl">
            <h2 className="font-poppins text-3xl font-bold text-purple-900 text-center mb-8">
              Informations pratiques
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="font-poppins text-lg font-semibold text-purple-900 mb-2">
                  Durée
                </h3>
                <p className="font-inter text-gray-600">
                  Séances de 60 minutes à 1h30 selon le soin choisi
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="font-poppins text-lg font-semibold text-purple-900 mb-2">
                  Lieu
                </h3>
                <p className="font-inter text-gray-600">
                  Chez vous, merci d'indiquer votre adresse à la réservation vous serez recontacter pour confirmer le rdv
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="font-poppins text-lg font-semibold text-purple-900 mb-2">
                  Réservation
                </h3>
                <p className="font-inter text-gray-600">
                  Planning en ligne via Calendly, annulation 48h à l'avance
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="font-poppins text-3xl font-bold mb-4">
              Offrez-vous un moment de bien-être
            </h2>
            <p className="font-inter text-lg mb-8 opacity-90">
              Prenez rendez-vous pour découvrir ces soins traditionnels adaptés à vos besoins
             </p>
            <CalendlyButton 
              text="Réserver maintenant"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Soins;
