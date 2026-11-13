# Bangla Sign Language (BdSL) clips

AgriLume does **not** machine-translate to or from BdSL. A signed video is shown in the app only when it is listed in
`manifest.json` with a credit and a `verifiedBy` statement.

Suggested process:
1. Give the short phrase list in `lib/timetravel/bdsl.ts` (`ACCESS_PHRASES`) to a certified BdSL interpreter or a Deaf
   community organisation (for example through the Bangladesh National Federation of the Deaf).
2. Record each phrase (plain background, signer visible from the waist up, captions burned in or supplied).
3. Put the `.mp4` here, add an entry to `manifest.json`:

```json
{
  "schema": "agrilume.bdsl.v1",
  "clips": [
    {
      "id": "flood-safety",
      "src": "flood-safety.mp4",
      "captionBn": "বন্যার সতর্কতা পেলে নিরাপদ স্থানে যান…",
      "captionEn": "If a flood warning is issued, move to a safe place…",
      "credit": "Signer: <name>",
      "verifiedBy": "Verified by <organisation>, <year>"
    }
  ]
}
```
Clips without a `verifiedBy` are ignored by the app.
