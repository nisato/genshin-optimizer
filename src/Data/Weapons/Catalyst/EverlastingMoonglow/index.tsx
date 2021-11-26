import { WeaponData } from 'pipeline'
import { getTalentStatKey } from '../../../../Build/Build'
import ColorText from '../../../../Components/ColoredText'
import { Translate } from '../../../../Components/Translate'
import Stat from '../../../../Stat'
import { IWeaponSheet } from '../../../../Types/weapon'
import formula, { data } from './data'
import data_gen from './data_gen.json'
import icon from './Icon.png'
import iconAwaken from './AwakenIcon.png'

const heal_ = [10, 12.5, 15, 17.5, 20]

const weapon: IWeaponSheet = {
  ...data_gen as WeaponData,
  icon,
  iconAwaken,
  stats: stats => ({
    heal_: heal_[stats.weapon.refineIndex],
  }),
  document: [{
    fields: [
      {
        text: <Translate ns="weapon_EverlastingMoonglow" key18="name" />,
        formulaText: stats => <span>{data.hp_conv[stats.weapon.refineIndex]}% {Stat.printStat("finalHP", stats, true)} * {Stat.printStat(getTalentStatKey("elemental", stats) + "_multi", stats)}</span>,
        formula: formula.norm,
        variant: stats => stats.characterEle
      },
      {
        text: <ColorText color="warning">The normal damage increase is not currently being added to the character's normal damage as a singular damage number, pending future implemention.</ColorText>
      }
    ],
  }],
}
export default weapon