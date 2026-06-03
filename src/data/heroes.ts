// Roster and meta data for RandomTuong.vn.
// Roster source checked on 2026-06-03 against public AoV hero indexes.
// Meta/winrate values are launch-ready estimates based on May 2026 public tier-list sources.

export interface Hero {
  name: string;
  role: 'Warrior' | 'Assassin' | 'Mage' | 'Marksman' | 'Tank' | 'Support';
  secondaryRole: string;
  lane: 'Top' | 'Jungle' | 'Mid' | 'AD' | 'Support';
  emoji: string;
  difficulty: 1 | 2 | 3;
  winrate: number;
  tier: 'S' | 'A' | 'B' | 'C';
  available?: boolean;
}

export const HERO_DATA_UPDATED_AT = "Đối chiếu 03/06/2026 · Meta S2 2026";
export const HERO_SOURCE_NOTE =
  "Roster tham khảo các chỉ mục AoV/Liên Quân công khai ghi nhận 126 heroes, latest Dyadia. Tier/winrate là số ước tính để gợi ý ban/pick, tổng hợp từ tier list Liên Quân tháng 5/2026 và thảo luận cộng đồng/esports.";
export const HERO_SOURCES: string[] = [
  "https://liquipedia.net/honorofkings/Portal%3AHeroes/Arena_of_Valor",
  "https://gaming.vn/tier-list-tuong-lien-quan-mobile-mua-s2-thang-5-2026/",
  "https://gaming.vn/lien-quan-mobile-meta-thang-5-2026-tuong-manh-nhat/",
  "https://gogamix.xyz/lien-quan/tier-list/",
  "https://www.reddit.com/r/arenaofvalor/comments/1rrdv8l/top_tier_heroes_in_3_main_esports_regions_12032026/"
];

