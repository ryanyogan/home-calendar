import { HandlerContext, HandlerEvent } from "@netlify/functions";

const { GOOGLE_API_KEY, GOOGLE_CAL_ID } = process.env;

if (typeof GOOGLE_API_KEY !== "string" || typeof GOOGLE_CAL_ID !== "string") {
  throw new Error("ENV variables not configured properly");
}

const BASE_PARAMS = `orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;
const BASE_URL = `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CAL_ID}/events?${BASE_PARAMS}`;

const headers = {
  "Content-Type": "application/json",
};

async function handler(event: HandlerEvent, context: HandlerContext) {
  const { queryStringParameters } = event;
  const finalURL = `${BASE_URL}${
    queryStringParameters?.maxResults
      ? `&maxResults=${queryStringParameters?.maxResults}`
      : ""
  }&key=${GOOGLE_API_KEY}`;

  try {
    if (event.httpMethod === "GET") {
      return fetch(finalURL)
        .then((response) => response.json())
        .then((data) => ({
          statusCode: 200,
          headers,
          body: JSON.stringify(data.items, null, 2),
        }));
    }

    return {
      statusCode: 401,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: error.toString(),
    };
  }
}

export { handler };
