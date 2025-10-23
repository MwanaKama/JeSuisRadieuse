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
    '1 visite de 4h à domicile par semaine',
    '6 séances pendant 6 semaines après la naissance',
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
      features: prenatalServices,
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
      features: postnatalServices,
      cta: 'Réserver maintenant',
      popular: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Accompagnements</title>
        <meta name="description" content="Accompagnement doula prénatal et postnatal à Paris. Préparation accouchement, soutien allaitement. Premier RDV gratuit." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold text-purple-900 mb-3 md:mb-4">
              Accompagnements
            </h1>
            <p className="font-inter text-sm md:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Un soutien bienveillant et personnalisé tout au long de votre parcours de maternité. 
              Ensemble, nous construisons l'expérience qui vous correspond.
            </p>
          </div>

          {/* Prénatal */}
          <div className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center mb-12 md:mb-20">
            {/* Image */}
            <div className="relative order-first">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
                <img 
                  src={Prenatale} 
                  alt="Accompagnement prénatal doula"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte */}
            <div className="order-last lg:order-first">
              <div className="flex items-center mb-3 md:mb-4">
                <Baby className="h-6 w-6 md:h-8 md:w-8 text-purple-700 mr-2 md:mr-3" />
                <h2 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold text-purple-900">
                  Accompagnement Prénatal
                </h2>
              </div>

              <p className="font-inter text-gray-700 mb-4 md:mb-6 text-sm md:text-base lg:text-lg leading-relaxed">
                De la confirmation de grossesse jusqu'à l'accouchement, je vous accompagne 
                pour vivre cette période unique en toute sérénité.
              </p>

              <ul className="grid grid-cols-1 gap-2 md:gap-3 mb-4 md:mb-6">
                {prenatalServices.map((service, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-gray-700 text-xs md:text-sm">{service}</span>
                  </li>
                ))}
              </ul>

              <CalendlyButton 
                text="Réserver un accompagnement prénatal"
                size="sm"
                className="w-full md:w-auto px-4 py-2 text-xs md:text-sm"
              />
            </div>
          </div>

          {/* Postnatal */}
          <div className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center mb-12 md:mb-20">
            {/* Image */}
            <div className="relative order-first">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
                <img 
                  src={PostPartum} 
                  alt="Soutien postnatal doula"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-purple-700 mr-2 md:mr-3" />
                <h2 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold text-purple-900">
                  Soutien Post-Partum
                </h2>
              </div>

              <p className="font-inter text-gray-700 mb-4 md:mb-6 text-sm md:text-base lg:text-lg leading-relaxed">
                Les premiers mois avec bébé sont précieux mais parfois difficiles. 
                Je vous accompagne dans cette nouvelle étape de votre vie avec douceur 
                et expertise pour vous aider à retrouver confiance et sérénité.
              </p>

              <ul className="grid grid-cols-1 gap-2 md:gap-3 mb-4 md:mb-6">
                {postnatalServices.map((service, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-gray-700 text-xs md:text-sm">{service}</span>
                  </li>
                ))}
              </ul>

              <CalendlyButton 
                text="Réserver un soutien postnatal"
                size="sm"
                className="w-full md:w-auto px-4 py-2 text-xs md:text-sm"
              />
            </div>
          </div>

          {/* Packages */}
          <div className="mb-12 md:mb-16 bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg md:shadow-xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold text-purple-900 mb-3 md:mb-4">
                Formules d'accompagnement
              </h2>
              <p className="font-inter text-sm md:text-base text-gray-600">
                Choisissez la formule qui correspond le mieux à vos besoins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] relative ${
                    pkg.popular ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Populaire</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="font-poppins text-base md:text-lg lg:text-xl font-bold text-purple-900 mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-700">{pkg.price}</span>
                      <span className="text-gray-500 text-xs md:text-sm ml-1">/ {pkg.duration}</span>
                    </div>
                    <p className="font-inter text-gray-600 text-xs md:text-sm">
                      {pkg.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5" />
                        <span className="font-inter text-gray-700 text-xs md:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="w-full">
                    <CalendlyButton 
                      text={pkg.cta}
                      variant={pkg.popular ? 'primary' : 'outline'}
                      className="w-full justify-center text-xs md:text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center text-white">
            <h2 className="font-poppins text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
              Prête pour votre première consultation ?
            </h2>
            <p className="font-inter text-sm md:text-base lg:text-lg mb-6 md:mb-8 opacity-90">
              Rencontrons-nous pour un premier échange gratuit et sans engagement
            </p>
            <CalendlyButton 
              text="Prendre un 1er RDV gratuit"
              variant="secondary"
              size="md"
              className="text-xs md:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Accompagnements;
