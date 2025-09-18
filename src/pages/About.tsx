import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, Award, Users, Calendar, Star, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

// Import des images depuis src/images
import meImg from '../images/me.png';
import me1Img from '../images/me-1.png';

const About = () => {
  const [expandedYear, setExpandedYear] = useState<string | null>("2022");

  // ... valeurs, stats et formationsByYear restent identiques

  const toggleYear = (year: string) => {
    if (expandedYear === year) setExpandedYear(null);
    else setExpandedYear(year);
  };

  return (
    <>
      <Helmet>
        <title>À propos - Je Suis Radieuse | Mon parcours et philosophie</title>
        <meta name="description" content="Doula certifiée avec 5 ans d'expérience à Paris. Découvrez mon parcours, ma formation et ma philosophie d'accompagnement bienveillant." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">À propos de moi</h1>
              <p className="font-inter text-lg text-gray-700 mb-8 leading-relaxed">
                Bonjour, je suis <strong>Emilie</strong>, doula passionnée...
              </p>
              <Link to="/planning" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-poppins font-semibold text-lg inline-flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Prendre un 1er RDV gratuit</span>
              </Link>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                <img src={meImg} alt="Emilie - Doula certifiée" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Heart className="h-12 w-12 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Formation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-6 flex items-center">
                <Award className="h-8 w-8 mr-3 text-purple-600" /> Formation & Certifications
              </h2>
              {/* Formation principale */}
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-3xl overflow-hidden shadow-lg">
                <img src={me1Img} alt="Formation professionnelle doula" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Accordéon formations continues - reste identique */}
        </div>
      </div>
    </>
  );
};

export default About;
