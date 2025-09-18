import { Helmet } from 'react-helmet-async';
import { Baby, Heart, CheckCircle, Star } from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';
import Prenatale from '../images/prénatale.png';
import PostPartum from '../images/post-partum.png';

const Accompagnements = () => {
  const prenatalServices = [
    'Techniques de relaxation et respiration',
    'Soutien dans l\'élaboration du projet de naissance',
    'Accompagnement des peurs et angoisses',
    'Information sur les choix possibles',
    'Préparation du partenaire',
    '4 séances pré-natale',
    '1 séance post-partum',
  ];

  const postnatalServices = [
    '3 séances pré-natale',
    '1 séance post-partum',
    '1 soin rebozo pré ou post-partum',
    'Conseils pour la maman',
    'Écoute et soutien émotionnel',
    'Techniques de relaxation et respiration',
    'Soutien dans l\'élaboration du projet de naissance',
    'Accompagnement des peurs et angoisses',
    'Information sur les choix possibles',
    'Préparation du partenaire',
  ];

  const postnatalServices1 = [
    '1 visite de 4h à domicile par semaine',
    '6 séances pendant 6 semaines après la naissance',
    '1 séance post-partum',
    'Permanence téléphonique 24h/24 7j/7',
    'Soutien à l\'allaitement maternel',
    'Conseils pour la maman',
    'Écoute et soutien émotionnel',
  ];

  const packages = [
    {
      name: 'Forfait Maman Radieuse',
      price: '300€',
      duration: '4 séances + 1 soin',
      description: 'Accompagnement prénatal et post-partum',
      features: postnatalServices,
      cta: 'Réserver maintenant',
      popular: false
    },
    {
      name: 'Forfait maman sereine',
      price: '280€',
      duration: '5 séances environ 7h30',
      description: 'Préparation complète à l\'accouchement et à l\'accueil de bébé',
      features: prenatalServices,
      cta: 'Réserver maintenant',
      popular: true
    },
    {
      name: 'Forfait D\'Or',
      price: '550€',
      duration: '6 séances',
      description: 'Accompagnement post-partum',
      features: postnatalServices1,
      cta: 'Réserver maintenant',
      popular: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Accompagnements Grossesse & Post-partum | Je Suis Radieuse Doula Paris</title>
        <meta name="description" content="Accompagnement doula prénatal et postnatal à Paris. Préparation accouchement, soutien allaitement. Premier RDV gratuit." />
        <meta name="keywords" content="doula Paris, accompagnement grossesse, post-partum, préparation accouchement, soutien allaitement" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">
              Accompagnements
            </h1>
            <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Un soutien bienveillant et personnalisé tout au long de votre parcours de maternité. 
              Ensemble, nous construisons l'expérience qui vous correspond.
            </p>
          </div>

          {/* Services Overview */}
          <div className="space-y-20">
            {/* Prénatal */}
            <div id="prenatal" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mr-4">
                    <Baby className="h-8 w-8 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="font-poppins text-3xl font-bold text-purple-900">
                      Accompagnement Prénatal
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-600 mt-1">
                      <div className="text-2xl font-bold text-purple-700">
                        Sur devis
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="font-inter text-gray-700 mb-8 text-lg leading-relaxed">
                  De la confirmation de grossesse jusqu'à l'accouchement, je vous accompagne 
                  pour vivre cette période unique en toute sérénité avec des techniques 
                  personnalisées et un soutien bienveillant.
                </p>
                
                <div className="mb-8">
                  <h3 className="font-poppins text-xl font-semibold text-purple-900 mb-4">
                    Ce que comprend l'accompagnement
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prenatalServices.map((service, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="font-inter text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <CalendlyButton 
                  text="Réserver un accompagnement prénatal"
                  size="lg"
                />
              </div>

              {/* Image */}
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
  src={Prenatale} 
  alt="Accompagnement prénatal doula"
  className="w-full h-full object-cover"
/>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Baby className="h-12 w-12 text-purple-600" />
                </div>
              </div>
            </div>
            
            {/* Postnatal */}
            <div id="postnatal" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative lg:order-first">
                <div className="w-full h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-3xl overflow-hidden shadow-2xl">
                 <img 
  src={PostPartum} 
  alt="Soutien postnatal doula"
  className="w-full h-full object-cover"
/>
                </div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Heart className="h-12 w-12 text-purple-600" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:order-last">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full flex items-center justify-center mr-4">
                    <Heart className="h-8 w-8 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="font-poppins text-3xl font-bold text-purple-900">
                      Soutien Post-Partum
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-600 mt-1">
                      <div className="text-2xl font-bold text-purple-700">
                        Sur devis
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="font-inter text-gray-700 mb-8 text-lg leading-relaxed">
                  Les premiers mois avec bébé sont précieux mais parfois difficiles. 
                  Je vous accompagne dans cette nouvelle étape de votre vie avec douceur 
                  et expertise pour vous aider à retrouver confiance et sérénité.
                </p>
                
                <div className="mb-8">
                  <h3 className="font-poppins text-xl font-semibold text-purple-900 mb-4">
                    Ce que comprend l'accompagnement
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {postnatalServices1.map((service, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="font-inter text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <CalendlyButton 
                  text="Réserver un soutien postnatal"
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="mb-16 bg-white rounded-3xl p-12 shadow-xl">
            <div className="text-center mb-12">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-4">
                Formules d'accompagnement
              </h2>
              <p className="font-inter text-lg text-gray-600">
                Choisissez la formule qui correspond le mieux à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 relative ${
                    pkg.popular ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>Populaire</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-poppins text-xl font-bold text-purple-900 mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-purple-700">{pkg.price}</span>
                      <span className="text-gray-500 ml-2">/ {pkg.duration}</span>
                    </div>
                    <p className="font-inter text-gray-600 text-sm">
                      {pkg.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="font-inter text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="w-full">
                    <CalendlyButton 
                      text={pkg.cta}
                      variant={pkg.popular ? 'primary' : 'outline'}
                      className="w-full justify-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-center text-white">
            <h2 className="font-poppins text-3xl font-bold mb-4">
              Prête pour votre première consultation ?
            </h2>
            <p className="font-inter text-lg mb-8 opacity-90">
              Rencontrons-nous pour un premier échange gratuit et sans engagement
            </p>
            <CalendlyButton 
              text="Prendre un 1er RDV gratuit"
              variant="secondary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Accompagnements;
