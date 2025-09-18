import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, Award, Users, Calendar, Star, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import MeImg from '../images/me.png';
import Me1Img from '../images/me-1.png';

const About = () => {
  const [expandedYear, setExpandedYear] = useState<string | null>("2022");

  const values = [
    { icon: Heart, title: 'Bienveillance', description: 'Chaque femme mérite un accompagnement respectueux et sans jugement' },
    { icon: Users, title: 'Écoute Active', description: 'Votre parole et vos besoins sont au centre de mon accompagnement' },
    { icon: Star, title: 'Excellence', description: 'Formation continue et pratiques basées sur les dernières recherches' },
    { icon: BookOpen, title: 'Transmission', description: 'Partage de connaissances pour votre autonomie et confiance en vous' }
  ];

  const stats = [
    { number: '5 ans', label: "D'expérience" },
    { number: '99%', label: 'De satisfaction' },
    { number: '15+', label: 'Formations certifiées' },
    { number: '100%', label: 'Accompagnement personnalisé' }
  ];

  type FormationYear = "2022" | "2021" | "2020" | "2019";
  type Formation = { date: string; title: string; formateur: string };

  const formationsByYear: Record<FormationYear, Formation[]> = {
    "2022": [
      { date: "Février 2022", title: "REBOZO: FERMETURE & POST-PARTUM/DEUIL PÉRINATAL/PARCOURS PRÉ-CONCEPTION", formateur: "Par Elsa Uzan" },
      { date: "Janvier 2022", title: "GROSSESSE ET OUVERTURE, REBOZO PENDANT LA GROSSESSE", formateur: "Par Elsa Uzan" },
      { date: "Janvier 2022", title: "WORKSHOP SPINNING BABIES®", formateur: "Par Nikki Zerfas - Spinning Babies® Approved Trainer" },
    ],
    "2021": [
      { date: "Juillet 2021", title: "ALLAITEMENT ET SITUATIONS PARTICULIÈRES", formateur: "Par Ingrid Bayot" },
      { date: "Juin 2021", title: "PRATICIENNE DE VAPEURS FÉMININES", formateur: "Par Adidi Gracia Mk Doula" },
      { date: "Mars 2021", title: "TRANSMISSION DU RITUEL DU REBOZO", formateur: "Par Fardati Boina" },
    ],
    "2020": [
      { date: "Décembre 2020", title: "LE RITUEL DU REBOZO", formateur: "Par Yael Flauder" },
      { date: "Décembre 2020", title: "LE QUATRIÈME TRIMESTRE DE GROSSESSE", formateur: "Par Ingrid Bayot" },
      { date: "Octobre 2020", title: "LE SOMMEIL DU TOUT-PETIT (0-2 ANS)", formateur: "Par Ingrid Bayot" },
    ],
    "2019": [
      { date: "Novembre 2019", title: "SIPED DES DOULAS DE FRANCE", formateur: "Session d'information DDF" },
      { date: "Octobre 2019", title: "SÉMINAIRE PARANAMA DOULA", formateur: "Par Michel Odent et Liliana Lammers" },
    ]
  };

  const toggleYear = (year: FormationYear) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <>
      <Helmet>
        <title>À propos - Je Suis Radieuse</title>
        <meta name="description" content="Doula certifiée avec 5 ans d'expérience à Paris." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
            <div>
              <h1 className="font-poppins text-3xl md:text-5xl font-bold text-purple-900 mb-4 md:mb-6">
                À propos de moi
              </h1>
              <p className="font-inter text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Bonjour, je suis <strong>Emilie</strong>, doula passionnée par l'accompagnement 
                des femmes dans leur parcours de maternité. Depuis 5 ans, j'ai le privilège 
                de partager ces moments uniques et précieux avec les familles.
              </p>
              <p className="font-inter text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed">
                Formée par des professionnelles reconnues au Québec, je vous offre 
                un accompagnement bienveillant basé sur des techniques traditionnelles et modernes.
              </p>
              <Link
                to="/planning"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-5 py-3 md:px-8 md:py-4 rounded-full font-poppins font-semibold text-base md:text-lg inline-flex items-center space-x-2 transition-all hover:shadow-xl hover:scale-105"
              >
                <Calendar className="h-5 w-5" />
                <span>Prendre un 1er RDV gratuit</span>
              </Link>
            </div>
            
            <div className="relative">
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                <img src={MeImg} alt="Emilie - Doula certifiée" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Heart className="h-8 w-8 md:h-12 md:w-12 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-xl md:text-3xl font-bold text-purple-700 mb-1 md:mb-2 font-poppins">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-inter text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16 md:mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-poppins text-2xl md:text-4xl font-bold text-purple-900 mb-3 md:mb-4">
                Mes valeurs
              </h2>
              <p className="font-inter text-base md:text-lg text-gray-600">
                Les principes qui guident mon accompagnement au quotidien
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-purple-700" />
                    </div>
                    <h3 className="font-poppins text-base md:text-lg font-semibold text-purple-900 text-center mb-2 md:mb-3">
                      {value.title}
                    </h3>
                    <p className="font-inter text-gray-600 text-center text-sm md:text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formation */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h2 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900 mb-4 md:mb-6 flex items-center">
                  <Award className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-purple-600" />
                  Formation & Certifications
                </h2>
                <p className="font-inter text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                  Le métier de doula n'étant pas réglementé, j’ai suivi des formations auprès de professionnelles reconnues. 
                  Je continue à me former régulièrement pour vous offrir le meilleur accompagnement.
                </p>
              </div>
              <div className="relative">
                <div className="w-full h-56 md:h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
                  <img src={Me1Img} alt="Formation professionnelle doula" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Liste formations */}
            <div className="mt-8 md:mt-12 border-t border-gray-200 pt-6 md:pt-8">
              <div className="text-center mb-6 md:mb-10">
                <h3 className="font-poppins text-xl md:text-3xl font-bold text-purple-900 mb-2 md:mb-3">
                  Formations Continues
                </h3>
              </div>
              {(Object.keys(formationsByYear) as FormationYear[])
                .sort((a, b) => Number(b) - Number(a))
                .map((year) => (
                  <div key={year} className="border border-purple-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow mb-4 md:mb-6">
                    <button
                      onClick={() => toggleYear(year)}
                      className="w-full flex justify-between items-center p-4 md:p-5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <h4 className="font-poppins text-base md:text-xl font-semibold text-purple-900 text-left">
                        Formations {year} 
                        <span className="text-purple-600 text-xs md:text-sm font-normal ml-2 md:ml-3">
                          ({formationsByYear[year].length} formations)
                        </span>
                      </h4>
                      {expandedYear === year ? (
                        <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                      )}
                    </button>
                    {expandedYear === year && (
                      <div className="p-4 md:p-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formationsByYear[year].map((formation, index) => (
                            <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 md:p-5 border border-purple-100">
                              <div className="text-xs font-semibold text-purple-700 mb-1 md:mb-2 uppercase">
                                {formation.date}
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                                {formation.title}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600">
                                {formation.formateur}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white text-center">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Ma philosophie
            </h2>
            <p className="font-inter text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-4 md:mb-8 opacity-90">
              Je crois profondément que chaque femme porte en elle la sagesse nécessaire 
              pour vivre sa maternité. Mon rôle est de vous accompagner pour que vous puissiez 
              faire confiance à votre instinct et prendre les décisions qui vous correspondent.
            </p>
            <p className="font-inter text-base md:text-lg leading-relaxed max-w-3xl mx-auto opacity-90">
              Ensemble, nous créons un espace sécurisant où vous pouvez explorer 
              vos émotions, vos peurs et vos joies, et vous préparer à accueillir 
              cette nouvelle version de vous-même.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
