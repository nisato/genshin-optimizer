import { Box } from "@mui/material";
import ColorText from "./Components/ColoredText";
import elementalData from "./Data/ElementalData";
import Formula from "./Formula";
import usePromise from "./ReactHooks/usePromise";
import { amplifyingReactions, hitMoves, hitTypes, transformativeReactions } from "./StatConstants";
import { StatData } from "./StatData";
import { evalIfFunc } from "./Util/Util";

export default class Stat {
  //do not instantiate.
  constructor() {
    if (this instanceof Stat)
      throw Error('A static class cannot be instantiated.');
  }
  static getStatName = (key, defVal = "") => <ColorText color={StatData[key]?.variant} >{StatData[key]?.name ?? defVal}</ColorText>

  static getStatNameRaw = (key, defVal = "") => StatData[key]?.name || defVal
  static getStatNameWithPercent = (key, defVal = "", variant = true) =>
    <ColorText color={variant ? StatData[key]?.variant : undefined}  >{StatData[key]?.name ?? defVal}{key?.endsWith('_') && "%"}</ColorText>

  static getStatVariant = (key, defVal = "") =>
    StatData[key]?.variant || defVal
  static getStatUnit = (key, defVal = "") =>
    StatData[key]?.unit === "multi" ? defVal : (StatData[key]?.unit || defVal)

  static fixedUnit = (key) => {
    if (StatData[key]?.unit === "multi") return 3
    let unit = Stat.getStatUnit(key)
    return unit === "%" ? 1 : 0
  }
  static printStat = (statKey, stats, premod = false) =>
    f({ stats, expand: false, premod }, statKey)

  static getPrintableFormulaStatKeyList = (statList: any[] = [], modifiers = {}) => {
    let keys = new Set([...Object.keys(FormulaText), ...Object.keys(modifiers)])
    return statList.filter(key => keys.has(key))
  }
}

const ModFormula = ({ path, stats }) => {
  const formula = usePromise(Formula.get(path), [path]) as any
  if (!formula?.field?.formulaText) return null
  const ret = evalIfFunc(formula.field.formulaText, stats) as JSX.Element
  return ret
}
export function FormulaDisplay({ statKey, stats, modifiers = {}, expand = true }) {
  if (modifiers[statKey]) {
    const modifierText = (modifiers?.[statKey] ?? []).map(path =>
      <span key={path.join()}> + <ModFormula path={path} stats={stats} /></span>)
    if (typeof FormulaText?.[statKey] === "function")
      return <span>{FormulaText[statKey]({ stats, expand, premod: true })}{modifierText} </span>
    else
      return <span>{f({ stats, premod: true }, statKey)}{modifierText} </span>
  }

  if (typeof FormulaText?.[statKey] === "function")
    return FormulaText[statKey]({ stats, expand })
  else return null
}

function f(options, statKey) {
  let { stats, expand = true, premod = false } = options
  if (!stats) return
  if (expand && FormulaText?.[statKey])
    return <span>( {FormulaText[statKey](options)} )</span>
  let statName = Stat.getStatName(statKey)
  let statUnit = Stat.getStatUnit(statKey)
  let fixedUnit = Stat.fixedUnit(statKey)
  const value = (premod ? stats?.premod?.[statKey] : undefined) ?? stats?.[statKey]
  const printValue = value?.toFixed?.(fixedUnit) || value
  const debug = process.env.NODE_ENV === "development" ? <Box component="code" color="warning.main"> {statKey}</Box> : null
  return <Box component="span" sx={{ whiteSpace: "nowrap" }}><b>{statName}</b>{debug} <ColorText color="info">{printValue}{statUnit}</ColorText></Box>
}

export const FormulaText = {
  baseATK: (o) => <span>{f(o, "characterATK")} + {f(o, "weaponATK")} </span>,
  finalATK: (o) => <span>{f(o, "baseATK")} * ( 100% + {f(o, "atk_")} ) + {f(o, "atk")}</span>,
  finalHP: (o) => <span>{f(o, "characterHP")} * ( 100% + {f(o, "hp_")} ) + {f(o, "hp")}</span>,
  finalDEF: (o) => <span>{f(o, "characterDEF")} * ( 100% + {f(o, "def_")} ) + {f(o, "def")}</span>,

  enemyLevel_multi: (o) => <span>( 100 + {f(o, "characterLevel")} ) / ( ( 100 + {f(o, "characterLevel")} ) + ( 100 + {f(o, "enemyLevel")} ) * ( 100% - Min( {f(o, "enemyDEFRed_")} , 90% ) ) )</span>,

  heal_multi: (o) => <span>( 100% + {f(o, "heal_")} + {f(o, "incHeal_")} )</span>,

  amplificative_dmg_: (o) => <span>25 / 9 * {f(o, "eleMas")} / ( 1400 + {f(o, "eleMas")} ) * 100%</span>,
  transformative_dmg_: (o) => <span>16 * {f(o, "eleMas")} / ( 2000 + {f(o, "eleMas")} ) * 100%</span>,

  crystalize_eleMas_: (o) => <span>40 / 9 * {f(o, "eleMas")} / ( 1400 + {f(o, "eleMas")} ) * 100%</span>,
  crystalize_hit: (o) => <span>( 100% + {f(o, "crystalize_dmg_")} + {f(o, "crystalize_eleMas_")} ) * {f(o, "crystalize_multi")}</span>,
};
["pyro", "cryo", "electro", "hydro"].map(ele => FormulaText[`${ele}_crystalize_hit`] = o => <span>250% * {f(o, `crystalize_hit`)}</span>)

