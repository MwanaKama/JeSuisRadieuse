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

    if (postalCode.length < 3) {
      return badRequest('Code postal invalide.');
    }

    const pickupPoints = [
      {
        id: `${postalCode}-MR-001`,
        name: 'Relais Centre Ville',
        address: '10 Rue Centrale',
        postalCode,
        city: 'Paris',
        country
      },
      {
        id: `${postalCode}-MR-002`,
        name: 'Relais Gare',
        address: '5 Place de la Gare',
        postalCode,
        city: 'Paris',
        country
      }
    ];

    return ok({ pickupPoints });
  } catch (error) {
    return serverError(error, 'Impossible de charger les points relais.');
  }
}
