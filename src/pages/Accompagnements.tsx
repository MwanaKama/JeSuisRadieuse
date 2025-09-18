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

  const postnatalServices1 = [
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
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-4">
              Accompagnements
            </h1>
            <p className="font-inter text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Un soutien bienveillant et personnalisé tout au long de votre parcours de maternité. 
              Ensemble, nous construisons l'expérience qui vous correspond.
            </p>
          </div>

          {/* Prénatal */}
          <div className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            {/* Image en haut sur mobile */}
            <div className="relative order-first">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={Prenatale} 
                  alt="Accompagnement prénatal doula"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte */}
            <div>
              <div className="flex items-center mb-4">
                <Baby className="h-8 w-8 text-purple-700 mr-3" />
                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900">
                  Accompagnement Prénatal
                </h2>
              </div>

              <p className="font-inter text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                De la confirmation de grossesse jusqu'à l'accouchement, je vous accompagne 
                pour vivre cette période unique en toute sérénité.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {prenatalServices.map((service, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5" />
                    <span className="font-inter text-gray-700 text-sm md:text-base">{service}</span>
                  </li>
                ))}
              </ul>

              <CalendlyButton 
                text="Réserver un accompagnement prénatal"
                size="sm"
                className="px-4 py-2 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Postnatal */}
          <div className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            {/* Image */}
            <div className="relative order-first lg:order-last">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={PostPartum} 
                  alt="Soutien postnatal doula"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte */}
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-purple-700 mr-3" />
                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900">
                  Soutien Post-Partum
                </h2>
              </div>

              <p className="font-inter text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                Les premiers mois avec bébé sont précieux mais parfois difficiles. 
                Je vous accompagne dans cette nouvelle étape de votre vie avec douceur 
                et expertise pour vous aider à retrouver confiance et sérénité.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {postnatalServices1.map((service, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 mt-0.5" />
                    <span className="font-inter text-gray-700 text-sm md:text-base">{service}</span>
                  </li>
                ))}
              </ul>

              <CalendlyButton 
                text="Réserver un soutien postnatal"
                size="sm"
                className="px-4 py-2 text-sm md:text-base"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Accompagnements;