export const HEROES: Hero[] = [
  { name: "Airi", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "⚔️", difficulty: 2, winrate: 51.4, tier: "A" },
  { name: "Aleister", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🔮", difficulty: 2, winrate: 49.6, tier: "B" },
  { name: "Alice", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🪄", difficulty: 1, winrate: 52.1, tier: "A" },
  { name: "Allain", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🌗", difficulty: 2, winrate: 51.8, tier: "A" },
  { name: "Amily", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🥊", difficulty: 2, winrate: 50.2, tier: "B" },
  { name: "Annette", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🌀", difficulty: 2, winrate: 52.4, tier: "A" },
  { name: "Aoi", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🪝", difficulty: 3, winrate: 50.7, tier: "B" },
  { name: "Arduin", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🛡️", difficulty: 1, winrate: 49.8, tier: "B" },
  { name: "Arthur", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🗡️", difficulty: 1, winrate: 49.5, tier: "B" },
  { name: "Arum", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🦁", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Astrid", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "⚓", difficulty: 2, winrate: 50.3, tier: "B" },
  { name: "Ata", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "⚓", difficulty: 2, winrate: 49.2, tier: "C" },
  { name: "Aya", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🧚", difficulty: 1, winrate: 50.9, tier: "B" },
  { name: "Azzen'Ka", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🏜️", difficulty: 2, winrate: 48.6, tier: "C" },
  { name: "Baldum", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🏋️", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "Bijan", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🐎", difficulty: 2, winrate: 50.4, tier: "B" },
  { name: "Billow", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "🌊", difficulty: 2, winrate: 51.8, tier: "A" },
  { name: "Biron", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🛡️", difficulty: 2, winrate: 50.6, tier: "B" },
  { name: "Bolt Baron", role: "Warrior", secondaryRole: "Jungle", lane: "Top", emoji: "⚡", difficulty: 2, winrate: 50.8, tier: "B" },
  { name: "Bonnie", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🎀", difficulty: 2, winrate: 49.7, tier: "B" },
  { name: "Bright", role: "Marksman", secondaryRole: "Assassin", lane: "AD", emoji: "💫", difficulty: 2, winrate: 50.4, tier: "B" },
  { name: "Brunhilda", role: "Marksman", secondaryRole: "Siege", lane: "AD", emoji: "🚀", difficulty: 2, winrate: 49.8, tier: "B" },
  { name: "Butterfly", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🦋", difficulty: 1, winrate: 50.6, tier: "B" },
  { name: "Capheny", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🔧", difficulty: 2, winrate: 54.2, tier: "S" },
  { name: "Charlotte", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🌹", difficulty: 2, winrate: 50.8, tier: "B" },
  { name: "Chaugnar", role: "Support", secondaryRole: "Tank", lane: "Support", emoji: "🐘", difficulty: 1, winrate: 50.8, tier: "B" },
  { name: "Cresht", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🦀", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "D'Arcy", role: "Mage", secondaryRole: "Jungle", lane: "Mid", emoji: "🌙", difficulty: 3, winrate: 49.3, tier: "C" },
  { name: "Dextra", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🩸", difficulty: 2, winrate: 50.5, tier: "B" },
  { name: "Diao Chan", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "🌸", difficulty: 2, winrate: 49.8, tier: "B" },
  { name: "Dirak", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "🧿", difficulty: 2, winrate: 50.8, tier: "B" },
  { name: "Dolia", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🎵", difficulty: 2, winrate: 53.0, tier: "S" },
  { name: "Dyadia", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🪷", difficulty: 2, winrate: 50.5, tier: "B" },
  { name: "Edras", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🪓", difficulty: 2, winrate: 50.4, tier: "B" },
  { name: "Eland'orr", role: "Marksman", secondaryRole: "Jungle", lane: "Jungle", emoji: "🌿", difficulty: 3, winrate: 53.3, tier: "S" },
  { name: "Elsu", role: "Marksman", secondaryRole: "Poke", lane: "AD", emoji: "🏹", difficulty: 3, winrate: 50.4, tier: "B" },
  { name: "Enzo", role: "Assassin", secondaryRole: "Support", lane: "Jungle", emoji: "⛓️", difficulty: 3, winrate: 51.6, tier: "A" },
  { name: "Erin", role: "Marksman", secondaryRole: "Mage", lane: "AD", emoji: "🎯", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Errol", role: "Warrior", secondaryRole: "Assassin", lane: "Jungle", emoji: "🗡️", difficulty: 2, winrate: 53.5, tier: "S" },
  { name: "Fennik", role: "Marksman", secondaryRole: "Jungle", lane: "Jungle", emoji: "🦊", difficulty: 2, winrate: 50.2, tier: "B" },
  { name: "Florentino", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🌹", difficulty: 3, winrate: 56.3, tier: "S" },
  { name: "Gildur", role: "Tank", secondaryRole: "Mage", lane: "Support", emoji: "💛", difficulty: 2, winrate: 49.7, tier: "B" },
  { name: "Goverra", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "🪬", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Grakk", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🪝", difficulty: 2, winrate: 50.5, tier: "B" },
  { name: "Hayate", role: "Marksman", secondaryRole: "Assassin", lane: "AD", emoji: "🎯", difficulty: 3, winrate: 51.7, tier: "A" },
  { name: "Heino", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "⏳", difficulty: 2, winrate: 50.8, tier: "B" },
  { name: "Helen", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🌼", difficulty: 1, winrate: 50.6, tier: "B" },
  { name: "Iggy", role: "Mage", secondaryRole: "Poke", lane: "Mid", emoji: "🔥", difficulty: 2, winrate: 50.1, tier: "B" },
  { name: "Ignis", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "🔥", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "Ilumia", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "✨", difficulty: 2, winrate: 50.2, tier: "B" },
  { name: "Ishar", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🐾", difficulty: 2, winrate: 49.7, tier: "B" },
  { name: "Jinnar", role: "Mage", secondaryRole: "Warrior", lane: "Mid", emoji: "⚡", difficulty: 1, winrate: 48.9, tier: "C" },
  { name: "Kahlii", role: "Mage", secondaryRole: "Poke", lane: "Mid", emoji: "🌫️", difficulty: 1, winrate: 48.8, tier: "C" },
  { name: "Kaine", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🩶", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Keera", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🧬", difficulty: 3, winrate: 52.9, tier: "S" },
  { name: "Kil'Groth", role: "Warrior", secondaryRole: "Jungle", lane: "Top", emoji: "🦈", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "Kriknak", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🐛", difficulty: 2, winrate: 50.2, tier: "B" },
  { name: "Krixi", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🌟", difficulty: 1, winrate: 50.8, tier: "B" },
  { name: "Krizzix", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "👁️", difficulty: 2, winrate: 50.6, tier: "B" },
  { name: "Lauriel", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🪽", difficulty: 3, winrate: 53.7, tier: "S" },
  { name: "Laville", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🔫", difficulty: 2, winrate: 50.9, tier: "B" },
  { name: "Liliana", role: "Mage", secondaryRole: "Assassin", lane: "Mid", emoji: "🌺", difficulty: 3, winrate: 54.5, tier: "S" },
  { name: "Lindis", role: "Marksman", secondaryRole: "Jungle", lane: "Jungle", emoji: "🌙", difficulty: 2, winrate: 50.9, tier: "B" },
  { name: "Lorion", role: "Mage", secondaryRole: "Control", lane: "Mid", emoji: "🧲", difficulty: 3, winrate: 51.7, tier: "A" },
  { name: "Lu Bu", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "⚔️", difficulty: 2, winrate: 54.8, tier: "S" },
  { name: "Lumburr", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🪨", difficulty: 1, winrate: 49.8, tier: "B" },
  { name: "Maloch", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "👹", difficulty: 2, winrate: 50.4, tier: "B" },
  { name: "Marja", role: "Mage", secondaryRole: "Warrior", lane: "Mid", emoji: "🌑", difficulty: 2, winrate: 53.1, tier: "S" },
  { name: "Max", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🛰️", difficulty: 2, winrate: 49.4, tier: "C" },
  { name: "Mganga", role: "Mage", secondaryRole: "Support", lane: "Mid", emoji: "🥁", difficulty: 1, winrate: 49.2, tier: "C" },
  { name: "Mina", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "💎", difficulty: 1, winrate: 51.7, tier: "A" },
  { name: "Ming", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🔗", difficulty: 2, winrate: 50.6, tier: "B" },
  { name: "Moren", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🔩", difficulty: 2, winrate: 50.2, tier: "B" },
  { name: "Murad", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "⌛", difficulty: 3, winrate: 51.2, tier: "A" },
  { name: "Nakroth", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🌙", difficulty: 3, winrate: 55.1, tier: "S" },
  { name: "Natalya", role: "Mage", secondaryRole: "Burst", lane: "Mid", emoji: "❄️", difficulty: 1, winrate: 50.6, tier: "B" },
  { name: "Omega", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🤖", difficulty: 1, winrate: 48.8, tier: "C" },
  { name: "Omen", role: "Warrior", secondaryRole: "Jungle", lane: "Top", emoji: "🐍", difficulty: 2, winrate: 51.5, tier: "A" },
  { name: "Ormarr", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🔨", difficulty: 1, winrate: 49.1, tier: "C" },
  { name: "Paine", role: "Assassin", secondaryRole: "Mage", lane: "Jungle", emoji: "🎼", difficulty: 3, winrate: 50.6, tier: "B" },
  { name: "Preyta", role: "Mage", secondaryRole: "Poke", lane: "Mid", emoji: "🐉", difficulty: 2, winrate: 48.7, tier: "C" },
  { name: "Qi", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🐉", difficulty: 2, winrate: 51.5, tier: "A" },
  { name: "Quillen", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🗡️", difficulty: 3, winrate: 51.9, tier: "A" },
  { name: "Raz", role: "Mage", secondaryRole: "Assassin", lane: "Mid", emoji: "🥊", difficulty: 3, winrate: 50.6, tier: "B" },
  { name: "Riktor", role: "Warrior", secondaryRole: "Jungle", lane: "Top", emoji: "⛓️", difficulty: 3, winrate: 50.8, tier: "B" },
  { name: "Rouie", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "🌀", difficulty: 3, winrate: 53.2, tier: "S" },
  { name: "Rourke", role: "Warrior", secondaryRole: "Marksman", lane: "Jungle", emoji: "🛠️", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "Roxie", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🔥", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Ryoma", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🌊", difficulty: 2, winrate: 50.1, tier: "B" },
  { name: "Sephera", role: "Support", secondaryRole: "Mage", lane: "Support", emoji: "💧", difficulty: 2, winrate: 49.8, tier: "B" },
  { name: "Sinestrea", role: "Assassin", secondaryRole: "Jungle", lane: "Jungle", emoji: "🩸", difficulty: 3, winrate: 53.4, tier: "S" },
  { name: "Skud", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "👊", difficulty: 2, winrate: 51.6, tier: "A" },
  { name: "Slimz", role: "Marksman", secondaryRole: "Jungle", lane: "AD", emoji: "🦎", difficulty: 2, winrate: 50.8, tier: "B" },
  { name: "Stuart", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🎩", difficulty: 2, winrate: 51.8, tier: "A" },
  { name: "Superman", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🦸", difficulty: 3, winrate: 48.9, tier: "C" },
  { name: "Taara", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🪓", difficulty: 1, winrate: 49.6, tier: "B" },
  { name: "Tachi", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "🗡️", difficulty: 2, winrate: 51.9, tier: "A" },
  { name: "TeeMee", role: "Support", secondaryRole: "Tank", lane: "Support", emoji: "🪙", difficulty: 2, winrate: 51.4, tier: "A" },
  { name: "Teeri", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🪶", difficulty: 2, winrate: 50.6, tier: "B" },
  { name: "Tel'Annas", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🌿", difficulty: 1, winrate: 52.7, tier: "S" },
  { name: "Thane", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "👑", difficulty: 1, winrate: 49.7, tier: "B" },
  { name: "The Flash", role: "Assassin", secondaryRole: "Mage", lane: "Mid", emoji: "⚡", difficulty: 3, winrate: 50.2, tier: "B" },
  { name: "Thorne", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🔫", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Toro", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🐂", difficulty: 1, winrate: 51.2, tier: "A" },
  { name: "Tulen", role: "Mage", secondaryRole: "Assassin", lane: "Mid", emoji: "⚡", difficulty: 3, winrate: 52.5, tier: "A" },
  { name: "Valhein", role: "Marksman", secondaryRole: "Mage", lane: "AD", emoji: "🗡️", difficulty: 1, winrate: 49.4, tier: "C" },
  { name: "Veera", role: "Mage", secondaryRole: "Burst", lane: "Mid", emoji: "🕷️", difficulty: 1, winrate: 51.0, tier: "B" },
  { name: "Veres", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🩸", difficulty: 3, winrate: 53.9, tier: "S" },
  { name: "Violet", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "💜", difficulty: 2, winrate: 51.9, tier: "A" },
  { name: "Volkath", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "🐎", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Wiro", role: "Tank", secondaryRole: "Warrior", lane: "Top", emoji: "🎭", difficulty: 2, winrate: 48.9, tier: "C" },
  { name: "Wisp", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "🔆", difficulty: 1, winrate: 51.6, tier: "A" },
  { name: "Wonder Woman", role: "Warrior", secondaryRole: "Tank", lane: "Top", emoji: "🛡️", difficulty: 2, winrate: 49.2, tier: "C" },
  { name: "Wukong", role: "Assassin", secondaryRole: "Warrior", lane: "Jungle", emoji: "🪄", difficulty: 2, winrate: 52.3, tier: "A" },
  { name: "Xeniel", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "👼", difficulty: 2, winrate: 49.9, tier: "B" },
  { name: "Y'bneth", role: "Tank", secondaryRole: "Support", lane: "Support", emoji: "🌳", difficulty: 2, winrate: 50.7, tier: "B" },
  { name: "Yan", role: "Warrior", secondaryRole: "Assassin", lane: "Top", emoji: "🖌️", difficulty: 3, winrate: 50.8, tier: "B" },
  { name: "Yena", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "⚔️", difficulty: 3, winrate: 53.8, tier: "S" },
  { name: "Yorn", role: "Marksman", secondaryRole: "Carry", lane: "AD", emoji: "☀️", difficulty: 1, winrate: 51.2, tier: "A" },
  { name: "Yue", role: "Mage", secondaryRole: "Poke", lane: "Mid", emoji: "🌙", difficulty: 3, winrate: 51.5, tier: "A" },
  { name: "Zanis", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "🐲", difficulty: 1, winrate: 49.5, tier: "B" },
  { name: "Zata", role: "Mage", secondaryRole: "Assassin", lane: "Mid", emoji: "🔪", difficulty: 3, winrate: 51.8, tier: "A" },
  { name: "Zephys", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "💨", difficulty: 2, winrate: 51.6, tier: "A" },
  { name: "Zill", role: "Mage", secondaryRole: "Assassin", lane: "Jungle", emoji: "🌪️", difficulty: 3, winrate: 50.3, tier: "B" },
  { name: "Zip", role: "Support", secondaryRole: "Tank", lane: "Support", emoji: "🧃", difficulty: 2, winrate: 50.6, tier: "B" },
  { name: "Zuka", role: "Warrior", secondaryRole: "Jungle", lane: "Jungle", emoji: "🎋", difficulty: 2, winrate: 51.9, tier: "A" },
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const ROLE_LABELS: Record<string, string> = {
  Warrior: 'Đấu sĩ',
  Assassin: 'Sát thủ',
  Mage: 'Pháp sư',
  Marksman: 'Xạ thủ',
  Tank: 'Đỡ đòn',
  Support: 'Trợ thủ',
  Jungle: 'Đi rừng',
};
