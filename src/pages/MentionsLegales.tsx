import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin } from 'lucide-react';

const MentionsLegales: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Mentions Légales</title>
        <meta name="description" content="Mentions légales de Je Suis Radieuse, doula à Paris. Informations sur l'éditeur du site et propriété intellectuelle." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 lg:p-12">
            <h1 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900 mb-6 md:mb-8 text-center">
              Mentions Légales
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 text-center">En vigueur au 17/09/2025</p>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  1. Informations légales
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-base"><strong>Éditeur du site :</strong> Je Suis Radieuse</p>
                  <p className="text-sm md:text-base"><strong>Forme juridique :</strong> Entreprise Individuelle</p>
                  <p className="text-sm md:text-base"><strong>Numéro SIRET :</strong> 90846479500016</p>
                  <p className="text-sm md:text-base"><strong>Non assujettie à la TVA</strong> (article 293 B du CGI)</p>
                  <div className="flex items-center space-x-2 md:space-x-3 pt-2">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                    <span className="text-sm md:text-base">mamanradieuse@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                    <span className="text-sm md:text-base">Paris, France</span>
                  </div>
                </div>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  2. Propriété intellectuelle
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  L'ensemble des éléments constituant le site jesuisradieuse.com (textes, images, vidéos, logo, charte graphique, etc.) 
                  sont la propriété exclusive de Je Suis Radieuse, sauf mention contraire. Toute reproduction, représentation, adaptation 
                  ou modification, en tout ou partie, par quelque procédé que ce soit, sans l'autorisation préalable de Je Suis Radieuse, 
                  est strictement interdite et constituerait une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  3. Limitations de responsabilité
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Je Suis Radieuse s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site. 
                  Cependant, Je Suis Radieuse ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises 
                  à disposition sur ce site.
                </p>
                <p className="text-sm md:text-base leading-relaxed mt-3 md:mt-4">
                  Les accompagnements proposés par Je Suis Radieuse sont des accompagnements non médicaux, non thérapeutiques, à visée de soutien émotionnel 
                  et physique. Ils ne se substituent en aucun cas au suivi médical conventionnel par un professionnel de santé.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  4. Hébergement
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Ce site est hébergé par :
                  <br />
                  <strong>Netlify</strong>
                  <br />
                  2325 3rd Street, Suite 296
                  <br />
                  San Francisco, California 94107
                  <br />
                  États-Unis
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  5. Médiation
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Conformément aux articles L.611-1 et R.612-1 et suivants du Code de la consommation, tout consommateur a le droit 
                  de recourir gratuitement à un médiateur de la consommation pour le règlement amiable du litige qui l'oppose à un professionnel.
                </p>
                <p className="text-sm md:text-base leading-relaxed mt-3 md:mt-4">
                  Le médiateur compétent pour notre activité est :
                  <br />
                  <strong>Médicys</strong>
                  <br />
                  73 Boulevard de Clichy, 75009 Paris
                  <br />
                  Site web : <a href="https://www.medicys.fr" className="text-purple-600 hover:underline">www.medicys.fr</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentionsLegales;
