# Security Audit Report for EduSparkz Client

**Date:** 2025-11-30
**Scope:** `client` directory and relevant Supabase migrations.

## Executive Summary
A security analysis was performed on the client-side codebase. While the project follows many best practices (e.g., gitignoring `.env` files, using Supabase for auth), a **critical vulnerability** was identified in the Admin Signup flow that allows unauthorized users to gain administrative privileges.

## Findings

### 1. Critical: Insecure Admin Signup Flow
- **Location:** `client/src/pages/admin/AdminSignup.jsx` and `supabase/migrations/20251128_update_user_trigger.sql`
- **Description:** The application relies on a client-side secret code check (`EDUSPARKZ_ADMIN_2025`) to restrict admin registration. This code is visible in the browser's source code. Furthermore, the backend trigger `handle_new_user` blindly trusts the `role` metadata provided by the client during signup.
- **Impact:** An attacker can bypass the client-side check or send a direct API request to Supabase with `role: 'admin'` in the metadata to create an administrator account without authorization.
- **Recommendation:** 
    1. Remove the client-side secret check as it provides no real security.
    2. Update the `handle_new_user` trigger to ignore the `role` metadata from public signups or strictly validate it against a secure server-side source.
    3. Implement a secure process for promoting users to admins (e.g., a database function callable only by existing admins).

### 2. Medium: Potential XSS via `dangerouslySetInnerHTML`
- **Location:** `client/src/components/ui/chart.tsx` (Lines 79-96)
- **Description:** The `ChartStyle` component uses `dangerouslySetInnerHTML` to inject CSS styles based on configuration props. While this is likely part of a trusted UI library (shadcn/ui) and less risky than HTML injection, it is a potential vector if the configuration data comes from untrusted user input.
- **Recommendation:** Ensure that the `config` prop passed to `ChartContainer` is always sanitized or comes from trusted sources.

### 3. Low: Hardcoded Secret in Client Code
- **Location:** `client/src/pages/admin/AdminSignup.jsx`
- **Description:** The secret code `EDUSPARKZ_ADMIN_2025` is hardcoded in the JavaScript file.
- **Recommendation:** Remove this hardcoded secret. If a secret code flow is required, verify the code on the backend (e.g., via a Supabase Edge Function) before granting privileges.

### 4. Info: Good Practices Observed
- **Environment Variables:** The `.env` file is properly included in `.gitignore`.
- **Auth Implementation:** Standard Supabase authentication methods are used in `VerifyOtp.jsx`.
- **Password Policy:** Basic password complexity validation is implemented in `client/src/utils/validatePassword.js`.

## Next Steps
1. **Immediate Action:** Fix the Admin Signup vulnerability by modifying the database trigger and removing the client-side secret reliance.
2. **Review:** Audit other areas where `raw_user_meta_data` might be trusted blindly.
