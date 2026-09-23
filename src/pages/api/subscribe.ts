import type { APIContext } from 'astro';

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.GOOGLE_APPS_SCRIPT_URL;

export async function POST({ request }: APIContext) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // 1. Send as raw stringified JSON to match JSON.parse(e.postData.contents)
    let response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // Using text/plain safely bypasses preflight checks
      body: JSON.stringify({ name, email }),
      redirect: "manual"
    });

    // 2. Follow Google's 302 landing execution redirect to read the true script result
    if (response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.get("location");
      if (redirectUrl) {
        response = await fetch(redirectUrl, { method: "GET" });
      }
    }

    const result = await response.json();

    // 3. Prevent false positives! If Google caught an internal error, reject it here
    if (result.error) {
      console.error("🔴 Google Script executed but returned an error:", result.error);
      return new Response(JSON.stringify({ error: result.error }), { status: 400 });
    }

    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error: any) {
    console.error("Subscription proxy error:", error);
    return new Response(JSON.stringify({ error: "Failed to submit email" }), { status: 500 });
  }
}
