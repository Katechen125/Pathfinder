# 🧭 Pathfinder

> **© 2024 Katechen125. All rights reserved.**  
> Unauthorised use, reproduction, or redistribution is prohibited.

Pathfinder is a mobile travel companion app built with **React Native** and **Expo SDK 54**. Plan trips end-to-end — search destinations, find hotels and activities, track expenses, manage itineraries, and navigate with Google Maps.

---

## 📱 Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Google Maps with color-coded markers for places, hotels, and activities |
| 🏨 **Hotel Discovery** | Real hotel data powered by Geoapify API |
| 🎭 **Activities** | Nearby activities and attractions via Geoapify API |
| ✈️ **Flight Search** | Browse flights by route and date |
| 📋 **Itinerary Builder** | Build and manage day-by-day travel plans |
| 📅 **Calendar Sync** | Save trip events to your device calendar |
| 💸 **Expense Tracker** | Log and categorize travel spending |
| 💰 **Budget Planner** | Set budgets and monitor costs in real time |
| 💱 **Currency Converter** | Convert between world currencies |
| 🛂 **Visa Information** | Look up visa requirements by country |
| 🕐 **Past Searches** | Quickly re-search recent destinations |
| 🔐 **Login & Feedback** | Personalized session with in-app feedback |

---

## ⚠️ Dummy Data Notice

Some screens use **placeholder data** for development and demonstration. These are marked with `// [DUMMY DATA]` in the source code.

| Screen | Status |
|---|---|
| `HotelsScreen.tsx` | ✅ Real Geoapify API data |
| `ActivitiesScreen.tsx` | ✅ Real Geoapify API data |
| `MapScreen.tsx` | ✅ Real Google Maps data |
| `FlightScreen.tsx` | 🟡 Dummy — hardcoded sample results |
| `CurrencyConverterScreen.tsx` | 🟡 Dummy — hardcoded exchange rates |
| `VisaScreen.tsx` | 🟡 Dummy — static visa requirements map |
| `LoginScreen.tsx` | 🟡 Dummy — no real authentication |
| `BookingScreen.tsx` | 🟡 Dummy — placeholder booking URLs |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone ([App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))
- ngrok for tunnel connection: `npm install -g @expo/ngrok@^4.0.0`

### 1. Clone the repository

```bash
git clone https://github.com/Katechen125/Pathfinder.git
cd Pathfinder
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure API keys

Open `app.json` and add your keys under `extra`:

```json
{
  "expo": {
    "name": "Pathfinder",
    "slug": "pathfinder",
    "version": "1.0.0",
    "sdkVersion": "54.0.0",
    "extra": {
      "GOOGLE_MAPS_API_KEY": "your_google_maps_key_here",
      "GEOAPIFY_KEY": "your_geoapify_key_here"
    }
  }
}
```

| Key | Get it from |
|---|---|
| `GOOGLE_MAPS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials |
| `GEOAPIFY_KEY` | [myprojects.geoapify.com](https://myprojects.geoapify.com) |

> ⚠️ **Never commit real API keys to GitHub.** Replace them with placeholders before pushing.

### 4. Run the app

```bash
npx expo start --tunnel --clear
```

Scan the QR code with **Expo Go** on your phone.

> **Windows users:** Always use `--tunnel` — it bypasses Windows firewall issues by routing through Expo's servers.

---

## 🔐 Security

- API keys are stored in `app.json` under `extra` and read via `expo-constants`
- `react-native-config` is **not used** — it does not work with Expo Go
- For production builds, use [EAS Secrets](https://docs.expo.dev/build-reference/variables/) to inject keys securely
- All known npm vulnerabilities have been addressed — see [SECURITY.md](./SECURITY.md)

---

## 🛠️ Tech Stack

| | Technology |
|---|---|
| **Framework** | React Native + Expo SDK 54 |
| **Language** | TypeScript |
| **Navigation** | React Navigation v7 |
| **Maps** | react-native-maps + Google Maps SDK |
| **Places & Hotels** | Geoapify API |
| **HTTP** | Axios |
| **Storage** | AsyncStorage |
| **Animations** | react-native-reanimated v3 |
| **Secrets** | expo-constants |

---

## 📂 Project Structure

```
Pathfinder/
├── App.tsx                   # Root navigator
├── index.js                  # Expo entry point
├── app.json                  # Expo config + API keys
├── Source/
│   ├── Screens/              # All screen components
│   └── Services/
│       ├── API.ts            # External API calls
│       ├── config.ts         # Key config via expo-constants
│       ├── storage.ts        # AsyncStorage helpers
│       ├── types.ts          # Shared TypeScript types
│       └── watermark.ts      # Authorship watermark
└── android/
```

---

## 📄 Documentation

| File | Contents |
|---|---|
| [DOCUMENTATION.md](./DOCUMENTATION.md) | Full technical docs — architecture, screen reference, common errors & fixes |
| [SECURITY.md](./SECURITY.md) | Vulnerability log, Google Maps CocoaPods deprecation notice |

---

## 📜 License

**© 2024 Katechen125. All rights reserved.**

This repository is public for portfolio and educational reference only. Unauthorised reproduction, redistribution, or commercial use without explicit written permission from the author is prohibited.
