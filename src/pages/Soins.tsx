import { Helmet } from 'react-helmet-async';
import { Sparkles, Flower2, Clock, CheckCircle } from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import correct des images
import rebozoImg from '../images/rebozo.jpg';
import yoniSteamImg from '../images/yoni-steam.png';

const Soins = () => {
  const location = useLocation();

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
    'Préparation pré-conception',
    'Récupération post-partum',
    'Régulation du cycle menstruel'
  ];

  const rebozoBenefits = [
    'Détente musculaire profonde',
    'Réalignement du bassin',
    'Massage traditionnel',
    'Soulagement des tensions',
    'Accompagnement émotionnel',
    'Rituel de fermeture post-partum'
  ];

  const services = [
    {
      name: 'Massage Rebozo',
      id: 'rebozo',
      icon: Sparkles,
      duration: '1h30',
      price: '90€',
      description: 'Massage traditionnel mexicain',
      benefits: rebozoBenefits,
      image: rebozoImg,
    },
    {
      name: 'Yoni Steam',
      id: 'yoni-steam',
      icon: Flower2,
      duration: '60 min',
      price: '60€',
      description: 'Bain de vapeur aux plantes médicinales pour le bien-être féminin',
      benefits: yoniSteamBenefits,
      image: yoniSteamImg,
    }
  ];

  return (
    <>
      <Helmet>
        <title>Je suis Radieuse | Soins</title>
        <meta
          name="description"
          content="Soins traditionnels pour femmes : Massage Rebozo et Yoni Steam. Bien-être féminin, récupération post-partum. Séances à Paris."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-4">
              Soins Traditionnels
            </h1>
            <p className="font-inter text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Des rituels ancestraux adaptés aux femmes d'aujourd'hui. Reconnectez-vous à votre féminité dans un espace sacré de bien-être et de guérison.
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  id={service.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                >
                  {/* Image */}
                  <div className="relative order-first">
                    <div className="w-full h-64 md:h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <IconComponent className="h-8 w-8 md:h-12 md:w-12 text-purple-600" />
                    </div>
                  </div>

                  {/* Texte */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mr-3">
                        <IconComponent className="h-6 w-6 text-purple-700" />
                      </div>
                      <div>
                        <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900">
                          {service.name}
                        </h2>
                        <div className="flex items-center space-x-4 text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{service.duration}</span>
                          </div>
                          <div className="text-xl md:text-2xl font-bold text-purple-700">
                            {service.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="font-inter text-gray-700 mb-6 text-sm md:text-base leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h3 className="font-poppins text-lg md:text-xl font-semibold text-purple-900 mb-3">
                        Bienfaits
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start space-x-2 text-sm md:text-base"
                          >
                            <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5" />
                            <span className="font-inter text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <CalendlyButton
                      text="Réserver une séance"
                      size="sm"
                      className="px-4 py-2 text-sm md:text-base"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Soins;
