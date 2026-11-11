
import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly"
];

const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "credentials.json"
);

async function getCalendarEvents() {
  // Authenticate with Google
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });

  // Initialize Google Calendar API
  const calendar = google.calendar({
    version: "v3",
    auth
  });

  // Retrieve upcoming events
  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 20,
    singleEvents: true,
    orderBy: "startTime"
  });

  const events = response.data.items || [];

  console.log("\nYOUR UPCOMING EVENTS\n");

  if (events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }

  events.forEach((event) => {
    const start = event.start.dateTime || event.start.date;
    const end = event.end.dateTime || event.end.date;

    console.log({
      title: event.summary,
      start,
      end,
      location: event.location || "Not specified",
      description: event.description || ""
    });
  });
}

getCalendarEvents().catch(console.error);
