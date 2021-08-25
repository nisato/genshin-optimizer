import { WeaponData } from 'pipeline'
import { IConditionals } from '../../../../Types/IConditional'
import { IWeaponSheet } from '../../../../Types/weapon'
import data_gen from './data_gen.json'
import img from './Weapon_Blackcliff_Warbow.png'

const atk_s = [12, 15, 18, 21, 24]
const conditionals: IConditionals = {
  pa: {
    name: "Opponents Defeated",
    maxStack: 3,
    stats: stats => ({
      atk_: atk_s[stats.weapon.refineIndex]
    })
  }
}
const weapon: IWeaponSheet = {
  ...data_gen as WeaponData,
  img,
  conditionals,
  document: [{
    conditional: conditionals.pa
  }],
}
export default weapon