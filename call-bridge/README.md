# Call Bridge (separate game branch)

A mobile-first Call Bridge game with solo play against bots and Firebase-free local hotspot multiplayer.

## Hotspot multiplayer
- One Android phone turns on its hotspot and starts the local room from **Hotspot Multiplayer → Host a table**.
- The host shares its displayed IP address with up to three other players.
- The other phones connect to that hotspot, open **Hotspot Multiplayer → Join a table**, enter the host IP and their name, then join the table.
- The host deals once all four seats are filled. Each phone receives only its own hand; bids and card plays are relayed through the host phone's local HTTP server on port 8765.
- No Firebase account, cloud database, or internet connection is required. Keep the host app open and the phones connected to the same hotspot.
- Host IP detection and Android hotspot behavior vary by phone; real-device testing is required.

## Current status
- Solo table: 52 cards, fixed spades trump, follow-suit enforcement, bidding, 13 tricks and a configurable match target.
- Hotspot mode: host-authoritative local game state, join/bid/play actions, and per-player hand filtering are implemented in the app code. This has been built through GitHub Actions; test with four real phones before relying on it for a full match.
- Teams: South + North vs West + East.
- Scoring and bidding are a starter variant, not verified as identical to every local Call Bridge variant.
- APK: GitHub Actions creates a shareable Android debug APK, not a Play Store release.

## Build APK
GitHub Actions packages both index.html and lan.html with Capacitor, injects the native local server plugin, and builds a debug APK artifact.