import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Heart, Award, Users, Calendar, Star, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const About = () => {
  const [expandedYear, setExpandedYear] = useState<string | null>("2022"); // Ouvrir 2022 par défaut

  const values = [
    {
      icon: Heart,
      title: 'Bienveillance',
      description: 'Chaque femme mérite un accompagnement respectueux et sans jugement'
    },
    {
      icon: Users,
      title: 'Écoute Active',
      description: 'Votre parole et vos besoins sont au centre de mon accompagnement'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Formation continue et pratiques basées sur les dernières recherches'
    },
    {
      icon: BookOpen,
      title: 'Transmission',
      description: 'Partage de connaissances pour votre autonomie et confiance en vous'
    }
  ];

  const stats = [
    { number: '5 ans', label: 'D\'expérience' },
    { number: '99%', label: 'De satisfaction' },
    { number: '15+', label: 'Formations certifiées' },
    { number: '100%', label: 'Accompagnement personnalisé' }
  ];

  // Types pour les années et formations
  type FormationYear = "2022" | "2021" | "2020" | "2019";
  type Formation = { date: string; title: string; formateur: string };

  // Regroupement des formations par année
  const formationsByYear: Record<FormationYear, Formation[]> = {
    "2022": [
      { date: "Février 2022", title: "REBOZO: FERMETURE & POST-PARTUM/DEUIL PÉRINATAL/PARCOURS PRÉ-CONCEPTION", formateur: "Par Elsa Uzan, Doula parisienne" },
      { date: "Janvier 2022", title: "GROSSESSE ET OUVERTURE, REBOZO PENDANT LA GROSSESSE", formateur: "Par Elsa Uzan, Doula parisienne" },
      { date: "Janvier 2022", title: "WORKSHOP SPINNING BABIES®", formateur: "Par Nikki Zerfas RNC-EFM, IBCLC, SpBAP - Spinning Babies® Approved Trainer" },
    ],
    "2021": [
      { date: "Juillet 2021", title: "ALLAITEMENT ET SITUATIONS PARTICULIÈRES", formateur: "Par Ingrid Bayot - Formatrice en périnatalité et allaitement" },
      { date: "Juin 2021", title: "PRATICIENNE DE VAPEURS FÉMININES ANCESTRALES", formateur: "Par Adidi Gracia Mk Doula (Yoni Steam, bain de vapeur)" },
      { date: "Mars 2021", title: "TRANSMISSION DU RITUEL DU REBOZO", formateur: "Par Fardati Boina, Doula parisienne" },
    ],
    "2020": [
      { date: "Décembre 2020", title: "LE RITUEL DU REBOZO", formateur: "Par Yael Flauder - Assistante sage-femme au Mexique" },
      { date: "Décembre 2020", title: "LE QUATRIÈME TRIMESTRE DE GROSSESSE", formateur: "Par Ingrid Bayot" },
      { date: "Octobre 2020", title: "LE SOMMEIL DU TOUT-PETIT (0-2 ANS)", formateur: "Par Ingrid Bayot - Accompagnement parental" },
      { date: "Août 2020", title: "LES NAISSANCES DANS L'EAU", formateur: "Par Beti Flores - Sage-femme mexicaine certifiée Water Birth International" },
      { date: "Août 2020", title: "LA MÉDECINE PLACENTAIRE", formateur: "Par Yael Flauder - Assistante sage-femme au Mexique" },
      { date: "Juillet 2020", title: "APPROCHE GLOBALE PARENTALITÉ, PÉRINATALITÉ, ALLAITEMENT", formateur: "Par Ingrid Bayot" },
    ],
    "2019": [
      { date: "Novembre 2019", title: "SIPED DES DOULAS DE FRANCE", formateur: "Session d'information positionnement éthique Doula DDF" },
      { date: "Octobre 2019", title: "SÉMINAIRE PARANAMA DOULA", formateur: "Physiologie de la naissance - Par Michel Odent et Liliana Lammers" },
    ]
  };

  const toggleYear = (year: FormationYear) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
    }
  };

  return (
    <>
      <Helmet>
        <title>À propos - Je Suis Radieuse | Mon parcours et philosophie</title>
        <meta name="description" content="Doula certifiée avec 5 ans d'expérience à Paris. Découvrez mon parcours, ma formation et ma philosophie d'accompagnement bienveillant." />
        <meta name="keywords" content="doula Paris expérience, formation doula certifiée, accompagnement maternité bienveillant" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section - Image changée */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="font-poppins text-4xl md:text-5xl font-bold text-purple-900 mb-6">
                À propos de moi
              </h1>
              <p className="font-inter text-lg text-gray-700 mb-8 leading-relaxed">
                Bonjour, je suis <strong>Emilie</strong>, doula passionnée par l'accompagnement 
                des femmes dans leur parcours de maternité. Depuis 5 ans, j'ai le privilège 
                de partager ces moments uniques et précieux avec les familles.
              </p>
              
              <p className="font-inter text-lg text-gray-700 mb-8 leading-relaxed">
                Formée par des professionnelles reconnues au Québec, je vous offre 
                un accompagnement bienveillant basé sur des techniques traditionnelles et modernes. 
                Mon approche respecte vos choix et s'adapte à vos besoins spécifiques.
              </p>
              
              <Link
                to="/planning"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 rounded-full font-poppins font-semibold text-lg inline-flex items-center space-x-2 transition-all hover:shadow-xl hover:scale-105"
              >
                <Calendar className="h-5 w-5" />
                <span>Prendre un 1er RDV gratuit</span>
              </Link>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/me.png" // Image changée ici
                  alt="Emilie - Doula certifiée"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Heart className="h-12 w-12 text-pink-500" />
              </div>
            </div>
          </div>

          {/* Stats - inchangé */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-purple-700 mb-2 font-poppins">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-inter">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Values - inchangé */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-4">
                Mes valeurs
              </h2>
              <p className="font-inter text-lg text-gray-600">
                Les principes qui guident mon accompagnement au quotidien
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <IconComponent className="h-8 w-8 text-purple-700" />
                    </div>
                    <h3 className="font-poppins text-lg font-semibold text-purple-900 text-center mb-3">
                      {value.title}
                    </h3>
                    <p className="font-inter text-gray-600 text-center text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formation - Section améliorée */}
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h2 className="font-poppins text-3xl font-bold text-purple-900 mb-6 flex items-center">
                  <Award className="h-8 w-8 mr-3 text-purple-600" />
                  Formation & Certifications
                </h2>
                
                <p className="font-inter text-gray-700 mb-6 leading-relaxed">
                  Je vous rappelle que le métier n'est pas réglementé en France, ainsi il n'existe 
                  aucune formation officielle de Doula. J'ai été formée par des professionnelles 
                  reconnues et je continue à me former régulièrement pour vous offrir le meilleur accompagnement.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 shadow-sm border border-purple-100">
                  <h3 className="font-semibold text-purple-900 mb-3 text-lg">Formation principale</h3>
                  <div className="text-sm text-purple-800 bg-white p-4 rounded-lg">
                    <div className="font-bold mb-1">Décembre 2019 – Février 2020</div>
                    <p className="mb-2">Formation d'Accompagnante à la Naissance et Perfectionnement en Périnatalité</p>
                    <p className="text-purple-600 italic">Par Diane Boutin - Naturopathe, sage-femme traditionnelle, Doula au Québec depuis plus de 30 ans</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-3xl overflow-hidden shadow-lg">
                  <img 
                    src="/me-1.png" // Deuxième image changée ici
                    alt="Formation professionnelle doula"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Detailed Training List - Améliorée avec accordéon */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="text-center mb-10">
                <h3 className="font-poppins text-2xl md:text-3xl font-bold text-purple-900 mb-3">
                  Formations Continues
                </h3>
                <p className="font-inter text-gray-600 italic">
                  Mise à jour février 2022 • Un engagement constant envers l'excellence
                </p>
                {(Object.keys(formationsByYear) as FormationYear[])
                  .sort((a, b) => Number(b) - Number(a)) // Tri décroissant par année
                  .map((year) => (
                    <div key={year} className="border border-purple-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <button
                        onClick={() => toggleYear(year)}
                        className="w-full flex justify-between items-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <h4 className="font-poppins text-lg md:text-xl font-semibold text-purple-900 text-left">
                          Formations {year} 
                          <span className="text-purple-600 text-sm font-normal ml-3">
                            ({formationsByYear[year].length} formation{formationsByYear[year].length > 1 ? 's' : ''})
                          </span>
                        </h4>
                        {expandedYear === year ? (
                          <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedYear === year && (
                        <div className="p-4 md:p-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formationsByYear[year].map((formation, index) => (
                              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 hover:shadow-md transition-shadow border border-purple-100">
                                <div className="text-xs font-semibold text-purple-700 mb-2 tracking-wide uppercase">
                                  {formation.date}
                                </div>
                                <h4 className="font-medium text-gray-900 mb-3 text-base leading-tight">
                                  {formation.title}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {formation.formateur}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Philosophy - inchangé */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="font-poppins text-3xl font-bold mb-6">
              Ma philosophie
            </h2>
            <p className="font-inter text-lg leading-relaxed max-w-4xl mx-auto mb-8 opacity-90">
              Je crois profondément que chaque femme porte en elle la sagesse nécessaire 
              pour vivre sa maternité. Mon rôle n'est pas de vous dire quoi faire, 
              mais de vous accompagner pour que vous puissiez faire confiance à votre 
              instinct et prendre les décisions qui vous correspondent.
            </p>
            
            <p className="font-inter text-lg leading-relaxed max-w-4xl mx-auto opacity-90">
              L'accouchement et la maternité sont des expériences transformatrices. 
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
