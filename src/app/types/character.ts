export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SavingThrows {
  strength: boolean;
  dexterity: boolean;
  constitution: boolean;
  intelligence: boolean;
  wisdom: boolean;
  charisma: boolean;
}

export interface Skills {
  acrobatics: boolean;
  animalHandling: boolean;
  arcana: boolean;
  athletics: boolean;
  deception: boolean;
  history: boolean;
  insight: boolean;
  intimidation: boolean;
  investigation: boolean;
  medicine: boolean;
  nature: boolean;
  perception: boolean;
  performance: boolean;
  persuasion: boolean;
  religion: boolean;
  sleightOfHand: boolean;
  stealth: boolean;
  survival: boolean;
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
}

export interface Equipment {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
  items: string;
}

export interface CharacterData {
  name: string;
  classLevel: string;
  background: string;
  playerName: string;
  race: string;
  alignment: string;
  experiencePoints: string;
  abilityScores: AbilityScores;
  attributes: AbilityScores;
  inspiration: boolean;
  proficiencyBonus: number;
  savingThrows: SavingThrows;
  skills: Skills;
  armorClass: number;
  initiative: number;
  speed: number;
  maxHp: number;
  currentHp: number;
  temporaryHp: number;
  hitDice: string;
  deathSaves: {
    successes: number;
    failures: number;
  };
  attacks: Attack[];
  equipment: Equipment;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  features: string;
}
