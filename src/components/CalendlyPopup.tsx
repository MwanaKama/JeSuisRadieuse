import React from 'react';
import { Calendar, X } from 'lucide-react';

interface CalendlyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyPopup: React.FC<CalendlyPopupProps> = ({ isOpen, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h2 className="font-poppins text-xl font-bold text-purple-900">
                Réserver un rendez-vous
              </h2>
              <p className="text-sm text-gray-600">Premier RDV gratuit - 30 minutes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Calendly Embed */}
        <div className="h-[600px]">
          <iframe
            src="https://calendly.com/jesuisradieuse/rencontredoula?embed_domain=localhost&embed_type=Inline&hide_gdpr_banner=1"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Calendrier de réservation"
            style={{ border: 'none', minHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendlyPopup;