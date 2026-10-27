# Firebase setup for the SokoTZ website

The website uses the **same** Firebase project, Auth users and named Firestore database as the Android app. It never uses a `(default)` database (none exists in this project) and never creates a second project.

## 1. Register the Web App (manual, Firebase Console)
1. Firebase Console → project **gen-lang-client-0905574889** → Project settings → General → *Your apps* → **Add app → Web**. Name it `SokoTZ Website`. Hosting is not needed.
2. Copy `apiKey` and `appId` from the config snippet. These values are publishable (not secrets).

## 2. Environment variables
| Variable | Required | Value |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | yes | Web app `apiKey` |
| `VITE_FIREBASE_APP_ID` | yes | Web app `appId` (`1:276149702266:web:…`) |
| `VITE_FIREBASE_PROJECT_ID` | no | defaults to `gen-lang-client-0905574889` |
| `VITE_FIREBASE_AUTH_DOMAIN` | no | defaults to `gen-lang-client-0905574889.firebaseapp.com` (its `/__/auth/handler` responds 200) |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | no | defaults to `ai-studio-android-sokotz-17bca192-1896-4b7e-b183-ea8b41319929` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | no | defaults to `276149702266` |
| `VITE_FIREBASE_STORAGE_BUCKET` | no | defaults to `gen-lang-client-0905574889.firebasestorage.app` (unused: images are inline) |
| `VITE_FIREBASE_USE_EMULATORS` | dev only | `true` connects to local Auth (9099) and Firestore (8085) emulators |

See `.env.example`. Config resolution lives in `src/lib/firebase/config.ts` (unit tested).

## 3. Authentication (manual, Firebase Console → Authentication)
- **Sign-in method:** Email/Password and Google must be enabled (Android already uses both).
- **Settings → Authorized domains:** add every domain the website runs on: `sokootz.lovable.app`, the Lovable preview domain (`id-preview--…lovable.app`), any custom domain, and `localhost` for development. Without this Google sign-in fails with `auth/unauthorized-domain` (the site shows a clear message).
- **Templates → Password reset → Customize action URL (optional):** set to `https://<your-domain>/auth/reset-password` so reset links open the website's page (which reads `oobCode`). If left unchanged, Firebase's hosted page performs the reset, which also works.
- Google sign-in on the web uses `signInWithPopup` — no extra OAuth client is needed beyond the project's existing web client. **Not yet verified against the real project** (needs the Web App keys and authorized domain).

## 4. Firestore
- Database: the named DB above. Rules source of truth: Android repo `firestore.rules`; mirrored in `firebase/firestore.rules` for website tests.
- **Deployed rules differ from the repository** (unauthenticated reads are denied in production). Review and deploy the repository rules from the Android project, otherwise visitors must log in to browse.
- Queries used by the website (all equality-only → served by automatic single-field indexes, **no composite index required**):
  - `listings where status == "PUBLISHED" limit 500`
  - `listings where businessId == X and status == "PUBLISHED"`
  - `listings where ownerId == uid`
  - `businesses where ownerId == uid limit 1`
  If Firestore ever reports a missing index, the page shows "This view isn't ready yet" and the console logs the index-creation link.

## 5. Emulators
`firebase.json` (project root) configures Auth `9099` and Firestore `8085` with the mirrored rules for the named database. Requires Java 11+ and `firebase-tools`.
```sh
npx firebase-tools emulators:start --only firestore,auth --project demo-sokotz
VITE_FIREBASE_USE_EMULATORS=true VITE_FIREBASE_PROJECT_ID=demo-sokotz npm run dev
```

## 6. Remaining manual Console actions
1. Register the Web App and provide `apiKey` + `appId`.
2. Add the website domains to Authorized domains.
3. Confirm Email/Password and Google providers are enabled.
4. Review and deploy the repository `firestore.rules` (after fixing Android's `rating: 5.0` create payload — see AUDIT_REPORT §3.2).
5. Optional: customise the password-reset action URL.
