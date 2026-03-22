Pathfinder
A mobile travel companion app built with React Native and Expo. Plan trips end-to-end — search flights and hotels, track expenses, convert currencies, manage itineraries, and navigate with Google Maps.

© 2024 Katechen125. All rights reserved.
Unauthorised use, reproduction, or redistribution is prohibited.


Features

Interactive Map — Google Maps with place search via Google Places Autocomplete
Flight Search — Browse and filter flights by route and date
Hotel Discovery — Find accommodations powered by Geoapify
Activities — Explore things to do at your destination powered by Geoapify
Itinerary Builder — Build and manage day-by-day travel plans
Calendar Sync — Save trip events to your device calendar
Expense Tracker — Log and categorize travel spending
Budget Planner — Set budgets and monitor costs in real time
Currency Converter — Convert between currencies on the go
Visa Information — Look up visa requirements by country
Past Searches — Quickly re-search recent destinations
Login & Feedback — Personalized session with in-app feedback


⚠️ Dummy Data Notice
Several screens use placeholder data for development and demonstration purposes. These are marked with // [DUMMY DATA] comments in the source code.
ScreenWhat is mockedFlightScreen.tsxHardcoded sample flight resultsCurrencyConverterScreen.tsxHardcoded exchange ratesVisaScreen.tsxStatic visa requirements mapLoginScreen.tsxNo real authentication — accepts any non-empty inputBookingScreen.tsxPlaceholder booking URLs

HotelsScreen and ActivitiesScreen use real Geoapify API data. They fall back to mock data only if the API call fails.

See DOCUMENTATION.md for instructions on replacing each with live API calls.

Quick Start
Prerequisites

Node.js 18+
ngrok for device testing: npm install -g @expo/ngrok@^4.0.0
iPhone or Android with Expo Go installed

1. Clone
bashgit clone https://github.com/Katechen125/Pathfinder.git
cd Pathfinder
2. Install dependencies
bashnpm install --legacy-peer-deps
3. Set up API keys
Open app.json and fill in your real keys under extra:
json"extra": {
  "GOOGLE_MAPS_API_KEY": "your_google_maps_key_here",
  "GEOAPIFY_KEY": "your_geoapify_key_here"
}
KeyWhere to get itGOOGLE_MAPS_API_KEYconsole.cloud.google.com → APIs & Services → CredentialsGEOAPIFY_KEYmyprojects.geoapify.com
4. Run
bashnpx expo start --tunnel --clear
Scan the QR code with Expo Go on your phone.

Windows users: Always use --tunnel — it routes through Expo's servers instead of local WiFi, bypassing Windows firewall issues.


Security
API keys are stored in app.json under the extra field and read at runtime via expo-constants. Keep real keys out of version control — use placeholder values in the committed app.json.
For production builds, use EAS Secrets to inject keys at build time.

Note: react-native-config does not work in Expo Go. This project uses expo-constants instead.


iOS Setup — Swift Package Manager
Google Maps Platform is ending CocoaPods support in Q2 2026 (SDK v11.0+). See DOCUMENTATION.md → iOS SPM Migration Guide for migration steps.

Project Structure
Pathfinder/
├── App.tsx                        # Root component and navigation
├── index.js                       # Expo entry point (registerRootComponent)
├── app.json                       # Expo config + API keys (do not commit real keys)
├── package.json                   # Dependencies
├── Source/
│   ├── Screens/
│   │   ├── LoginScreen.tsx        # [DUMMY] No real auth
│   │   ├── WelcomeScreen.tsx      # Search + past searches
│   │   ├── HomeScreen.tsx         # Main hub with places + past searches
│   │   ├── MapScreen.tsx          # Google Maps + markers
│   │   ├── FlightScreen.tsx       # [DUMMY] Hardcoded flight data
│   │   ├── HotelsScreen.tsx       # Real Geoapify data
│   │   ├── ActivitiesScreen.tsx   # Real Geoapify data
│   │   ├── ItineraryScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── TravelExpense.tsx
│   │   ├── BudgetScreen.tsx
│   │   ├── CurrencyConverterScreen.tsx  # [DUMMY] Hardcoded rates
│   │   ├── BookingScreen.tsx      # [DUMMY] Placeholder URLs
│   │   ├── Visa.tsx               # [DUMMY] Static visa data
│   │   └── FeedbackScreen.tsx
│   └── Services/
│       ├── types.ts               # Shared TypeScript types
│       ├── config.ts              # API key config via expo-constants
│       ├── watermark.ts           # Authorship watermark
│       ├── API.ts                 # All external API calls
│       └── storage.ts             # AsyncStorage helpers
└── android/

Tech Stack
LayerTechnologyFrameworkReact Native + Expo SDK 54LanguageTypeScriptNavigationReact Navigation v7 (Stack)Mapsreact-native-maps + Google Maps SDKPlaces/Hotels/ActivitiesGeoapify APIPlace SearchGoogle Places AutocompleteStorageAsyncStorageHTTPAxiosAnimationsreact-native-reanimated v3Secretsexpo-constants + app.json extra

Documentation
FileContentsDOCUMENTATION.mdArchitecture, screen reference, common errors & fixes, running the app, build & deploySECURITY.mdVulnerability remediation log, CocoaPods deprecation notice

License
© 2024 Katechen125. All rights reserved.
This project is provided publicly for portfolio and educational reference. Unauthorised reproduction, redistribution, or commercial use is prohibited without explicit written permission from the author.
