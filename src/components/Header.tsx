import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import Logo from '../images/Logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Accompagnements', href: '/accompagnements' },
    { name: 'Soins', href: '/soins' },
    { name: 'Boutique', href: '/boutique' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Événements', href: '/evenements' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const openCalendly = () => {
    setShowCalendly(true);
    setIsMenuOpen(false);
  };

  const closeCalendly = () => {
    setShowCalendly(false);
  };

  // Fermeture avec Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCalendly) {
        closeCalendly();
      }
    };

    if (showCalendly) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCalendly]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <a href="#main-content" className="skip-to-main">
          Aller au contenu principal
        </a>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <img 
  src={Logo} 
  alt="Je Suis Radieuse" 
  className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105" 
/>
                <span className="font-poppins text-xl font-semibold text-purple-800">
                  Je Suis Radieuse
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-inter text-sm font-medium transition-colors hover:text-purple-600 ${
                    isActive(item.href)
                      ? 'text-purple-700 border-b-2 border-purple-400'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <button
                onClick={openCalendly}
                className="bg-gradient-to-r from-pink-200 to-purple-300 hover:from-pink-300 hover:to-purple-400 text-purple-800 border-0 font-poppins font-semibold inline-flex items-center space-x-2 transition-all hover:shadow-xl hover:scale-105 rounded-full px-4 py-2 text-sm"
              >
                <Calendar className="h-4 w-4" />
                <span>Prendre RDV</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-2"
                aria-label="Menu principal"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4">
                  <button
                    onClick={openCalendly}
                    className="w-full bg-gradient-to-r from-pink-200 to-purple-300 text-purple-800 border-0 font-poppins font-semibold inline-flex items-center justify-center space-x-2 transition-all hover:shadow-xl hover:scale-105 rounded-full px-6 py-3 text-base"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Prendre RDV</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Popup Calendly */}
      {showCalendly && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCalendly();
            }
          }}
        >
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h2 className="font-poppins text-xl font-bold text-purple-900">
                    Réserver un rendez-vous
                  </h2>
                  <p className="text-sm text-gray-600">Premier RDV gratuit - 30 minutes</p>
                </div>
              </div>
              <button
                onClick={closeCalendly}
                className="p-2 hover:bg-white rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Calendly Embed */}
            <div className="h-[600px] md:h-[700px]">
              <iframe
                src="https://calendly.com/jesuisradieuse/rencontredoula?embed_domain=localhost&embed_type=Inline&hide_gdpr_banner=1&hide_event_type_details=1"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendrier de réservation"
                style={{ border: 'none' }}
              />
            </div>

            {/* Mobile Close Button */}
            <div className="md:hidden p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeCalendly}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-full font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
