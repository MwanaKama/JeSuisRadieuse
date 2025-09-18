// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';

import Home from './pages/Home';
import Accompagnements from './pages/Accompagnements';
import Soins from './pages/Soins';
import Boutique from './pages/Boutique';
import About from './pages/About';
import Evenements from './pages/Evenements';

/* Ajoute ici l'import des pages existantes */
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsGenerales from './pages/ConditionsGenerales';

import './App.css';

function App() {
  return (
    <HelmetProvider>
      {/* Ajout du Helmet pour le favicon global */}
      <Helmet>
        <link rel="icon" type="image/png" href="/logo.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#9C27B0" />
      </Helmet>
      
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/accompagnements" element={<Accompagnements />} />
              <Route path="/soins" element={<Soins />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/evenements" element={<Evenements />} />
              <Route path="/planning" element={<Evenements />} />

              {/* Routes pour les pages légales */}
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route
                path="/politique-de-confidentialite"
                element={<PolitiqueConfidentialite />}
              />
              <Route
                path="/conditions-generales"
                element={<ConditionsGenerales />}
              />

              {/* Optionnel : page 404 basique */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
