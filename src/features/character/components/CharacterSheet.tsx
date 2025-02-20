'use client';

import styles from './CharacterSheet.module.css';
import { CharacterData, AbilityScores } from '@/features/character/types';
import { baseCharacterData } from '@/features/character/constants/baseCharacterData';

interface CharacterSheetProps {
  character?: CharacterData;
  setCharacter: (data: CharacterData) => void;
}

export default function CharacterSheet({ character = baseCharacterData, setCharacter }: CharacterSheetProps) {
  const calculateModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : modifier.toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      [name]: value
    });
  };

  const handleAbilityChange = (ability: keyof typeof character.abilityScores, value: string) => {
    const numValue = parseInt(value) || 0;
    setCharacter({
      ...character,
      abilityScores: {
        ...character.abilityScores,
        [ability]: numValue
      } as AbilityScores
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [category, field] = name.split('.');

    if (category === 'savingThrows' || category === 'skills') {
      setCharacter({
        ...character,
        [category]: {
          ...character[category],
          [field]: checked
        }
      });
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      [name]: value
    });
  };

  return (
    <form className={styles.charsheet}>
      <header className={styles.header}>
        <section className={styles.charname}>
          <label className={styles.label}>Character Name</label>
          <input
            name="name"
            placeholder="Thoradin Fireforge"
            value={character.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </section>

        <section className={styles.misc}>
          <ul>
            <li>
              <label className={styles.label}>Class & Level</label>
              <input
                name="classLevel"
                placeholder="Paladin 2"
                value={character.classLevel}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
            <li>
              <label className={styles.label}>Background</label>
              <input
                name="background"
                placeholder="Acolyte"
                value={character.background}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
            <li>
              <label className={styles.label}>Player Name</label>
              <input
                name="playerName"
                placeholder="Player McPlayerface"
                value={character.playerName}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
            <li>
              <label className={styles.label}>Race</label>
              <input
                name="race"
                placeholder="Half-elf"
                value={character.race}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
            <li>
              <label className={styles.label}>Alignment</label>
              <input
                name="alignment"
                placeholder="Lawful Good"
                value={character.alignment}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
            <li>
              <label className={styles.label}>Experience Points</label>
              <input
                name="experiencePoints"
                placeholder="3240"
                value={character.experiencePoints}
                onChange={handleInputChange}
                className={styles.input}
              />
            </li>
          </ul>
        </section>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <section className={styles.attributes}>
            <div className={styles.scores}>
              <ul>
                {Object.entries(character.attributes || character.abilityScores).map(([ability, score]) => (
                  <li key={ability}>
                    <div className={styles.score}>
                      <label className={styles.label}>{ability}</label>
                      <input
                        type="number"
                        value={score}
                        onChange={(e) => handleAbilityChange(ability as keyof typeof character.abilityScores, e.target.value)}
                        min="1"
                        max="20"
                      />
                    </div>
                    <div className={styles.modifier}>
                      <input
                        type="text"
                        value={calculateModifier(score)}
                        readOnly
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.attrApplications}>
            <div className={styles.inspiration}>
              <label className={styles.label}>Inspiration</label>
              <input
                type="checkbox"
                checked={character.inspiration}
                onChange={(e) => setCharacter({ ...character, inspiration: e.target.checked })}
                className={styles.profCheckbox}
              />
            </div>

            <div className={styles.proficiencyBonus}>
              <label className={styles.label}>Proficiency Bonus</label>
              <input
                type="number"
                value={character.proficiencyBonus}
                onChange={(e) => setCharacter({ ...character, proficiencyBonus: parseInt(e.target.value) || 0 })}
                className={styles.input}
              />
            </div>

            <div className={styles.savingThrows}>
              <h3>Saving Throws</h3>
              {Object.entries(character.savingThrows).map(([ability, isProficient]) => (
                <div key={ability} className={styles.skillItem}>
                  <input
                    type="checkbox"
                    name={`savingThrows.${ability}`}
                    checked={isProficient}
                    onChange={handleCheckboxChange}
                    className={styles.profCheckbox}
                  />
                  <input
                    type="text"
                    value={calculateModifier(character.abilityScores[ability as keyof typeof character.abilityScores])}
                    readOnly
                    className={styles.skillMod}
                  />
                  <label className={styles.label}>{ability}</label>
                </div>
              ))}
            </div>

            <div className={styles.skills}>
              <h3>Skills</h3>
              {Object.entries(character.skills).map(([skill, isProficient]) => (
                <div key={skill} className={styles.skillItem}>
                  <input
                    type="checkbox"
                    name={`skills.${skill}`}
                    checked={isProficient}
                    onChange={handleCheckboxChange}
                    className={styles.profCheckbox}
                  />
                  <input
                    type="text"
                    value="+0"
                    readOnly
                    className={styles.skillMod}
                  />
                  <label className={styles.label}>{skill}</label>
                </div>
              ))}
            </div>
          </div>

          <section className={styles.combat}>
            <div className={styles.combatStat}>
              <label className={styles.label}>Armor Class</label>
              <input
                type="number"
                value={character.armorClass}
                onChange={(e) => setCharacter({ ...character, armorClass: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className={styles.combatStat}>
              <label className={styles.label}>Initiative</label>
              <input
                type="number"
                value={character.initiative}
                onChange={(e) => setCharacter({ ...character, initiative: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className={styles.combatStat}>
              <label className={styles.label}>Speed</label>
              <input
                type="number"
                value={character.speed}
                onChange={(e) => setCharacter({ ...character, speed: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className={styles.hp}>
              <div className={styles.maxHp}>
                <label className={styles.label}>Hit Point Maximum</label>
                <input
                  type="number"
                  value={character.maxHp}
                  onChange={(e) => setCharacter({ ...character, maxHp: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.currentHp}>
                <label className={styles.label}>Current Hit Points</label>
                <input
                  type="number"
                  value={character.currentHp}
                  onChange={(e) => setCharacter({ ...character, currentHp: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className={styles.tempHp}>
                <label className={styles.label}>Temporary Hit Points</label>
                <input
                  type="number"
                  value={character.temporaryHp}
                  onChange={(e) => setCharacter({ ...character, temporaryHp: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className={styles.hitDice}>
              <label className={styles.label}>Hit Dice</label>
              <input
                type="text"
                value={character.hitDice}
                onChange={(e) => setCharacter({ ...character, hitDice: e.target.value })}
              />
            </div>

            <div className={styles.deathSaves}>
              <label className={styles.label}>Death Saves</label>
              <div>
                <label>Successes</label>
                {[1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="checkbox"
                    checked={character.deathSaves.successes >= i}
                    onChange={(e) => setCharacter({
                      ...character,
                      deathSaves: {
                        ...character.deathSaves,
                        successes: e.target.checked ? i : i - 1
                      }
                    })}
                    className={styles.profCheckbox}
                  />
                ))}
              </div>
              <div>
                <label>Failures</label>
                {[1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="checkbox"
                    checked={character.deathSaves.failures >= i}
                    onChange={(e) => setCharacter({
                      ...character,
                      deathSaves: {
                        ...character.deathSaves,
                        failures: e.target.checked ? i : i - 1
                      }
                    })}
                    className={styles.profCheckbox}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className={styles.attacksAndSpellcasting}>
            <h3 className={styles.label}>Attacks & Spellcasting</h3>
            <table className={styles.attacksTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Atk Bonus</th>
                  <th>Damage/Type</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td><input type="text" placeholder="Longsword" /></td>
                    <td><input type="text" placeholder="+5" /></td>
                    <td><input type="text" placeholder="1d8 + 3 slashing" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.equipment}>
            <h3 className={styles.label}>Equipment</h3>
            <div className={styles.money}>
              <div>
                <label className={styles.label}>CP</label>
                <input
                  type="number"
                  value={character.equipment.cp}
                  onChange={(e) => setCharacter({
                    ...character,
                    equipment: { ...character.equipment, cp: parseInt(e.target.value) || 0 }
                  })}
                  className={styles.coinInput}
                />
              </div>
              {/* Repeat for SP, EP, GP, PP */}
            </div>
            <textarea
              name="equipment.items"
              value={character.equipment.items}
              onChange={handleTextAreaChange}
              placeholder="Equipment list here"
            />
          </section>

          <section className={styles.flavor}>
            <div className={styles.flavorSection}>
              <label className={styles.label}>Personality Traits</label>
              <textarea
                name="personality"
                value={character.personality}
                onChange={handleTextAreaChange}
              />
            </div>
            <div className={styles.flavorSection}>
              <label className={styles.label}>Ideals</label>
              <textarea
                name="ideals"
                value={character.ideals}
                onChange={handleTextAreaChange}
              />
            </div>
            <div className={styles.flavorSection}>
              <label className={styles.label}>Bonds</label>
              <textarea
                name="bonds"
                value={character.bonds}
                onChange={handleTextAreaChange}
              />
            </div>
            <div className={styles.flavorSection}>
              <label className={styles.label}>Flaws</label>
              <textarea
                name="flaws"
                value={character.flaws}
                onChange={handleTextAreaChange}
              />
            </div>
          </section>

          <section className={styles.features}>
            <label className={styles.label}>Features & Traits</label>
            <textarea
              name="features"
              value={character.features}
              onChange={handleTextAreaChange}
            />
          </section>
        </div>
      </main>
    </form>
  );
}
