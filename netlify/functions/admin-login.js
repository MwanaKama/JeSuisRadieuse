import { issueAdminToken, validateAdminCredentials } from './_lib/auth.js';
import { badRequest, ok, parseBody, serverError, unauthorized } from './_lib/http.js';

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return badRequest('Methode non autorisee.');
    }

    const body = parseBody(event);
    const email = (body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!email || !password) {
      return badRequest('Email et mot de passe requis.');
    }

    if (!validateAdminCredentials(email, password)) {
      return unauthorized('Identifiants invalides.');
    }

    const token = issueAdminToken(email);
    return ok({ token });
  } catch (error) {
    return serverError(error, 'Connexion admin impossible.');
  }
}
