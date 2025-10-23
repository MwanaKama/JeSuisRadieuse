import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageCircle, Calendar } from 'lucide-react';

interface ContactFormProps {
  service?: {
    id: string;
    name: string;
    duration: string;
    price: string;
  };
  selectedDate?: Date | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ service, selectedDate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ici vous intégreriez avec:
    // 1. Google Calendar API pour créer l'événement
    // 2. Votre système d'email
    // 3. Votre base de données

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Création d'événement Google Calendar (à implémenter)
      if (selectedDate && service) {
        await createGoogleCalendarEvent({
          summary: `${service.name} - ${formData.firstName} ${formData.lastName}`,
          start: selectedDate,
          description: `Service: ${service.name}\nDurée: ${service.duration}\nClient: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nMessage: ${formData.message}`,
          attendees: [formData.email]
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction à implémenter pour Google Calendar
  const createGoogleCalendarEvent = async (eventData: any) => {
    // Intégration avec l'API Google Calendar
    console.log('Création d\'événement Google Calendar:', eventData);
    // Cette fonction devrait utiliser l'API Google Calendar
    // avec gapi.client.calendar.events.insert()
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="font-poppins text-2xl font-bold text-purple-900 mb-4">
          Rendez-vous confirmé !
        </h3>
        <p className="font-inter text-gray-700 mb-6">
          Votre rendez-vous a été enregistré avec succès. Vous allez recevoir 
          un email de confirmation avec tous les détails.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
          <p className="font-medium text-purple-900 mb-2">Récapitulatif</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Service:</strong> {service?.name}</p>
            <p><strong>Date:</strong> {selectedDate?.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Durée:</strong> {service?.duration}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service & Date Summary */}
      {service && selectedDate && (
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-purple-900 mb-2">Récapitulatif de votre réservation</h3>
          <div className="text-sm text-purple-700 space-y-1">
            <p><strong>Service:</strong> {service.name}</p>
            <p><strong>Date:</strong> {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Durée:</strong> {service.duration}</p>
            <p><strong>Tarif:</strong> {service.price}</p>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Prénom *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Nom *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="votre@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="06 XX XX XX XX"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          <MessageCircle className="h-4 w-4 inline mr-1" />
          Message (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          placeholder="Partagez-moi vos questions, attentes ou informations importantes pour notre rendez-vous..."
        />
      </div>

      {/* RGPD Consent */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            J'accepte que mes données personnelles soient collectées et traitées 
            dans le cadre de ma demande de rendez-vous. Ces données ne seront pas 
            transmises à des tiers et je peux exercer mes droits d'accès, de 
            rectification et de suppression en contactant [email]. 
            <a href="#" className="text-purple-600 hover:underline">
              En savoir plus sur notre politique de confidentialité
            </a>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!formData.consent || isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-full font-poppins font-semibold text-lg flex items-center justify-center space-x-2 transition-all hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Confirmation en cours...</span>
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span>Confirmer mon rendez-vous</span>
          </>
        )}
      </button>

      {/* Technical Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p>
          <strong>Note technique :</strong> Ce formulaire simule l'envoi. 
          Pour la production, vous devrez configurer :
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>L'API Google Calendar pour la création automatique d'événements</li>
          <li>Un service d'email (SendGrid, Mailgun, etc.)</li>
          <li>Une base de données pour stocker les rendez-vous</li>
          <li>La conformité RGPD complète</li>
        </ul>
      </div>
    </form>
  );
};

export default ContactForm;