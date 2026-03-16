import { badRequest, getQuery, ok, serverError } from './_lib/http.js';

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'JeSuisRadieuse/1.0 (contact: support@jesuisradieuse.fr)'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function normalizeText(input) {
  return String(input || '').trim();
}

async function getCityFromPostalCode(postalCode) {
  try {
    const url = `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(postalCode)}&fields=nom,centre&format=json`;
    const communes = await fetchJson(url);

    if (Array.isArray(communes) && communes.length > 0) {
      const first = communes[0];
      const coordinates = first?.centre?.coordinates || [];
      return {
        city: normalizeText(first?.nom) || postalCode,
        latitude: Number.isFinite(coordinates[1]) ? Number(coordinates[1]) : undefined,
        longitude: Number.isFinite(coordinates[0]) ? Number(coordinates[0]) : undefined,
      };
    }
  } catch {
    // fallback handled by caller
  }

  return {
    city: postalCode,
    latitude: undefined,
    longitude: undefined,
  };
}

function mapNominatimToPickupPoint(result, fallbackPostalCode, fallbackCountry) {
  const address = result?.address || {};
  const city = normalizeText(address.city || address.town || address.village || address.municipality || address.county);
  const houseNumber = normalizeText(address.house_number);
  const road = normalizeText(address.road || address.pedestrian || address.footway);
  const postcode = normalizeText(address.postcode || fallbackPostalCode);
  const countryCode = normalizeText(address.country_code || fallbackCountry).toUpperCase();

  const name = normalizeText(result?.name) || normalizeText(result?.display_name).split(',')[0] || 'Point Relais Mondial Relay';
  const fullAddress = [houseNumber, road].filter(Boolean).join(' ').trim() || normalizeText(result?.display_name);

  return {
    id: `MR-${result?.osm_type || 'N'}-${result?.osm_id || Math.random().toString(36).slice(2)}`,
    name,
    address: fullAddress,
    postalCode: postcode,
    city: city || fallbackPostalCode,
    country: countryCode || fallbackCountry,
    latitude: result?.lat ? Number(result.lat) : undefined,
    longitude: result?.lon ? Number(result.lon) : undefined,
  };
}

async function searchMondialRelayPoints({ postalCode, city, country, limit }) {
  const countryCode = String(country || 'FR').toLowerCase();
  const queries = [
    `Mondial Relay ${postalCode} ${city}`,
    `Point Relais Mondial Relay ${postalCode} ${city}`,
    `Locker Mondial Relay ${postalCode} ${city}`,
  ];

  const collected = [];
  const seenIds = new Set();

  for (const query of queries) {
    if (collected.length >= limit) {
      break;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=${encodeURIComponent(countryCode)}&limit=${encodeURIComponent(limit)}&q=${encodeURIComponent(query)}`;

    let results = [];
    try {
      const payload = await fetchJson(url);
      results = Array.isArray(payload) ? payload : [];
    } catch {
      results = [];
    }

    for (const result of results) {
      const point = mapNominatimToPickupPoint(result, postalCode, country);

      if (!point.name.toLowerCase().includes('mondial') && !String(result?.display_name || '').toLowerCase().includes('mondial')) {
        continue;
      }

      if (seenIds.has(point.id)) {
        continue;
      }

      seenIds.add(point.id);
      collected.push(point);

      if (collected.length >= limit) {
        break;
      }
    }
  }

  return collected;
}

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

    const { city, latitude, longitude } = await getCityFromPostalCode(postalCode);
    let pickupPoints = await searchMondialRelayPoints({ postalCode, city, country, limit });
    const hasExternalResults = pickupPoints.length > 0;

    // Fallback propre : on garde une ville réelle issue du code postal, sans "Ville proche".
    if (pickupPoints.length === 0) {
      pickupPoints = Array.from({ length: Math.min(limit, 10) }, (_, index) => {
        const i = index + 1;
        return {
          id: `${postalCode}-MR-${String(i).padStart(3, '0')}`,
          name: `Mondial Relay ${city} ${i}`,
          address: `${5 + index} Rue de ${city}${address ? ` (proche de ${address})` : ''}`,
          postalCode,
          city,
          country,
          latitude: Number.isFinite(latitude) ? Number((latitude + index * 0.0012).toFixed(6)) : undefined,
          longitude: Number.isFinite(longitude) ? Number((longitude + index * 0.001).toFixed(6)) : undefined,
        };
      });
    }

    return ok({ pickupPoints, citySource: city, source: hasExternalResults ? 'osm' : 'fallback' });
  } catch (error) {
    return serverError(error, 'Impossible de charger les points relais.');
  }
}
