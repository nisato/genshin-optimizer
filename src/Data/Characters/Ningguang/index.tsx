import card from './Character_Ningguang_Card.jpg'
import thumb from './Icon.png'
import thumbSide from './IconSide.png'
import banner from './Banner.png'
import c1 from './Constellation_Piercing_Fragments.png'
import c2 from './Constellation_Shock_Effect.png'
import c3 from './Constellation_Majesty_be_the_Array_of_Stars.png'
import c4 from './Constellation_Exquisite_be_the_Jade,_Outshining_All_Beneath.png'
import c5 from './Constellation_Invincible_be_the_Jade_Screen.png'
import c6 from './Constellation_Grandeur_be_the_Seven_Stars.png'
import normal from './Talent_Sparkling_Scatter.png'
import skill from './Talent_Jade_Screen.png'
import burst from './Talent_Starshatter.png'
import passive1 from './Talent_Backup_Plan.png'
import passive2 from './Talent_Strategic_Reserve.png'
import passive3 from './Talent_Trove_of_Marvelous_Treasures.png'
import Stat from '../../../Stat'
import formula, { data } from './data'
import data_gen from './data_gen.json'
import { getTalentStatKey, getTalentStatKeyVariant } from '../../../Build/Build'
import { ICharacterSheet } from '../../../Types/character'
import { Translate } from '../../../Components/Translate'
import { conditionalHeader, plungeDocSection, talentTemplate } from '../SheetUtil'
import { WeaponTypeKey } from '../../../Types/consts'
import ColorText from '../../../Components/ColoredText'
const tr = (strKey: string) => <Translate ns="char_Ningguang_gen" key18={strKey} />
const char: ICharacterSheet = {
  name: tr("name"),
  cardImg: card,
  thumbImg: thumb,
  thumbImgSide: thumbSide,
  bannerImg: banner,
  rarity: data_gen.star,
  elementKey: "geo",
  weaponTypeKey: data_gen.weaponTypeKey as WeaponTypeKey,
  gender: "F",
  constellationName: tr("constellationName"),
  title: tr("title"),
  baseStat: data_gen.base,
  baseStatCurve: data_gen.curves,
  ascensions: data_gen.ascensions,
  talent: {
    formula,
    sheets: {
      auto: {
        name: tr("auto.name"),
        img: normal,
        sections: [
          {
            text: stats => <span><strong>Normal Attack</strong> Shoots gems that deal <ColorText color="geo">{stats.constellation >= 1 ? "AoE " : ""}Geo DMG</ColorText>. Upon hit, this grants Ningguang 1 Star Jade.</span>,
            fields: [{
              text: `Normal Attack DMG`,
              formulaText: stats => <span>{data.normal.hit[stats.tlvl.auto]}% {Stat.printStat(getTalentStatKey("normal", stats), stats)}</span>,
              formula: formula.normal.hit,
              variant: stats => getTalentStatKeyVariant("normal", stats),
            }, {
              canShow: stats => stats.constellation >= 1,
              text: <span>Gems do <ColorText color="geo">AoE Geo DMG</ColorText></span>,
            }]
          }, {
            text: <span><strong>Charged Attack</strong> Consumes a certain amount of stamina to fire off a giant gem that deals <ColorText color="geo">Geo DMG</ColorText>. If Ningguang has any Star Jades, unleashing a Charged Attack will cause the Star Jades to be fired at the enemy as well, dealing additional DMG.</span>,
            fields: [{
              text: `Charged Attack DMG`,
              formulaText: stats => <span>{data.charged.dmg[stats.tlvl.auto]}% {Stat.printStat(getTalentStatKey("charged", stats), stats)}</span>,
              formula: formula.charged.dmg,
              variant: stats => getTalentStatKeyVariant("charged", stats),
            }, {
              text: `DMG per Star Jade`,
              formulaText: stats => <span>{data.charged.jade[stats.tlvl.auto]}% {Stat.printStat(getTalentStatKey("charged", stats), stats)}</span>,
              formula: formula.charged.jade,
              variant: stats => getTalentStatKeyVariant("charged", stats),
            }, {
              text: `Stamina Cost`,
              value: stats => <span>50{(stats.ascension >= 1 ? <span>; With <b>Star Jade</b>: 0</span> : "")}</span>,
            }]
          },
          plungeDocSection(tr, formula, data),
        ],
      },
      skill: {
        name: tr("skill.name"),
        img: skill,
        sections: [{
          text: tr("skill.description"),
          fields: [{
            text: "Inherited HP",
            formulaText: stats => <span>{data.skill.inheri_hp[stats.tlvl.skill]}% {Stat.printStat("finalHP", stats)}</span>,
            formula: formula.skill.inheri_hp,
          }, {
            text: "Skill DMG",
            formulaText: stats => <span>{data.skill.dmg[stats.tlvl.skill]}% {Stat.printStat(getTalentStatKey("skill", stats), stats)}</span>,
            formula: formula.skill.dmg,
            variant: stats => getTalentStatKeyVariant("skill", stats),
          }, {
            text: "CD",
            value: "12s",
          }, {
            canShow: stats => stats.constellation >= 2,
            text: "Resets CD on shatter, every 6s",
          },]
        }],
      },
      burst: {
        name: tr("burst.name"),
        img: burst,
        sections: [{
          text: tr("burst.description"),
          fields: [{
            text: "DMG Per Gem",
            formulaText: stats => <span>{data.burst.dmg_per_gem[stats.tlvl.burst]}% {Stat.printStat(getTalentStatKey("burst", stats), stats)}</span>,
            formula: formula.burst.dmg_per_gem,
            variant: stats => getTalentStatKeyVariant("burst", stats),
          }, {
            text: "CD",
            value: "12s",
          }, {
            text: "Energy Cost",
            value: 40,
          }, {
            canShow: stats => stats.constellation >= 6,
            text: "Star Jade gained",
            value: "7",
          }]
        }],
      },
      passive1: talentTemplate("passive1", tr, passive1),
      passive2: {
        name: tr("passive2.name"),
        img: passive2,
        sections: [{
          text: tr("passive2.description"),
          conditional: { // StrategicReserve
            key: "a4",
            canShow: stats => stats.ascension >= 4,
            partyBuff: "partyAll",
            header: conditionalHeader("passive2", tr, passive2),
            description: tr("passive2.description"),
            name: <span>Passing through <b>Jade Screen</b></span>,
            stats: { geo_dmg_: 12 },
            fields: [{
              text: "Duration",
              value: "10s",
            }]
          },
        }],
      },
      passive3: talentTemplate("passive3", tr, passive3),
      constellation1: talentTemplate("constellation1", tr, c1),
      constellation2: talentTemplate("constellation2", tr, c2),
      constellation3: talentTemplate("constellation3", tr, c3, "burstBoost"),
      constellation4: {
        name: tr("constellation4.name"),
        img: c4,
        sections: [{
          text: tr("constellation4.description"),
          conditional: { // ExquisiteBeTheJade
            key: "c4",
            canShow: stats => stats.constellation >= 4,
            partyBuff: "partyAll",
            header: conditionalHeader("constellation4", tr, c4),
            description: tr("constellation4.description"),
            name: <span>Allies within 10m of <b>Jade Screen</b></span>,
            fields: [{
              text: "Elemental DMG received",//TODO: elemental dmg reduction
              value: -10,
              unit: "%"
            }]
          }
        }],
      },
      constellation5: talentTemplate("constellation5", tr, c5, "skillBoost"),
      constellation6: talentTemplate("constellation6", tr, c6),
    },
  },
};
export default char;
