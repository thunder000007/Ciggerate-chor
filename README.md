# সিগারেট চোর 🚬🕵️

A separate Android game project (not LillyBD).

## Current status
- Initial mobile-friendly prototype and Android build automation scaffold.
- GitHub Actions is configured to build a debug APK and upload it as an artifact.
- True 4-phone hotspot multiplayer still needs networking implementation and real-device testing; this scaffold is not yet a completed multiplayer game.

## Build APK
Open **Actions → Build Android APK → Run workflow** (or push a commit). When the run succeeds, open the run and download the `cigarette-chor-debug-apk` artifact.

## Game plan
- 4 players on separate Android phones using the same Wi-Fi hotspot
- One secret thief and one victim per round
- 3-minute round, hard difficulty, text chat and voting
- Each player can choose their own profile photo

No LillyBD files are used in this repository.