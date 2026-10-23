# JARVIS INTELLIGENCE OS 3.1 PRO — Premium Sales Platform

**Official Brand:** JARVIS INTELLIGENCE OS 3.1 PRO  
**Official Creator Credit:** Engineered by **ABHINAV ANAND**  
**Official Instagram:** [https://www.instagram.com/aibhav45](https://www.instagram.com/aibhav45)  
**Tagline:** *"YOUR PHONE. YOUR COMMAND. YOUR INTELLIGENCE."*  
**Supporting Tagline:** *"VOICE. INTELLIGENCE. AUTOMATION."*

---

## Architecture Overview

This platform is a full-stack production application built with:
- **Frontend:** React 19 + TypeScript + Tailwind CSS + Three.js 3D Core with ACESFilmic Tone Mapping and RoomEnvironment PBR.
- **Backend:** Node.js Express server (`server.ts`) with server-authoritative pricing, Razorpay HMAC-SHA256 signature verification, and time-limited token-authorized APK download streaming.
- **Security:** Strict separation of client/server secrets, Firestore RBAC rules (`firestore.rules`), immutable administrative audit logs, and an emergency release killswitch.

---

## 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# Razorpay Credentials (from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID="rzp_live_or_test_xxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Admin Dashboard Access Secret
ADMIN_ACCESS_SECRET="jarvis_admin_secret_2026"

# Firebase Client Configuration (Optional)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_PROJECT_ID=""
```

*Note:* If Razorpay keys are omitted, the application runs automatically in **Sandbox / Test Mode**, allowing full end-to-end testing of order creation, payment verification, license minting, and download streaming.

---

## 2. Testing Instructions

### A. Test Successful Purchase & License Generation
1. Navigate to **Pricing & Buy**.
2. Enter Customer Name, Email, and Phone.
3. Click **Pay & Unlock APK**.
4. The system will verify the order server-side, issue a unique personal license key (`JARVIS-31P-XXXX-XXXX-XXXX`), and transition to the **Verified Receipt** page.

### B. Test Post-Purchase Secure APK Download
1. On the success screen or inside the **Customer Portal**, click **Mint Download Link (APK)**.
2. The server issues a short-lived token with a 15-minute countdown timer.
3. Clicking **Download Signed APK** initiates the download with official headers (`X-JARVIS-Engineered-By: ABHINAV ANAND`, `X-JARVIS-Checksum-SHA256`).

### C. Test Emergency Release Killswitch
1. Click **Admin** in the navigation header.
2. Enter the passphrase: `jarvis_admin_secret_2026`.
3. Switch to the **APK Releases & Killswitch** tab.
4. Click **Emergency Killswitch**.
5. All future downloads of that release will be immediately refused with a security hold message until reactivated.

### D. Test Duplicate Webhook Replay Protection
1. In the Admin Dashboard under **Payment & Orders**, click **Simulate Capture**.
2. The server idempotently records the webhook payment event and prevents duplicate fulfillment.

---

## 3. Deployment Instructions

To build the client assets and launch the full-stack server:

```bash
# 1. Compile the frontend bundle
npm run build

# 2. Run the production server
npm run start
```

---

## 4. Remaining Tasks for the Owner (Abhinav Anand)

1. **Merchant Onboarding:** Generate your live API Key and Webhook secret from the [Razorpay Merchant Dashboard](https://dashboard.razorpay.com/) and paste into `.env`.
2. **Real APK Upload:** When your finalized signed `JARVIS_OS_3.1_PRO_v3.1.0.apk` build is ready, replace the server binary handler or place it in private cloud storage.
3. **Change Default Admin Passphrase:** Update `ADMIN_ACCESS_SECRET` in your `.env` to a strong unique password.
