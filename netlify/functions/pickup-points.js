import { badRequest, getQuery, ok, serverError } from './_lib/http.js';

export async function handler(event) {
  try {
    const query = getQuery(event);
    const carrier = query.carrier;

    if (carrier !== 'mondialrelay') {
      return badRequest('Seul Mondial Relay est disponible pour les points relais.');
    }

    const postalCode = query.postalCode || '';
    const country = query.country || 'FR';
    const address = query.address || '';
    const limitRaw = Number(query.limit || 15);
    const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : 15, 10), 30);

    if (postalCode.length < 3) {
      return badRequest('Code postal invalide.');
    }

    const cityByPostalPrefix = {
      '75': 'Paris',
      '69': 'Lyon',
      '13': 'Marseille',
      '33': 'Bordeaux',
      '59': 'Lille',
      '31': 'Toulouse'
    };

    const prefix = String(postalCode).slice(0, 2);
    const city = cityByPostalPrefix[prefix] || 'Ville proche';

    const centerByCity = {
      Paris: { latitude: 48.8566, longitude: 2.3522 },
      Lyon: { latitude: 45.764, longitude: 4.8357 },
      Marseille: { latitude: 43.2965, longitude: 5.3698 },
      Bordeaux: { latitude: 44.8378, longitude: -0.5792 },
      Lille: { latitude: 50.6292, longitude: 3.0573 },
      Toulouse: { latitude: 43.6047, longitude: 1.4442 },
      'Ville proche': { latitude: 48.8566, longitude: 2.3522 }
    };

    const base = centerByCity[city] || centerByCity['Ville proche'];

    const streetPool = [
      'Rue Centrale',
      'Avenue de la Gare',
      'Boulevard Victor Hugo',
      'Rue du Commerce',
      'Rue des Lilas',
      'Rue de la République',
      'Place du Marché',
      'Rue des Ecoles',
      'Rue Pasteur',
      'Avenue Jean Jaurès',
      'Rue de la Paix',
      'Rue Anatole France',
      'Rue Voltaire',
      'Rue Nationale',
      'Rue du Moulin',
      'Rue des Tilleuls',
      'Rue Pierre Curie',
      'Rue de la Liberté',
      'Avenue du Général Leclerc',
      'Rue des Fleurs',
      'Rue des Acacias',
      'Rue Lafayette',
      'Rue des Artisans',
      'Rue de la Mairie',
      'Rue de Verdun',
      'Rue des Peupliers',
      'Rue Berlioz',
      'Avenue Gambetta',
      'Rue Colbert',
      'Rue du Temple'
    ];

    const pickupPoints = Array.from({ length: limit }, (_, index) => {
      const i = index + 1;
      const latitude = Number((base.latitude + (index - limit / 2) * 0.004).toFixed(6));
      const longitude = Number((base.longitude + ((index % 5) - 2) * 0.006).toFixed(6));
      const street = streetPool[index % streetPool.length];
      const number = 4 + ((index * 3) % 47);

      return {
        id: `${postalCode}-MR-${String(i).padStart(3, '0')}`,
        name: `Point Relais ${city} ${i}`,
        address: `${number} ${street}${address ? ` (proche de ${address})` : ''}`,
        postalCode,
        city,
        country,
        latitude,
        longitude
      };
    });

    return ok({ pickupPoints });
  } catch (error) {
    return serverError(error, 'Impossible de charger les points relais.');
  }
}
