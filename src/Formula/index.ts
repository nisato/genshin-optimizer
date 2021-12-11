import { transformativeReactionLevelMultipliers } from "../StatConstants"
import { allMainStatKeys, allSubstats } from "../Types/artifact"
import { allArtifactSets } from "../Types/consts"
import { objectFromKeyMap } from "../Util/Util"
import type { ConstantNode, Node, ReaderSpec, ReaderSpecNode } from "./type"
import { frac, makeReaders, prod, res, subscript, sum, min, max } from "./utils"

const allStats = [...allMainStatKeys, ...allSubstats] as const
const unit: ConstantNode = { operation: "const", value: 1, info: { unit: "%" }, operands: [] }

const readerSpec = Object.freeze({
  base: objectFromKeyMap(["atk", "def", "hp"] as const, _ => "add" as const),
  premod: objectFromKeyMap(allStats, _ => "add" as const),
  postmod: objectFromKeyMap(allStats, _ => "add" as const),

  art: objectFromKeyMap(allArtifactSets, _ => "add" as const),
  char: {
    auto: "add", skill: "add", burst: "add",
    level: "unique", constellation: "unique", ascension: "unique",
  },
  weapon: { level: "unique", rank: "unique", },

  hit: {
    base: "add",
    dmgBonus: "add",
    amp: { reactionMulti: "add", multi: "add", base: "add", },
    crit: { value: "unique", rate: "unique", avg: "add", },
  },

  trans: {
    dmg: "add",
    reactionMulti: "unique",
    base: "add",
    lvlMulti: "unique",
  },
  enemy: { baseRes: "add", level: "unique", res: "add", def: "add", defRed: "add", },
} as const)

const input = makeReaders(readerSpec)
const { base, premod, postmod, char, hit, trans, enemy, } = input

const common = {
  premod: objectFromKeyMap(["atk", "def", "hp"] as const,
    key => prod(base[key], postmod[`${key}_` as const])),
  postmod: objectFromKeyMap(allStats,
    key => premod[key]),

  trans: {
    dmg: prod(trans.reactionMulti, trans.base, trans.lvlMulti, enemy.res),
    base: sum(unit, prod(16, frac(postmod.eleMas, 2000))),
    lvlMulti: subscript(char.level, transformativeReactionLevelMultipliers),
  },

  hit: {
    dmg: prod(hit.base, sum(unit, hit.dmgBonus), hit.crit.value, enemy.def, enemy.res, hit.amp.multi),
    crit: {
      rate: max(min(postmod.critRate_, unit), 0),
      avg: sum(1, prod(hit.crit.rate, postmod.critDMG_))
    },
    amp: {
      multi: prod(hit.amp.reactionMulti, hit.amp.base),
      base: sum(unit, prod(25 / 9, frac(postmod.eleMas, 1400))),
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

export type Context = ReaderSpec<DeepPartial<typeof readerSpec>, Node>

typecheck<ReaderSpecNode>(readerSpec)
typecheck<Context>(common)
typecheck<Context>(generationInput)

function typecheck<T>(_: T): void { }
type DeepPartial<T> = {
  [key in keyof T]?: DeepPartial<T[key]>
}
