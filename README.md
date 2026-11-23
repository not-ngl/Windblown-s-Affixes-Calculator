# Windblown's Affix Calculator

A web UI for calculating affix combination probabilities for Windblown. Supports multiple languages (as long as the wiki modules exist, and an UI translation is provided)

## Live Demo

[Just here](https://not-ngl.github.io/Windblown-s-Affixes-Calculator/).

## Data Sources

All game data is fetched from the Windblown Wiki via MediaWiki API:

| Source | Wiki Page |
|--------|-----------|
| Weapons | [Module:Weapons/Data](https://windblown.wiki.gg/wiki/Module:Weapons/Data) |
| Trinkets | [Module:Trinkets/Data](https://windblown.wiki.gg/wiki/Module:Trinkets/Data) |
| Affixes | [Module:Affixes/Data](https://windblown.wiki.gg/wiki/Module:Affixes/Data) |

## Design & Assets

### Icons
All icons are served directly from the Windblown Wiki:

- Weapon Icons: [Category:Weapon Icon Images](https://windblown.wiki.gg/wiki/Category:Weapon_Icon_Images)
- Trinket Icons: [Category:Trinket Icon Images](https://windblown.wiki.gg/wiki/Category:Trinket_Icon_Images)
- Upgrade Icons: [Category:Upgrade Icon Images](https://windblown.wiki.gg/wiki/Category:Upgrade_Icon_Images)

[Logo](https://windblown-logo-generator.vercel.app/?text=Affixes+calculator&font=LT+Museum&style=normal&offset=2&gc=%235100ff&gs=10&c1=%231ddcff&a1=1&c2=%23ff2dff&a2=1&c3=%23ffffff&a3=1&c4=%23b3ddf3&a4=1)

### Styling
CSS variables and theme design copy-pasted from [Windblown Wiki Common.css](https://windblown.wiki.gg/wiki/MediaWiki:Common.css).

## Contributing

Feel free to submit issues or enhancement requests. If calculation results seem incorrect, check `src/probability.js` first: the formulas are documented there.
   
   To add a new language:
   1. Add translations to `UI_STRINGS` in `settings.js`
   2. Ensure corresponding wiki modules exist (e.g., `Module:Armes/Data` for French)
   3. Update `LANGUAGES` array in `scripts/fetch-wiki-data.js`
   4. Ensure good numbers formatting (e.g., `fr-FR` for French)

## How It Works

### Data Pipeline
- Game data syncs automatically from the Windblown Wiki via MediaWiki API every Sunday at 06:00 UTC
- Lua modules are fetched, parsed, and converted to JSON for client-side consumption
- All icons are hotlinked directly from the wiki

### Probability Engine 
Calculations use combinatorial formulas that account for:
- Slot availability (based on gear level: 0–4 slots)
- Rarity tiers (Common, Uncommon, Rare with weighted pools)
- Upgrade mechanics (levels 0–3 with distinct p/q success rates and chaining rules)

  | Upgrade | p (Rare) | q (Common/Uncommon) | Max Rare | Roll Behavior |
  |---------|----------|---------------------|----------|---------------|
  | 0 | 0 | 1 | 0 | No rare affixes possible |
  | 1 | 0.05 | 0.95 | 1 | Single flat 5% chance regardless of slot count |
  | 2 | 0.10 | 0.90 | 1 | Single flat 10% chance regardless of slot count |
  | 3 | 0.10 | 0.90 | 4 | Conditionally chained (10% for 1st, 1% for 2nd, 0.1% for 3rd, 0.01% for 4th) |

#### Rare Affixes III Chaining (v0.99+)
As of version 0.99, **Rare Affixes III** rolls are conditionally chained rather than independent. A subsequent affix slot is only given a 10% chance to roll as Rare if the preceding roll succeeded as Rare. Once a non-rare affix is rolled, no further rare affixes can be generated on that gear.

### Formula Complexity
Each formula handles a specific `(slots_available, slots_selected)` scenario. For example, `calc4_3` calculates the probability of getting 3 desired affixes (`NrAsked`, `NuAsked`, `NcAsked`) when 4 slots are available. The computation branches recursively on each draw outcome (`r`/`R` for Rare, `u`/`U` for Uncommon, `c`/`C` for Common, lower unwanted, upper wanted) until reaching base cases (`calc1_1`).

To model the v0.99 **Rare Affixes III** chaining rules without extra state flags, the engine dynamically passes the `upgrade` parameter down the recursive tree:
- **When a Rare affix is drawn (`r` or `R`)**: The current `upgrade` tier (such as `3`) is preserved in the recursive call (`calc3_3(..., upgrade, ...)`), allowing the next slot to continue rolling for Rare affixes.
- **When a Common or Uncommon affix is drawn (`c`, `C`, `u`, `U`)**: The recursive call downgrades `upgrade` to `0` (`calc3_3(..., 0, ...)`), immediately breaking the Rare chain (`p = 0`) for all subsequent slots.
- **When Rare affixes are required (`NrAsked > 0`)**: Under `upgrade === 3`, any non-rare branch immediately fails (returns `0`), pruning all paths where the Rare chain breaks before all `NrAsked` affixes are obtained.

Additionally, the code includes defensive checks like `const p = (Nr < 1) ? 0 : this.UPGRADE_CONFIG[upgrade].p;` to ensure `p` evaluates to `0` if the Rare affix pool (`Nr`) is exhausted, preventing invalid probability states.

### Uncommon Affixes
When observing the frequency of generation of some affixes, it has been noticed that some of them were rarer than other: [see this message](https://discord.com/channels/1068465177139355658/1402764555091841024/1402764555091841024).

### Input Validation
The UI prevents impossible selections before they reach the calculator:
- Affix count cannot exceed available slots (enforced in `updateCheckboxStates()`)
- Rare affix limit respected per upgrade tier (upgrade 1–2 allow max 1 Rare; upgrade 3 allows up to 4)
- Empty selections display '-' rather than triggering errors

## License

Calculator tool code: [MIT License](LICENSE)  
Game assets & icons: © Motion Twin  
Wiki data: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

---

*This is an unofficial fan tool. Not affiliated with Windblown developers or publishers.*
