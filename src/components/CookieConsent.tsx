import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-800 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-4 md:mb-0">
          Nous utilisons des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre politique de cookies.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-white text-purple-800 px-4 py-2 rounded-full font-semibold text-sm hover:bg-purple-100 transition-colors"
        >
          J'accepte
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;