Object.entries(hitMoves).forEach(([move, moveName]) => {
  FormulaText[`final_${move}_critRate_`] = (o) => <span>clamp( {f(o, "critRate_")} + {f(o, `${move}_critRate_`)}, 0%, 100% )</span>
})

Object.entries(elementalData).forEach(([ele, { name: eleName }]) => {
  FormulaText[`${ele}_enemyRes_multi`] = (o) => {
    if (o.stats[`${ele}_enemyImmunity`])
      return <span>0 (immune)</span>
    let res = (o.stats[`${ele}_enemyRes_`] || 0) / 100
    if (res < 0) return <span> 100% - {f(o, `${ele}_enemyRes_`)} / 2</span>
    else if (res >= 0.75) return <span> 1 / ( {f(o, `${ele}_enemyRes_`)} * 4 + 1)</span>
    return <span> 100% - {f(o, `${ele}_enemyRes_`)} </span>
  }
})

Object.entries(hitMoves).forEach(([move, moveName]) => {
  Object.entries(elementalData).forEach(([ele, { name: eleName }]) => {
    Object.entries(hitTypes).forEach(([type, typeName]) => {
      FormulaText[`${ele}_${move}_${type}`] = (o) => <span>{f(o, `finalATK`)} * {f(o, `${ele}_${move}_${type}_multi`)}</span>
    })

    FormulaText[`${ele}_${move}_hit_base_multi`] = (o) => <span>100% + {f(o, 'dmg_')} + {f(o, `${ele}_dmg_`)} + {f(o, `${move}_dmg_`)}</span>
    FormulaText[`${move}_avgHit_base_multi`] = (o) => <span>100% + {f(o, 'critDMG_')} * {f(o, `final_${move}_critRate_`)} </span>
    FormulaText[`critHit_base_multi`] = (o) => <span>100% + {f(o, 'critDMG_')}</span>

    FormulaText[`${ele}_${move}_hit_multi`] = (o) => <span>{f(o, `${ele}_${move}_hit_base_multi`)} * {f(o, `enemyLevel_multi`)} * {f(o, `${ele}_enemyRes_multi`)}</span>
    FormulaText[`${ele}_${move}_critHit_multi`] = (o) => <span>{f(o, `critHit_base_multi`)} * {f(o, `${ele}_${move}_hit_multi`)}</span>
    FormulaText[`${ele}_${move}_avgHit_multi`] = (o) => <span>{f(o, `${move}_avgHit_base_multi`)} * {f(o, `${ele}_${move}_hit_multi`)}</span>
  })
})

Object.entries(transformativeReactions).forEach(([reaction, { multi, variants }]) => {
  FormulaText[`${reaction}_multi`] = (o) => <span>{multi} * {f(o, 'transformative_level_multi')}</span>
  if (variants.length === 1) {
    const [ele] = variants
    FormulaText[`${reaction}_hit`] = (o) => <span>( 100% + {f(o, `transformative_dmg_`)} + {f(o, `${reaction}_dmg_`)} ) * {f(o, `${reaction}_multi`)} * {f(o, `${ele}_enemyRes_multi`)}</span>
  } else {
    variants.forEach(ele => {
      FormulaText[`${ele}_${reaction}_hit`] = (o) => <span>( 100% + {f(o, `transformative_dmg_`)} + {f(o, `${reaction}_dmg_`)} ) * {f(o, `${reaction}_multi`)} * {f(o, `${ele}_enemyRes_multi`)}</span>
    })
  }
})

Object.entries(amplifyingReactions).forEach(([reaction, { variants }]) => {
  Object.entries(variants).forEach(([ele, baseMulti]) => {
    FormulaText[`${ele}_${reaction}_multi`] = (o) => <span>{baseMulti} * ( 100% + {f(o, "amplificative_dmg_")} + {f(o, `${reaction}_dmg_`)} )</span>
    Object.entries(hitTypes).forEach(([type, typeName]) => {
      Object.entries(hitMoves).forEach(([move, moveName]) => {
        FormulaText[`${ele}_${reaction}_${move}_${type}_multi`] = (o) => <span>{f(o, `${ele}_${move}_${type}_multi`)} * {f(o, `${ele}_${reaction}_multi`)}</span>
        FormulaText[`${ele}_${reaction}_${move}_${type}`] = (o) => <span>{f(o, "finalATK")} * {f(o, `${ele}_${reaction}_${move}_${type}_multi`)}</span>
      })
    })
  })
})
