/**
 * Pathfinder — Authorship Watermark
 * © 2024 Katechen125. All rights reserved.
 * https://github.com/Katechen125/Pathfinder
 */
export const WATERMARK = Object.freeze({
  author:     'Katechen125',
  project:    'Pathfinder',
  year:       '2024',
  repository: 'https://github.com/Katechen125/Pathfinder',
  license:    'All rights reserved. Unauthorised use or redistribution is prohibited.',
});

export function logWatermark(): void {
  console.log(
    `\n╔══════════════════════════════════════════╗\n` +
    `║  Pathfinder © 2024 Katechen125           ║\n` +
    `║  github.com/Katechen125/Pathfinder        ║\n` +
    `╚══════════════════════════════════════════╝\n`
  );
}