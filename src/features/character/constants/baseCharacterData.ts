import { CharacterData } from '@/features/character/types';

export const baseCharacterData: CharacterData = {
  name: '',
  classLevel: '',
  background: '',
  playerName: '',
  race: '',
  alignment: '',
  attacks: [],
  experiencePoints: '0',
  abilityScores: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  },
  inspiration: false,
  proficiencyBonus: 0,
  savingThrows: {
    strength: false,
    dexterity: false,
    constitution: false,
    intelligence: false,
    wisdom: false,
    charisma: false
  },
  skills: {
    acrobatics: false,
    animalHandling: false,
    arcana: false,
    athletics: false,
    deception: false,
    history: false,
    insight: false,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: false,
    perception: false,
    performance: false,
    persuasion: false,
    religion: false,
    sleightOfHand: false,
    stealth: false,
    survival: false
  },
  armorClass: 0,
  initiative: 0,
  speed: 0,
  maxHp: 0,
  currentHp: 0,
  temporaryHp: 0,
  hitDice: '',
  deathSaves: {
    successes: 0,
    failures: 0
  },
  equipment: {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
    items: ''
  },
  personality: '',
  ideals: '',
  bonds: '',
  flaws: '',
  features: ''
};
