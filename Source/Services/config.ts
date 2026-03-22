/**
 * Pathfinder — Central API Config
 * © 2024 Katechen125. All rights reserved.
 * Uses expo-constants for Expo Go compatibility.
 */
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

function requireEnv(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    console.warn(`[Pathfinder] ⚠️ Missing: ${key} — check your app.json extra field`);
    return '';
  }
  return value;
}

const AppConfig = {
  GOOGLE_MAPS_API_KEY: requireEnv('GOOGLE_MAPS_API_KEY', extra.GOOGLE_MAPS_API_KEY),
  GEOAPIFY_KEY:        requireEnv('GEOAPIFY_KEY',        extra.GEOAPIFY_KEY),
} as const;

export default AppConfig;