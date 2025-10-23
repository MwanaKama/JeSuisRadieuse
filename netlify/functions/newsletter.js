const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Veuillez fournir une adresse email valide.' })
      };
    }

    // API key from Netlify environment variables (set in dashboard)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
      console.error('Brevo API key not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Configuration serveur manquante' })
      };
    }

    const data = {
      email: email,
      listIds: [7], // Replace with your actual list ID
      updateEnabled: true,
    };

    const response = await axios.post('https://api.brevo.com/v3/contacts', data, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });

    if (response.status === 201) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '✅ Inscription réussie ! Merci de vous être abonné à notre newsletter.' })
      };
    } else if (response.status === 204) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '✅ Vous êtes déjà inscrit à notre newsletter. Merci !' })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Échec de l\'inscription' })
      };
    }

  } catch (error) {
    console.error('Brevo API error:', error.response?.data);
    
    if (error.response?.status === 400) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Adresse email invalide' })
      };
    } else if (error.response?.status === 409) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '✅ Cet email est déjà inscrit à notre newsletter. Merci !' })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur interne du serveur' })
    };
  }
};
