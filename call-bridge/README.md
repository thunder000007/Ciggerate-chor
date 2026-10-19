# Call Bridge (separate game branch)

A mobile-first Call Bridge prototype with solo play against bots and a Firebase-free local-network multiplayer foundation.

## Multiplayer design
- One Android phone hosts a local TCP room on port 8765.
- Up to three other phones can connect over the host phone's Wi-Fi hotspot.
- No Firebase account or cloud database is required.
- The host phone's hotspot gateway is commonly 192.168.43.1, but Android vendors can use a different address.
- Device compatibility and network behavior must be tested on real phones.

## Current status
- Solo table: playable prototype with a 52-card deck, fixed spades trump, follow-suit enforcement, 13 tricks, bidding and a configurable target.
- Teams: You + North vs West + East.
- Bots: basic strategy, not expert-level AI.
- LAN transport: a native Android TCP socket plugin is injected during APK builds. The four-phone game UI/state relay still needs integration and end-to-end testing; this branch must not yet be described as a finished four-phone multiplayer game.
- Rules: scoring is a starter variant, not verified as identical to every local Call Bridge variant.
- APK: GitHub Actions produces a debug APK artifact, not a Play Store release.

## Build APK
The GitHub Actions workflow packages the web app with Capacitor, injects the native LAN socket plugin, and builds a debug APK artifact.
