import { transformativeReactionLevelMultipliers } from "../StatConstants"
import { allMainStatKeys, allSubstats } from "../Types/artifact"
import { allArtifactSets } from "../Types/consts"
import { objectFromKeyMap } from "../Util/Util"
import type { Constant } from "./type"
import { frac, makeReaders, prod, res, subscript, sum, todo, min, max } from "./utils"

const allStats = [...allMainStatKeys, ...allSubstats] as const
const unit: Constant = { action: "const", value: 1, info: { unit: "%" } }

/**
 * All modifiable/named formulas and inputs.
 */
const input = makeReaders({
  charInfo: objectFromKeyMap(allStats, _ => todo),
  weaponInfo: objectFromKeyMap(allStats, _ => todo),

  char: objectFromKeyMap(["auto", "skill", "burst", "level", "constellation", "ascension"] as const, _ => todo),
  weapon: objectFromKeyMap(["level", "rank"] as const, _ => todo),
  art: objectFromKeyMap([...allArtifactSets, ...allStats], _ => todo),
  bonus: objectFromKeyMap(allStats, _ => todo),

  hit: {
    base: todo, crit: todo,
    dmgBonus: todo,
    amp: { reactionMulti: todo },
    trans: { reactionMulti: todo, },
    enemy: objectFromKeyMap(["baseRes", "level"] as const, _ => todo),
  },
  other: {
    defRed: todo,
    dmgBonus: todo,
  }
} as const, "sum")
const output = {
  base: objectFromKeyMap(allStats, _ => todo),
  total: objectFromKeyMap(allStats, _ => todo),
  trans: objectFromKeyMap(["dmg", "base", "lvlMulti"], _ => todo),
  enemy: objectFromKeyMap(["res", "def"], _ => todo),
  crit: objectFromKeyMap(["rate", "avg"], _ => todo),
  hit: {
    dmg: todo,
    amp: objectFromKeyMap(["multi", "base"], _ => todo),
  },
  heal: { total: todo, }, // TODO
  shield: { total: todo, }, // TODO
}

const { charInfo, weaponInfo, bonus, char, art, hit: hitInput, other: otherInput } = input
const { base, total, trans, enemy, crit, hit } = makeReaders(output, "sum")

// A little wasteful on `base` & `total` stats, but this is much easier to code & somewhat future proofing

for (const key of [...allMainStatKeys, ...allSubstats] as const) {
  output.base[key] = sum(charInfo[key], weaponInfo[key])
  output.total[key] = sum(base[key], art[key], bonus[key])
}
// Special handling for keys with % bonus
for (const key of ["atk", "def", "hp"] as const)
  output.total[key] = sum(prod(base[key], base[`${key}_` as const]), art[key])

output.trans.dmg = prod(hitInput.trans.reactionMulti, trans.base, trans.lvlMulti, enemy.res)
output.trans.base = sum(unit, prod(16, frac(total.eleMas, 2000)))
output.trans.lvlMulti = subscript(char.level, transformativeReactionLevelMultipliers)

output.hit.amp.multi = prod(hitInput.amp.reactionMulti, hit.amp.base)
output.hit.amp.base = sum(unit, prod(25 / 9, frac(total.eleMas, 1400)))

output.enemy.res = res(hitInput.enemy.baseRes)
output.enemy.def = frac(sum(char.level, 100), prod(sum(hitInput.enemy.level, 100), sum(1, prod(-1, otherInput.defRed))))

output.crit.rate = max(min(total.critRate_, unit), 0)
output.crit.avg = prod(crit.rate, total.critDMG_)

output.hit.dmg = prod(hitInput.base, sum(unit, hitInput.dmgBonus), hitInput.crit, enemy.def, enemy.res, hit.amp.multi)

export {
  input, output
}
