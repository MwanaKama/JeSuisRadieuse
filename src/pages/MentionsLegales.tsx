import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';

const MentionsLegales: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | Je Suis Radieuse - Doula Paris</title>
        <meta name="description" content="Mentions légales de Je Suis Radieuse, doula à Paris. Informations sur l'éditeur du site et propriété intellectuelle." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-8 text-center">
              Mentions Légales
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-sm text-gray-500 mb-8">En vigueur au 17/09/2025</p>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  1. Informations légales
                </h2>
                <div className="space-y-3">
                  <p><strong>Éditeur du site :</strong> Je Suis Radieuse</p>
                  <p><strong>Forme juridique :</strong> Entreprise Individuelle</p>
                  <p><strong>Numéro SIRET :</strong> 90846479500016</p>
                  <p><strong>Non assujettie à la TVA</strong> (article 293 B du CGI)</p>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-pink-500" />
                    <span>mamanradieuse@gmail.com</span>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  2. Propriété intellectuelle
                </h2>
                <p>
                  L'ensemble des éléments constituant le site jesuisradieuse.com (textes, images, vidéos, logo, charte graphique, etc.) 
                  sont la propriété exclusive de Je Suis Radieuse, sauf mention contraire. Toute reproduction, représentation, adaptation 
                  ou modification, en tout ou partie, par quelque procédé que ce soit, sans l'autorisation préalable de Je Suis Radieuse, 
                  est strictement interdite et constituerait une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  3. Limitations de responsabilité
                </h2>
                <p>
                  Je Suis Radieuse s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site. 
                  Cependant, Je Suis Radieuse ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises 
                  à disposition sur ce site.
                </p>
                <p className="mt-4">
                  Les accompagnements proposés par Je Suis Radieuse sont des accompagnements non médicaux, à visée de soutien émotionnel 
                  et physique. Ils ne se substituent en aucun cas au suivi médical conventionnel par un professionnel de santé.
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  4. Médiation
                </h2>
                <p>
                  Conformément aux articles L.611-1 et R.612-1 et suivants du Code de la consommation, tout consommateur a le droit 
                  de recourir gratuitement à un médiateur de la consommation pour le règlement amiable du litige qui l'oppose à un professionnel.
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