/**
 * Curated "known good" usernames used as the initial value of the global
 * username input and by the randomize button. Picks should be well-known,
 * long-lived accounts with visually interesting skins or capes.
 */
export const KNOWN_USERNAMES: readonly string[] = [
  // (former) Minecraft employees
  'Dinnerbone', // 61699b2ed3274a019f1e0ea8c3f06bc6
  'Grumm',      // e6b5c088068044df9e1b9bf11792291b
  'jeb_',       // 853c80ef3c3749fdaa49938b674adae6
  'Notch',      // 069a79f444e94726a5befca90e38aaf5

  // content creator
  'CaptainSparklez', // 5f820c3958834392b1743125ac05e38c
  'Gronkh',          // a2080281c2784181b961d99ed2f3347c
  'MumboJumbo',      // c7da90d56a054217b94a7d427cbbcad8
  'SparkOfPhoenix',  // 0fa0416373d3462ea55d70e4887291aa
  'Technoblade',     // b876ec32e396476ba1158438d83c67d4
  'Yogscast',        // 1961b5dbe44448899a53b035b8904f41
  'Grian',           // 5f8eb73b25be4c5aa50fd27d65e30ca0
  'GeminiTay',       // 5a1839d2cecc4c85aa08b346f9f772a1
  'Ph1LzA',          // 84555089add149b1a26d8021270a40f0

  // not content creator but otherwise potentially known
  'Hypixel',    // f7c77d999f154a66a87dc4a51ef30d19
  'LabyStudio', // 34e57efa578346c7a9fc890296aaba1f

  // me and cool people
  'inventivetalent',  // bcd2033c63ec4bf88aca680b22461340
  'SpraxDev',  // 955e4cf6411c40d1a1765bc8e03a8a9a

  // special skins (uncomment, when the API can render them 'correctly' (e.g. deadmau5's ears))
  // 'deadmau5', // 1e18d5ff643d45c8b50943b8461d8614
];

/**
 * Picks a random username from {@link KNOWN_USERNAMES}. When `exclude` is
 * given (e.g. the currently shown name), the result is guaranteed to differ
 * from it, so a re-roll always visibly changes the page.
 */
export function pickRandomUsername(exclude?: string): string {
  const pool = KNOWN_USERNAMES.filter((name) => name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
