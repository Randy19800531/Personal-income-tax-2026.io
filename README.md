# SA Tax Consultant – Android app (v1.5.0)

This folder is the complete app. `index.html` is your v1.4.2 file with an Android layer added on top; none of the original functions, rules or calculations were changed (all 20 built-in diagnostics give identical results in both versions). The same `index.html` still works if you double-click it on a PC.

Nothing here needs admin rights or any installed software. Everything is done in a web browser.

## What's in the folder

| File | Purpose |
|---|---|
| `index.html` | The app (original + Android layer) |
| `manifest.webmanifest` | Makes it installable: name, icons, shortcuts, "Share to" support |
| `sw.js` | Offline support. Bump `VERSION` in it when you change icons/manifest |
| `icons/`, `screenshots/` | App icons and install-screen screenshots |
| `.nojekyll` | Needed so GitHub Pages serves the `.well-known` folder later. Keep it |

## Step 1 – Put it online (GitHub Pages, free, ~5 minutes)

1. On github.com, create a new **public** repository. Name it exactly `<your-username>.github.io` (this matters for Step 3).
2. Click **Add file → Upload files** and drag in *everything inside this folder* (including `.nojekyll`, `icons`, `screenshots`). Commit.
3. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
4. After a minute the app is live at `https://<your-username>.github.io/`.

Only the program is uploaded. Client data never leaves the phone. Never upload workspace backups into this repository.

## Step 2 – Install on Android (the quick way)

Open the URL in **Chrome** on the phone → tap **Install** on the prompt (or ⋮ menu → *Install app*). Chrome builds a real Android app (WebAPK): own icon in the app drawer, full screen, works offline, appears in the Android **Share** menu, and long-pressing the icon shows shortcuts (Scan a certificate, Computation, Clients, Guided input).

For most people this is all you need.

## Step 3 – Optional: a real APK / Play Store package

1. Go to **pwabuilder.com**, paste your URL, click **Package for stores → Android**.
2. Choose **Google Play** (AAB for the Play Store) or **Other Android** (APK you can send and sideload).
3. Download the zip. It contains the APK/AAB, a **signing key** and `assetlinks.json`.
   *Keep the signing key and its passwords safe. You need them for every future update.*
4. In your GitHub repo create the folder `.well-known` and upload `assetlinks.json` into it, so it lives at `https://<your-username>.github.io/.well-known/assetlinks.json`. Without this the APK still works but shows a small Chrome address bar at the top.
5. Install the APK on the phone (allow "Install unknown apps" for your file manager when asked).

## Moving your existing clients onto the phone

Your current data is inside the browser you've been using on the PC and does not move automatically.
On the PC: **Settings → Back up workspace**. Send the `.json` to the phone, then either **Share → SA Tax** and choose *Workspace backup*, or open the app → **More → Settings → Restore workspace**.

## Updating the app later

Upload the new `index.html` to the repo. Phones pick it up the next time the app opens with internet; no reinstall needed, even for the APK. If you change `sw.js`, the icons or the manifest, also raise `VERSION` in `sw.js`; users then get an "Update" button.

## What the Android layer adds

- **Phone navigation**: bottom tab bar (Home, Documents, Input, Compute, More) and a "More" sheet with every section, grouped like the desktop sidebar.
- **Android back button** moves between sections and closes dialogs and sheets, instead of exiting the app.
- **Works offline**: the app, PDF reader and fonts are cached. The OCR engine is cached after first use; Settings → *Download OCR for offline use* does it in advance.
- **Scan a certificate with the camera**: photo → OCR on the phone → text goes through the existing extractor → values appear in *Extraction review* for you to confirm. Also *From photos* for gallery images.
- **Take photo** for bank, letting and municipal statements in Rental & business (uses the existing statement OCR).
- **Share to SA Tax** from WhatsApp, Gmail, Files, Drive, etc.: PDFs, photos, CSV and JSON. The app asks what the file is (certificate, statement, workspace backup, client JSON) and routes it.
- **Exports**: CSV, text and other files Android can share give a *Save* or *Share* (Drive, Gmail, WhatsApp) choice. Other files download as before.
- **App lock** (Settings, off by default): fingerprint, face or phone PIN, re-locks after 3 minutes in the background and blurs the screen when you switch away. It is a privacy screen, not encryption. *Can't unlock?* lets you erase this device's data and restore from a backup, so you can never be locked out permanently.
- **Backup reminder** if you have clients and haven't backed up for 14 days.
- **Protected storage**: asks Android not to auto-clear the app's data.
- **Touch fixes**: larger tap targets; the "?" help on wizard questions opens on tap instead of hover.
- Status-bar colour follows light/dark theme, an install prompt in the browser, and app status in **Settings → Phone app**.

## Things to check on a real phone

These were tested in an emulated Pixel 7 in Chrome, but not on a physical device:

- **Print / save as PDF** uses Android's print screen. It works in Chrome; check it once in the APK version.
- **Camera OCR** accuracy depends on the photo. Shoot flat, in good light, filling the frame. Every value still needs your confirmation.
- The first OCR use needs internet (about 10–15 MB download).
