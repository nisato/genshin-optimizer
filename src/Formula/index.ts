import { transformativeReactionLevelMultipliers } from "../StatConstants"
import { allMainStatKeys, allSubstats } from "../Types/artifact"
import { allArtifactSets } from "../Types/consts"
import { objectFromKeyMap } from "../Util/Util"
import type { Constant, Formula, ReaderSpec, ReaderSpecNode, ReadFormula } from "./type"
import { frac, makeReaders, prod, res, subscript, sum, todo, min, max } from "./utils"

const allStats = [...allMainStatKeys, ...allSubstats] as const
const unit: Constant = { action: "const", value: 1, info: { unit: "%" } }

const readerSpec = Object.freeze({
  base: objectFromKeyMap(["atk", "def", "hp"] as const, _ => "sum" as const),
  total: objectFromKeyMap(allStats, _ => "sum" as const),

  art: objectFromKeyMap(allArtifactSets, _ => "sum" as const),
  char: {
    auto: "sum", skill: "sum", burst: "sum",
    level: "unique", constellation: "unique", ascension: "unique",
  },
  weapon: { level: "unique", rank: "unique", },

  hit: {
    base: "sum",
    dmgBonus: "sum",
    amp: { reactionMulti: "sum", multi: "sum", base: "sum", },
    crit: { value: "unique", rate: "unique", avg: "sum", },
  },

  trans: {
    dmg: "sum",
    reactionMulti: "unique",
    base: "sum",
    lvlMulti: "unique",
  },
  enemy: { baseRes: "sum", level: "unique", res: "sum", def: "sum", defRed: "sum", },
} as const)

const input = makeReaders(readerSpec)
const { base, total, char, hit, trans, enemy, } = input

const common = {
  total: objectFromKeyMap(["atk", "def", "hp"] as const,
    key => prod(base[key], total[`${key}_` as const])),

  trans: {
    dmg: prod(trans.reactionMulti, trans.base, trans.lvlMulti, enemy.res),
    base: sum(unit, prod(16, frac(total.eleMas, 2000))),
    lvlMulti: subscript(char.level, transformativeReactionLevelMultipliers),
  },

  hit: {
    dmg: prod(hit.base, sum(unit, hit.dmgBonus), hit.crit.value, enemy.def, enemy.res, hit.amp.multi),
    crit: {
      rate: max(min(total.critRate_, unit), 0),
      avg: prod(hit.crit.rate, total.critDMG_)
    },
    amp: {
      multi: prod(hit.amp.reactionMulti, hit.amp.base),
      base: sum(unit, prod(25 / 9, frac(total.eleMas, 1400))),
    },
  },

  enemy: {
    res: res(enemy.baseRes),
    def: frac(sum(char.level, 100), prod(sum(enemy.level, 100), sum(1, prod(-1, enemy.defRed))))
  }
} as const

const generationSpec = Object.freeze({
  generation: {
    ...objectFromKeyMap(allStats, _ => "unique" as const),
    ...objectFromKeyMap(allArtifactSets, _ => "unique" as const)
  }
} as const)
const generationReaders = makeReaders(generationSpec)

const generationInput = {
  total: objectFromKeyMap(allStats, key => generationReaders.generation[key]),
  art: objectFromKeyMap(allArtifactSets, key => generationReaders.generation[key]),
} as const

export {
  input, common, generationInput, generationReaders
}

export type Context = ReaderSpec<DeepPartial<typeof readerSpec>, Formula>

typecheck<ReaderSpecNode>(readerSpec)
typecheck<Context>(common)
typecheck<Context>(generationInput)

function typecheck<T, X extends T = T>(_: X): void { }
type DeepPartial<T> = {
  [key in keyof T]?: DeepPartial<T[key]>
}