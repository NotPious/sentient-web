# Sentient Newsletter & Automated Email Engine 🚀

A lightweight, high-performance newsletter subscription and broadcast engine built for the **Sentient** platform. This setup captures subscriber details via an **Astro/React** frontend, proxies them through a secure serverless endpoint on **Vercel**, tracks them inside a **Google Sheet** CRM, and instantly fires off automated emails without using expensive third-party marketing platforms.

---

## 🏗️ System Architecture & Data Flow

1. **Frontend (UI):** User submits their Name and Email via the React component (`NewsletterForm.jsx`).
2. **Serverless Proxy:** Astro API Route (`subscribe.ts`) intercepts the request on Vercel to bypass CORS preflight restrictions and safely mask backend URLs.
3. **Google Apps Script (Database & Mail Engine):** The proxy forwards payloads to a Google Apps Script Web App via a `POST` request.
   - Appends user data securely using a structural `LockService` to prevent database race-conditions.
   - Instantly fires a **Welcome Email** with spoof-proof headers tailored to prevent Yahoo/Gmail spam flags.
4. **CRM Admin Menu:** Triggers a custom spreadsheet macro button (`Newsletter Menu`) inside Google Sheets to handle bulk manual broadcasts to unsent subscribers.

---

## 🛠️ Project Repository Tree

```text
├── src/
│   ├── components/
│   │   └── NewsletterForm.jsx  # React UI element with Name/Email capture
│   └── pages/
│       └── api/
│           └── subscribe.ts    # Vercel serverless proxy endpoint
├── .env                        # Local configuration secrets (Git-ignored)
├── .gitignore                  # Security barrier tracking definitions
└── README.md                   # System configuration blueprints
```

---

## ⚡ Environment Variables

The project uses runtime environment injection to switch target backends seamlessly. Create a `.env` file in your root folder:

```env
# Google Apps Script Production Execution Link
GOOGLE_APPS_SCRIPT_URL="https://google.com"
```

> ⚠️ **Security Warning:** Never commit `.env` files to remote version control repositories. This rule is enforced strictly via `.gitignore`.

---

## 📦 Production Deployment Instructions

### 1. Google Workspace & Apps Script

1. Open the target Google Sheet tracking spreadsheet.
2. Navigate to **Extensions > Apps Script** and update your script file with production configurations.
3. Click **Deploy > Manage Deployments**.
4. Create a **New Version**, change access settings to **"Anyone"**, and copy the newly generated Web App URL.

### 2. Hosting Configuration (Vercel)

1. Log into your [Vercel Project Dashboard](https://vercel.com).
2. Go to **Settings > Environment Variables**.
3. Create a variable matching our backend key configuration:
   - **Key:** `GOOGLE_APPS_SCRIPT_URL`
   - **Value:** *[Your Live Google Web App URL]*
4. Trigger a **Redeploy** to compile the site using your active environment parameters.

---

## 🛡️ Anti-Spam (Yahoo & Gmail Deliverability) Checklist

To ensure automated script emails don't get trapped by strict Yahoo or Gmail spam algorithms, confirm that your domain administration panel features the following active DNS TXT configurations:

- **SPF:** `v=spf1 include:_://google.com ~all` (Merges authorized Google Workspace senders).
- **DKIM:** Generated via the *Google Admin Console > Gmail > Authenticate email* to attach cryptographic verification signatures.
- **DMARC:** `v=DMARC1; p=none;` applied under `_://yourdomain.com` host paths.
