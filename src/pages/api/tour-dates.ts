// src/pages/api/tour-dates.js

const SHEET_JSON_URL = "https://opensheet.elk.sh/1g9ibRzcu9TXgX9qKX2w3-FpbCaJGJrj3Omd1nZCRZuU/Schedule";

const mockTourDates = [
  { date: "Sep 26", venue: "Cherry Street Tavern", city: "Chattanooga, TN", ticketLink: "#" },
  { date: "Oct 10", venue: "40 Watt Club", city: "Athens, GA", ticketLink: "#" },
  { date: "Oct 24", venue: "The Blue Room", city: "Nashville, TN", ticketLink: "#" }
];

export async function GET() {
  try {
    const response = await fetch(SHEET_JSON_URL);

    // Check if the external response is HTML instead of JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || (contentType && contentType.includes("text/html"))) {
      throw new Error("External sheet service returned an error or HTML page.");
    }
    
    const tourDates = await response.json();
    
    return new Response(JSON.stringify(tourDates), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error loading tour dates, using mock data:", error);

    // Return fallback mock data so things don't break catastrophically
    return new Response(JSON.stringify(mockTourDates), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
