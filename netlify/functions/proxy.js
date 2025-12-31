const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get the Google Apps Script URL from environment variables
  const GOOGLE_SCRIPT_URL = process.env.VITE_APPS_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'VITE_APPS_SCRIPT_URL not set in environment' })
    };
  }

  try {
    const { httpMethod, queryStringParameters, body } = event;
    
    // Construct the target URL with query parameters
    const queryString = new URLSearchParams(queryStringParameters).toString();
    const targetUrl = `${GOOGLE_SCRIPT_URL}${queryString ? '?' + queryString : ''}`;

    // Prepare fetch options
    const options = {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = body;
    }

    // Forward request to Google Apps Script
    const response = await fetch(targetUrl, options);
    
    if (!response.ok) {
        // Try to read error body if possible
        const errText = await response.text();
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: `Upstream error: ${response.status}`, details: errText })
        };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins for the proxy response
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request', details: error.message })
    };
  }
};
