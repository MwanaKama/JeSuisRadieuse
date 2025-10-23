import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Clock, Calendar, Heart, CreditCard, Scale, Handshake } from 'lucide-react';

const ConditionsGenerales: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Je Suis Radieuse | Conditions Générales</title>
        <meta name="description" content="Conditions générales de vente de Je Suis Radieuse. Informations sur les prestations, modalités de réservation et d'annulation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 lg:p-12">
            <h1 className="font-poppins text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900 mb-6 md:mb-8 text-center">
              Conditions Générales de Vente
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 text-center">En vigueur au 17/09/2025</p>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 1 - Objet
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  Les présentes conditions générales de vente régissent les relations contractuelles entre Je Suis Radieuse, 
                  entreprise individuelle immatriculée au SIRET 90846479500016, et ses clientes, dans le cadre de la prestation 
                  d'accompagnement périnatal non médical.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Heart className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 2 - Prestations
                  </h2>
                </div>
                <p className="text-sm md:text-base">Je Suis Radieuse propose les prestations suivantes :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-2 md:space-y-3 text-sm md:text-base">
                  <li>
                    <strong>Accompagnement prénatal</strong>
                    <ul className="list-circle pl-5 mt-1 md:mt-2 text-sm">
                      <li>Préparation à la naissance</li>
                      <li>Élaboration du projet de naissance</li>
                      <li>Soutien émotionnel pendant la grossesse</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Soutien postnatal</strong>
                    <ul className="list-circle pl-5 mt-1 md:mt-2 text-sm">
                      <li>Accompagnement après l'accouchement</li>
                      <li>Soutien à l'allaitement</li>
                      <li>Conseils pour le bien-être de la mère et du bébé</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Soins traditionnels</strong>
                    <ul className="list-circle pl-5 mt-1 md:mt-2 text-sm">
                      <li>Massage Rebozo - 90€ (1h30)</li>
                      <li>Yoni Steam - 60€ (60 min)</li>
                    </ul>
                  </li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 3 - Modalités de réservation
                  </h2>
                </div>
                <p className="text-sm md:text-base">La réservation s'effectue selon les modalités suivantes :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Premier rendez-vous découverte gratuit sans engagement</li>
                  <li>Paiement à la séance ou selon le service choisi</li>
                  <li>Aucun acompte n'est demandé</li>
                  <li>Moyens de paiement acceptés : carte bancaire, virement, espèces</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 4 - Annulation et report
                  </h2>
                </div>
                <p className="text-sm md:text-base">Les conditions d'annulation et de report sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-2 md:mt-3 space-y-1 md:space-y-2 text-sm md:text-base">
                  <li>Annulation sans frais jusqu'à 48h avant le rendez-vous</li>
                  <li>Annulation entre 48h et 24h avant : 50% de frais</li>
                  <li>Annulation moins de 24h avant : 100% de frais</li>
                  <li>Report possible sans frais selon disponibilité</li>
                </ul>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 5 - Paiement
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  Le paiement s'effectue à la séance, sauf pour les forfaits qui peuvent faire l'objet d'un échelonnement.
                  Aucun remboursement n'est possible pour les séances déjà effectuées. Les forfaits sont valables 6 mois à partir de la date d'achat.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Scale className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 6 - Propriété intellectuelle
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  Les documents, supports et techniques remis lors des accompagnements restent la propriété intellectuelle exclusive 
                  de Je Suis Radieuse. Ils sont fournis à titre personnel et ne peuvent être reproduits, diffusés ou utilisés à des fins 
                  commerciales sans autorisation écrite préalable.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  Article 7 - Responsabilités
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Je Suis Radieuse propose un accompagnement non médical, non thérapeutique, à visée de soutien émotionnel et physique. 
                  Les prestations ne se substituent en aucun cas au suivi médical conventionnel par un professionnel de santé.
                </p>
                <p className="text-sm md:text-base leading-relaxed mt-2 md:mt-3">
                  La cliente s'engage à fournir des informations exactes sur son état de santé et à informer Je Suis Radieuse 
                  de tout changement pouvant affecter le déroulement des séances.
                </p>
              </section>

              <section className="mb-6 md:mb-8">
                <div className="flex items-center mb-3 md:mb-4">
                  <Handshake className="h-6 w-6 md:h-8 md:w-8 text-pink-500 mr-2 md:mr-3" />
                  <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800">
                    Article 8 - Litiges
                  </h2>
                </div>
                <p className="text-sm md:text-base leading-relaxed">
                  En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.
                  À défaut de résolution amiable, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-xl md:text-2xl font-semibold text-purple-800 mb-3 md:mb-4">
                  Article 9 - Acceptation des conditions
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  La réservation d'une prestation implique l'acceptation sans réserve des présentes conditions générales de vente.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConditionsGenerales;
