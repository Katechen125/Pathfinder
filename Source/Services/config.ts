/**
 * Pathfinder — Central API Config
 * © 2024 Katechen125. All rights reserved.
 */
import Config from 'react-native-config';

function requireEnv(key: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    console.warn(`[Pathfinder] ⚠️ Missing: ${key} — check your .env file`);
    return '';
  }
  return value;
}

const AppConfig = {
  GOOGLE_MAPS_API_KEY: requireEnv('GOOGLE_MAPS_API_KEY', Config.GOOGLE_MAPS_API_KEY),
  GEOAPIFY_KEY:        requireEnv('GEOAPIFY_KEY',        Config.GEOAPIFY_KEY),
} as const;

export default AppConfig;