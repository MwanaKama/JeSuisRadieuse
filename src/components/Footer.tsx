import { Mail, MapPin, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../images/Logo.png';

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate();

  // Fonction pour gérer l'affichage du bouton de défilement
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Fonction pour naviguer vers une page et scroller vers le haut
  const navigateToTop = (path: string) => {
    if (window.location.pathname === path) {
      // Si on est déjà sur la page, on scroll vers le haut
      scrollToTop();
    } else {
      // Si on est sur une autre page, on navigue vers la page
      navigate(path);
      // On scroll vers le haut après un court délai pour laisser le temps à la page de charger
      setTimeout(scrollToTop, 100);
    }
  };

  // Fonction pour naviguer vers une section spécifique
  const navigateToSection = (path: string, sectionId: string) => {
    if (window.location.pathname === path) {
      // Si on est déjà sur la page, on scroll vers la section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Si la section n'est pas trouvée, on scroll vers le haut
        scrollToTop();
      }
    } else {
      // Si on est sur une autre page, on navigue vers la page
      navigate(path);
      // On scroll vers la section après un court délai
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        } else {
          scrollToTop();
        }
      }, 100);
    }
  };

  // Fonction pour naviguer vers la section Yoni Steam
  const navigateToYoniSteam = () => {
    navigateToSection('/soins', 'yoni-steam');
  };

  // Fonction pour naviguer vers la section Prénatal
  const navigateToPrenatal = () => {
    navigateToSection('/accompagnements', 'prenatal');
  };

  // Fonction pour naviguer vers la section Postnatal
  const navigateToPostnatal = () => {
    navigateToSection('/accompagnements', 'postnatal');
  };

  return (
    <>
      <footer className="bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
  src={Logo} 
  alt="Je Suis Radieuse" 
  className="w-10 h-10 object-contain" 
/>
                <span className="font-poppins text-xl font-semibold">
                  Je Suis Radieuse
                </span>
              </div>
              <p className="text-purple-200 mb-6 max-w-md font-inter">
                Accompagnement bienveillant et personnalisé pour votre parcours de maternité. 
                Soins traditionnels et soutien émotionnel dans le respect de vos choix.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-pink-200" />
                  <span className="text-sm">mamanradieuse@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-pink-200" />
                  <span className="text-sm">Paris & Région Parisienne</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-poppins font-semibold mb-4">Services</h3>
              <ul className="space-y-2 font-inter text-sm">
                <li>
                  <span 
                    className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                    onClick={navigateToPrenatal}
                  >
                    Accompagnement Prénatal
                  </span>
                </li>
                <li>
                  <span 
                    className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                    onClick={navigateToPostnatal}
                  >
                    Soutien Post-Partum
                  </span>
                </li>
                <li>
                  <span 
                    className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                    onClick={navigateToYoniSteam}
                  >
                    Yoni Steam
                  </span>
                </li>
                <li>
                  <span 
                    className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                    onClick={() => navigateToTop('/soins')}
                  >
                    Massage Rebozo
                  </span>
                </li>
                <li>
                  <span 
                    className="text-purple-200 hover:text-white transition-colors cursor-pointer"
                    onClick={() => navigateToTop('/boutique')}
                  >
                    Boutique
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h3 className="font-poppins font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4 mb-6">
                <a 
                  href="https://www.instagram.com/jesuisradieuse/" 
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/emilie.epanouie" 
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
              
              <div className="space-y-2 font-inter text-sm">
                <Link to="/mentions-legales" className="block text-purple-200 hover:text-white transition-colors">
                  Mentions Légales
                </Link>
                <Link to="/politique-de-confidentialite" className="block text-purple-200 hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
                <Link to="/conditions-generales" className="block text-purple-200 hover:text-white transition-colors">
                  Conditions Générales
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-800 mt-8 pt-8 text-center">
            <p className="text-purple-200 text-sm font-inter">
              © {new Date().getFullYear()} Je Suis Radieuse. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Bouton "Retour en haut" */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
          aria-label="Retour en haut de la page"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Footer;
