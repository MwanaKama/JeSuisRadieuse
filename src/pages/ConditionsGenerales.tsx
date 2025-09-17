import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Clock, Calendar, Heart } from 'lucide-react';

const ConditionsGenerales: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales | Je Suis Radieuse - Doula Paris</title>
        <meta name="description" content="Conditions générales de vente de Je Suis Radieuse. Informations sur les prestations, modalités de réservation et d'annulation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-purple-900 mb-8 text-center">
              Conditions Générales de Vente
            </h1>
            
            <div className="prose prose-purple max-w-none">
              <p className="text-sm text-gray-500 mb-8">En vigueur au 17/09/2025</p>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Article 1 - Objet
                  </h2>
                </div>
                <p>
                  Les présentes conditions générales de vente régissent les relations contractuelles entre Je Suis Radieuse, 
                  entreprise individuelle immatriculée au SIRET 90846479500016, et ses clientes, dans le cadre de la prestation 
                  d'accompagnement périnatal non médical.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Article 2 - Prestations
                  </h2>
                </div>
                <p>Je Suis Radieuse propose les prestations suivantes :</p>
                <ul className="list-disc pl-5 mt-3 space-y-3">
                  <li>
                    <strong>Accompagnement prénatal</strong>
                
                  </li>
                  <li>
                    <strong>Soutien postnatal</strong>
                
                  </li>
                  <li>
                    <strong>Soins traditionnels</strong>
                    <ul className="list-circle pl-5 mt-2 text-sm">
                    
                    </ul>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Article 3 - Modalités de réservation
                  </h2>
                </div>
                <p>La réservation s'effectue selon les modalités suivantes :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Premier rendez-vous découverte gratuit sans engagement</li>
                  <li>Paiement à la séance ou selon le service choisi</li>
                  <li>Aucun acompte n'est demandé</li>
                  <li>Moyens de paiement acceptés : carte bancaire, virement, espèces</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="font-poppins text-2xl font-semibold text-purple-800">
                    Article 4 - Annulation et report
                  </h2>
                </div>
                <p>Les conditions d'annulation et de report sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Annulation sans frais jusqu'à 48h avant le rendez-vous</li>
                  <li>Annulation entre 48h et 24h avant : 50% de frais</li>
                  <li>Annulation moins de 24h avant : 100% de frais</li>
                  <li>Report possible sans frais selon disponibilité</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Article 5 - Propriété intellectuelle
                </h2>
                <p>
                  Les documents, supports et techniques remis lors des accompagnements restent la propriété intellectuelle exclusive 
                  de Je Suis Radieuse. Ils sont fournis à titre personnel et ne peuvent être reproduits, diffusés ou utilisés à des fins 
                  commerciales sans autorisation écrite préalable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Article 6 - Responsabilités
                </h2>
                <p>
                  Je Suis Radieuse propose un accompagnement non médical, non thérapeutique, à visée de soutien émotionnel et physique. 
                  Les prestations ne se substituent en aucun cas au suivi médical conventionnel par un professionnel de santé.
                </p>
                <p className="mt-4">
                  La cliente s'engage à fournir des informations exactes sur son état de santé et à informer Je Suis Radieuse 
                  de tout changement pouvant affecter le déroulement des séances.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Article 7 - Litiges
                </h2>
                <p>
                  En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.
                  À défaut de résolution amiable, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="font-poppins text-2xl font-semibold text-purple-800 mb-4">
                  Article 8 - Acceptation des conditions
                </h2>
                <p>
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