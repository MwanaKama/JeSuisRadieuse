export function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };
}

export function ok(payload) {
  return json(200, payload);
}

export function badRequest(message) {
  return json(400, { message });
}

export function unauthorized(message = 'Acces non autorise.') {
  return json(401, { message });
}

export function serverError(error, fallback = 'Erreur serveur.') {
  return json(500, {
    message: fallback,
    details: process.env.NODE_ENV === 'development' ? String(error?.message || error) : undefined
  });
}

export function parseBody(event) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    throw new Error('Corps de requete invalide.');
  }
}

export function getQuery(event) {
  return event.queryStringParameters || {};
}
