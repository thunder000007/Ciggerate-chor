# Call Bridge (separate game branch)

A mobile-first Call Bridge prototype with a playable solo table against three bots, partner teams, a configurable match target, and a private-room UI placeholder.

## Current status
- Solo table: playable prototype, 52-card deck, follow-suit enforcement, trick winner and match score.
- Bots: basic legal random card selection; not yet strategic bidding/partnership AI.
- Online private rooms: **not connected**. A realtime backend (e.g. Firebase Realtime Database/Firestore with rules and server-side validation) must be configured before friends can play across phones. A passcode form alone is not multiplayer.
- Rules: the current scoring/hand flow is a prototype, not a verified implementation of every local Call Bridge variant. Need agree exact bid/call and scoring variant before calling it complete.

## Build APK
GitHub Actions workflow `.github/workflows/call-bridge-apk.yml` packages the web app with Capacitor and uploads a debug APK artifact. The APK is not a Play Store release.

## Run locally
`npm install`, `npm run build`, `npx cap add android`, `npx cap sync android`, then build Android debug APK from the android project.
