import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | Je Suis Radieuse - Doula Paris</title>
        <meta name="description" content="Politique de confidentialité de Je Suis Radieuse. Découvrez comment nous protégeons et utilisons vos données personnelles." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-8 text-center">
              Politique de Confidentialité
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-sm text-gray-500 mb-8">En vigueur au 17/09/2025</p>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Introduction
                  </h2>
                </div>
                <p>
                  Chez Je Suis Radieuse, nous accordons une grande importance à la protection de vos données personnelles et au respect de votre vie privée.
                  Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Données collectées
                  </h2>
                </div>
                <p>Nous collectons les données suivantes :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Identité (nom, prénom)</li>
                  <li>Coordonnées (email)</li>
                  <li>Informations relatives à votre grossesse et postnatal</li>
                  <li>Historique des rendez-vous et accompagnements</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Lock className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Finalités du traitement
                  </h2>
                </div>
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Gérer vos rendez-vous et accompagnements</li>
                  <li>Vous envoyer des informations relatives à nos services</li>
                  <li>Personnaliser votre expérience selon vos besoins</li>
                  <li>Améliorer la qualité de nos services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Durée de conservation
                </h2>
                <p>Vos données sont conservées :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Données clients : 3 ans après le dernier contact</li>
                  <li>Données comptables : 10 ans comme l'exige la loi</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <UserCheck className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Vos droits
                  </h2>
                </div>
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement (droit à l'oubli)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : mamanradieuse@gmail.com
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Transfert de données
                </h2>
                <p>
                  Vos données sont stockées chez des hébergeurs européens. Aucun transfert en dehors de l'Union Européenne n'est effectué 
                  sans votre consentement explicite et sans garanties appropriées de protection des données.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolitiqueConfidentialite;