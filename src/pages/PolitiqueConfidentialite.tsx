import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye, UserCheck, Mail, Calendar, Database } from 'lucide-react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Politique de Confidentialité</title>
        <meta name="description" content="Politique de confidentialité de Je Suis Radieuse. Découvrez comment nous protégeons et utilisons vos données personnelles." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 lg:p-12">
            <h1 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900 mb-6 md:mb-8 text-center">
              Politique de Confidentialité
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 text-center">En vigueur au 17/09/2025</p>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Introduction
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  Chez Je Suis Radieuse, nous accordons une grande importance à la protection de vos données personnelles et au respect de votre vie privée.
                  Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Eye className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Données collectées
                  </h2>
                </div>
                <p className="text-sm md:text-base">Nous collectons les données suivantes :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Identité (nom, prénom)</li>
                  <li>Coordonnées (email, téléphone)</li>
                  <li>Informations relatives à votre grossesse et postnatal</li>
                  <li>Historique des rendez-vous et accompagnements</li>
                  <li>Préférences de communication</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Lock className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Finalités du traitement
                  </h2>
                </div>
                <p className="text-sm md:text-base">Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Gérer vos rendez-vous et accompagnements</li>
                  <li>Vous envoyer des informations relatives à nos services</li>
                  <li>Personnaliser votre expérience selon vos besoins</li>
                  <li>Améliorer la qualité de nos services</li>
                  <li>Remplir nos obligations légales et réglementaires</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Durée de conservation
                  </h2>
                </div>
                <p className="text-sm md:text-base">Vos données sont conservées :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Données clients : 3 ans après le dernier contact</li>
                  <li>Données comptables : 10 ans comme l'exige la loi</li>
                  <li>Données de santé : 20 ans après la dernière consultation</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Database className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Bases légales du traitement
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  Le traitement de vos données est basé sur :
                </p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Votre consentement pour les communications marketing</li>
                  <li>L'exécution d'un contrat pour la fourniture de nos services</li>
                  <li>Notre obligation légale pour les données comptables</li>
                  <li>Notre intérêt légitime pour améliorer nos services</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Vos droits
                  </h2>
                </div>
                <p className="text-sm md:text-base">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement (droit à l'oubli)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit d'opposition au traitement</li>
                  <li>Droit à la portabilité de vos données</li>
                </ul>
                <div className="mt-3 md:mt-4 p-3 md:p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                    <span className="text-sm md:text-base">
                      Pour exercer ces droits, contactez-nous à : <strong>mamanradieuse@gmail.com</strong>
                    </span>
                  </div>
                </div>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  Transfert de données
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Vos données sont stockées chez des hébergeurs européens. Aucun transfert en dehors de l'Union Européenne n'est effectué 
                  sans votre consentement explicite et sans garanties appropriées de protection des données.
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  Modifications de la politique
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications prendront effet 
                  dès leur publication sur notre site. Nous vous encourageons à consulter régulièrement cette page pour rester informé.
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
