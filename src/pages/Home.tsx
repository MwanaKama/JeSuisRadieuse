import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ArrowRight, Baby, Sparkles, Loader } from 'lucide-react';
import CalendlyButton from '../components/CalendlyButton';

// Import all images from src/images
import Logo from '../images/Logo.png';
import Hero from '../images/accompagnement-bienveillant.png';
import Choose from '../images/choisir-doula.png';
import Me1 from '../images/me-1.png';
import Me from '../images/me.png';
import PostPartum from '../images/post-partum.png';
import Prenatale from '../images/prénatale.png';
import Rebozo from '../images/rebozo.jpg';
import YoniSteam from '../images/yoni-steam.png';

// Fallbacks for safety (optional)
const fallbackHero = 'https://images.pexels.com/photos/1296154/pexels-photo-1296154.jpeg?auto=compress&cs=tinysrgb&w=800';
const fallbackChoose = 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800';

const GoogleReviews = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://featurable.com/assets/bundle.js"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://featurable.com/assets/bundle.js';
    script.defer = true;
    script.charset = 'UTF-8';
    
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setIsLoaded(false);

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://featurable.com/assets/bundle.js"]');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  return (
    <div className="google-reviews-section">
      {!isLoaded && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Loader className="h-12 w-12 text-pink-500 animate-spin" />
          </div>
          <p className="text-gray-600">Chargement des témoignages...</p>
        </div>
      )}
      <div 
        id="featurable-9938dc9f-37ad-4ce2-b05a-c3db0502854a" 
        data-featurable-async 
        style={{ minHeight: isLoaded ? 'auto' : 0, opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
      />
    </div>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 100;
      const position = section.offsetTop - offset;
      window.scrollTo({ top: position, behavior: 'smooth' });
      return true;
    }
    return false;
  };

  const navigateToSection = (path: string, sectionId: string) => {
    if (window.location.pathname === path) {
      if (!scrollToSection(sectionId)) window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
      sessionStorage.setItem('targetSection', sectionId);
      setTimeout(() => {
        if (sessionStorage.getItem('targetSection') === sectionId) sessionStorage.removeItem('targetSection');
      }, 3000);
    }
  };

  const navigateToTop = (path: string) => {
    if (window.location.pathname === path) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate(path);
  };

  const navigateToPrenatal = () => navigateToSection('/accompagnements', 'prenatal');
  const navigateToPostnatal = () => navigateToSection('/accompagnements', 'postnatal');
  const navigateToSoins = () => navigateToTop('/soins');

  const services = [
    { icon: Baby, title: 'Accompagnement Prénatal', description: 'Préparation physique et émotionnelle pour accueillir votre bébé en toute sérénité.', onClick: navigateToPrenatal },
    { icon: Heart, title: 'Soutien Post-Partum', description: 'Accompagnement personnalisé durant vos premiers mois avec bébé.', onClick: navigateToPostnatal },
    { icon: Sparkles, title: 'Soins Traditionnels', description: 'Yoni Steam et massage Rebozo pour votre bien-être et récupération.', onClick: navigateToSoins }
  ];

  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Accompagnement Bienveillant Pour Votre Maternité</title>
        <meta name="description" content="Doula expérimentée à Paris. Accompagnement personnalisé grossesse et post-partum, soins traditionnels, tisanes. Premier RDV gratuit." />
        <meta name="keywords" content="doula Paris, accompagnement grossesse, postnatal, yoni steam, rebozo, tisanes maternité" />
        <meta property="og:title" content="Je Suis Radieuse - Accompagnement Maternité" />
        <meta property="og:description" content="Accompagnement bienveillant pour votre parcours de maternité" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://jesuisradieuse.fr/" />
      </Helmet>

      <div id="main-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-poppins text-4xl md:text-6xl font-bold text-purple-900 mb-6 leading-tight">
                  Un accompagnement <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">bienveillant</span>
                  <br />pour votre maternité
                </h1>
                <p className="font-inter text-lg text-gray-700 mb-8 leading-relaxed">
                  Doula expérimentée, je vous accompagne avec douceur et respect dans votre parcours unique. Grossesse, accouchement, post-partum : ensemble, créons l'expérience qui vous ressemble.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <CalendlyButton text="Prendre un 1er RDV gratuit" size="lg" variant="primary" className="px-8 py-4 rounded-full font-poppins font-semibold text-lg transition-all hover:shadow-xl hover:scale-105" />
                  <button onClick={() => navigateToTop('/accompagnements')} className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-full font-poppins font-semibold text-lg flex items-center justify-center space-x-2 transition-all cursor-pointer">
                    <span>Découvrir mes services</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={Hero} alt="Accompagnement maternité bienveillant" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackHero; }} />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Heart className="h-12 w-12 text-pink-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-4">Mes accompagnements</h2>
              <p className="font-inter text-lg text-gray-600 max-w-3xl mx-auto">
                Chaque femme est unique. Mes services s'adaptent à vos besoins spécifiques pour vous offrir le soutien dont vous avez besoin.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl hover:shadow-xl transition-all hover:scale-105 group cursor-pointer" onClick={service.onClick}>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8 text-purple-700" />
                    </div>
                    <h3 className="font-poppins text-xl font-semibold text-purple-900 mb-3">{service.title}</h3>
                    <p className="font-inter text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <div className="text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-2 transition-colors">
                      <span>En savoir plus</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Choose Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-6">
                  Pourquoi choisir un accompagnement doula ?
                </h2>
                <div className="space-y-6">
                  {['Soutien émotionnel continu et bienveillant', 'Accompagnement personnalisé selon vos besoins', 'Techniques naturelles de bien-être et relaxation', 'Préparation complète à la parentalité', 'Respect de vos choix et valeurs'].map((benefit, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="h-3 w-3 text-purple-700" />
                      </div>
                      <p className="font-inter text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={Choose} alt="Choisir une doula" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackChoose; }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-4">Témoignages</h2>
              <p className="font-inter text-lg text-gray-600">L'expérience de celles qui m'ont fait confiance</p>
            </div>
            <GoogleReviews />
            <div className="mt-12 text-center">
              <CalendlyButton text="Réserver maintenant" size="lg" variant="primary" className="px-8 py-4 rounded-full font-poppins font-semibold text-lg transition-all hover:shadow-xl hover:scale-105" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
