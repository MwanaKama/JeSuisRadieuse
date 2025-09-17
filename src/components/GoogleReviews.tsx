import React from 'react';
import { Star, Quote } from 'lucide-react';

const GoogleReviews = () => {
  // Ces avis seraient normalement récupérés via l'API Google Places
  const reviews = [
    {
      id: 1,
      author: 'Marie L.',
      rating: 5,
      date: 'Il y a 2 semaines',
      text: 'Un accompagnement exceptionnel ! [Nom] a su me rassurer et me donner confiance tout au long de ma grossesse. Sa bienveillance et ses conseils m\'ont énormément aidée.',
      verified: true
    },
    {
      id: 2,
      author: 'Sophie M.',
      rating: 5,
      date: 'Il y a 1 mois',
      text: 'Je recommande vivement ! Le soutien post-partum a été précieux, surtout pour l\'allaitement. Merci pour cette écoute attentive et ces conseils pratiques.',
      verified: true
    },
    {
      id: 3,
      author: 'Caroline D.',
      rating: 5,
      date: 'Il y a 2 mois',
      text: 'Une doula formidable ! Disponible, à l\'écoute et très professionnelle. Elle m\'a accompagnée avec douceur dans cette belle aventure qu\'est la maternité.',
      verified: true
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Google Reviews Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-medium text-gray-900">Avis Google</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({reviews.length} avis)</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-purple-900">{review.author}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              {review.verified && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Vérifié
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="relative">
              <Quote className="h-6 w-6 text-purple-200 absolute -top-2 -left-1" />
              <p className="font-inter text-gray-700 pl-6 leading-relaxed text-sm">
                {review.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Reviews Integration Notice */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          * Pour intégrer les vrais avis Google, vous devrez configurer l'API Google Places 
          dans le composant GoogleReviews avec votre Place ID.
        </p>
      </div>
    </div>
  );
};

export default GoogleReviews;