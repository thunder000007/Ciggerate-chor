# Call Bridge (separate game branch)

A mobile-first Call Bridge prototype with a playable solo table against three bots, partner teams, a configurable match target, and a private-room UI placeholder.

## Current status
- Solo table: playable prototype with 52 cards, fixed spades trump, follow-suit enforcement, 13 tricks per hand, a bid/call phase, trick winners, and a configurable match target.
- Teams: seats You + North vs West + East. Each player calls individually; each player's points are calculated from their call and tricks, then partner scores are combined.
- Bots: automatic calls and a basic trick-aware card strategy; this is not expert-level AI.
- Online private rooms: **not connected**. A real-time backend and trusted game-state validation are still required before friends can play across phones. A passcode form alone is not multiplayer.
- Rules: scoring is a documented starter variant, not verified as identical to every local Call Bridge variant. Local variants may differ on minimum calls, penalties, and overtrick scoring.

## Build APK
GitHub Actions workflow `.github/workflows/call-bridge-apk.yml` packages the web app with Capacitor and uploads a debug APK artifact. The APK is not a Play Store release.

## Run locally
`npm install`, `npm run build`, `npx cap add android`, `npx cap sync android`, then build Android debug APK from the android project.
