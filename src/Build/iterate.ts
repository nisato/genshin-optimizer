import type { ICachedArtifact, MainStatKey, SubstatKey } from "../Types/artifact"
import { allArtifactSets, ArtifactSetKey, SlotKey } from "../Types/consts"
import { finiteDifference } from "../Formula/difference"
import type { Node } from "../Formula/type"
import { process } from "../Formula/compute"
import { forEachNodes } from "../Formula/internal"

export function prune(artifactBySlots: StrictDict<SlotKey, ICachedArtifact[]>, formulas: Node[], setsToKeep: SetCount, thresholds: Map<ArtifactSetKey, Set<number>>, numKeep: number): EntriesBySetID[/* slots */] {
  const diffFormulas = finiteDifference(formulas, path => !allArtifactSets.includes(path[0] as any))
  let diff: (values: ArtifactStat) => number[]
  {
    const processed = process(diffFormulas)
    diff = values => processed(path => values.get(path[0] as any)!)
  }

  let groups: EntriesBySetID[] = [] // entries = groups[slot][setCount]

  for (const artifacts of Object.values(artifactBySlots)) {
    const artifactsBySetID: EntriesBySetID = new Map()
    let index = 0
    for (const artifact of artifacts) {
      const setCount = new Map<ArtifactSetKey | "_", number>()
      const setKey = artifact.setKey, stat: ArtifactStat = new Map()

      stat.set(artifact.mainStatKey, artifact.mainStatVal)
      artifact.substats.forEach(({ key, value }) => key && (stat.set(key, value)))

      if (thresholds.has(setKey)) {
        stat.set(setKey, 1)
        setCount.set(setKey, 1)
      } else setCount.set("_", 1)

      const setString = getSetCountString(setCount)

      if (!artifactsBySetID.has(setString))
        artifactsBySetID.set(setString, { setCount, entries: [] })
      artifactsBySetID.get(setString)!.entries.push({
        index: index++, ids: [artifact.id], stat
      })
    }
    groups.push(pruneInternal(artifactsBySetID, diff, numKeep, setsToKeep, thresholds))
  }

  groups.sort((a, b) => a.size - b.size)
  while (groups.length >= 2 && groups[0].size * groups[1].size <= 50000) {
    const [a, b] = groups.splice(0, 2)
    groups.push(pruneInternal(product(a, b), diff, numKeep, setsToKeep, thresholds))
    groups.sort((a, b) => a.size - b.size)
  }
  return groups
}

export function iterate(entries: EntriesBySetID[/* slots */], setsToKeep: SetCount, callback: (ids: ICachedArtifact["id"][], stat: ArtifactStat) => void) {
  const relevantSets = new Set(setsToKeep.keys())
  const artifactsBySlotSet = entries.map(entries => {
    const collected: EntriesBySetID = new Map()
    entries.forEach(({ setCount, entries }) => {
      const setCountString = getSetCountString([...setCount].filter(([k]) => relevantSets.has(k as any)))
      collected.get(setCountString)!.entries = [...collected.get(setCountString)?.entries ?? [], ...entries]
    })
    return [...collected.values()]
  })

  const permIndices: number[][] = []
  const findPerm = (i: number, indices: number[], setCount: Map<ArtifactSetKey | "_", number>) => {
    if (i < 0) {
      for (const [key, minCount] of setsToKeep)
        if (setCount[key] < minCount) return
      permIndices.push(indices)
      return
    }

    artifactsBySlotSet[i].forEach(({ setCount: newSetCount }, j) => {
      findPerm(i - 1, [j, ...indices], sumSetCount(setCount, newSetCount))
    })
  }

  findPerm(artifactsBySlotSet.length - 1, [], new Map())

  for (const indices of permIndices) {
    const perm = (i: number, ids: string[], stat: ArtifactStat) => {
      if (i < 0) {
        callback(ids, stat)
        return
      }
      for (const artifact of artifactsBySlotSet[i][indices[i]].entries)
        perm(i - 1, [...ids, ...artifact.ids], mergeStat(stat, artifact.stat))
    }
    perm(artifactsBySlotSet.length - 1, [], new Map)
  }
}

function pruneInternal(list: EntriesBySetID, diff: (values: ArtifactStat) => number[], numKeep: number, setsToKeep: SetCount, thresholds: Map<ArtifactSetKey, Set<number>>): EntriesBySetID {
  const sameSetPruned = [...list.values()]
    .filter(({ setCount }) => isSatisfiable(setCount, setsToKeep))
    .map(({ setCount, entries }) => {
      const maxSetCount = [...setCount].flatMap(([k]) => k !== "_" ? [[k, 5] as const] : [])
      let values = entries.map(entry => ({
        greaterCount: 0, index: entry.index, entry,
        maxValue: diff(new Map([...entry.stat, ...maxSetCount]))
      }))

      values.sort((a, b) => lexCompare(b.maxValue, a.maxValue) || (b.index - a.index))
      values.forEach((current, i, array) => {
        for (let j = i - 1; j >= 0; j--) {
          const other = array[j]
          if (strictlyGreater(other.maxValue, j, current.maxValue, i)) {
            current.greaterCount += 1
            if (current.greaterCount + other.greaterCount >= numKeep) {
              current.greaterCount = numKeep
              return
            }
          }
        }
      })
      return {
        setCount, values: values
          .filter(({ greaterCount }) => greaterCount < numKeep)
          .map(({ entry, greaterCount }) => ({ entry, greaterCount }))
      }
    })
  const remaining = sameSetPruned.map(({ setCount, values }) => {
    const relevantSetCounts: SetCount[] = []
    {
      const setCountArray = [...setCount]
      const current: SetCount = new Map()
      const perm = (i: number, remaining: number) => {
        if (i < 0) {
          relevantSetCounts.push(new Map(current))
          return
        }
        const [set, baseCount] = setCountArray[i]
        // Possible set effect triggers
        for (const j of new Set([baseCount, ...thresholds.get(set as ArtifactSetKey) ?? []])) {
          if (j < baseCount || j > remaining) continue
          if (set !== "_") current.set(set, j)
          perm(i - 1, remaining - j)
        }
      }

      perm(setCountArray.length - 1, 5)
    }

    return {
      setCount, entries: values.map(({ greaterCount, entry }) => {
        const values = relevantSetCounts.map(set =>
          diff(new Map([...entry.stat, ...set])))

        const minimum = { value: diff(entry.stat), greaterCount }
        let maximal: { value: number[], greaterCount: number }[] = []
        for (const value of values) {
          if (maximal.every(({ value: otherValue }) => value.some((v, i) => v > otherValue[i]))) {
            maximal = maximal.filter(({ value: otherValue }) =>
              value.some((v, i) => otherValue[i] > v))
            maximal.push({ value, greaterCount })
          }
        }

        return { entry, maximal, minimum }
      })
    }
  })
  for (let i = 0; i < remaining.length; i++) {
    for (let j = 0; j < remaining.length; j++) {
      if (i === j) continue
      const { entries: entries1 } = remaining[i], { entries: entries2 } = remaining[j]

      let removeEntry = false
      for (const entry1 of entries1) {
        const minimum1 = entry1.minimum

        for (const entry2 of entries2) {
          const minimum2 = entry2.minimum

          let foundGreater = false, removeMaximal = false
          for (const maximal1 of entry1.maximal) {
            if (strictlyGreater(minimum2.value, j, maximal1.value, i)) {
              foundGreater = true
              maximal1.greaterCount += 1
              if (maximal1.greaterCount + minimum2.greaterCount >= numKeep) {
                removeMaximal = true
                maximal1.greaterCount = numKeep
              }
            }
          }

          if (foundGreater || strictlyGreater(minimum2.value, j, minimum1.value, i))
            minimum1.greaterCount += 1

          if (removeMaximal) {
            entry1.maximal = entry1.maximal.filter(({ greaterCount }) => greaterCount < numKeep)
            if (!entry1.maximal.length) {
              removeEntry = true
              break
            }
          }
        }
      }

      if (removeEntry) remaining[i].entries = entries1.filter(e => e.maximal.length > 0)
    }
  }

  return new Map(remaining
    .filter(({ entries }) => entries.length)
    .map(({ setCount, entries }) => [
      getSetCountString(setCount), {
        setCount, entries: entries
          .map(({ entry }) => entry)
      }
    ] as const))
}

function product(a: EntriesBySetID, b: EntriesBySetID): EntriesBySetID {
  let index = 0
  const result: EntriesBySetID = new Map()
  for (const { setCount: countA, entries: itemsA } of a.values()) {
    for (const { setCount: countB, entries: itemsB } of b.values()) {
      const setCount = sumSetCount(countA, countB)
      const setString = getSetCountString(setCount)

      if (!result.has(setString))
        result.set(setString, { setCount, entries: [] })
      const { entries } = result.get(setString)!
      for (const itemA of itemsA) {
        for (const itemB of itemsB) {
          entries.push({
            index: index++,
            ids: [...itemA.ids, ...itemB.ids],
            stat: mergeStat(itemA.stat, itemB.stat),
          })
        }
      }
    }
  }
  return result
}

function mergeStat(a: ArtifactStat, b: ArtifactStat): ArtifactStat {
  const merged = new Map(a)
  for (const [statKey, value] of b)
    merged.set(statKey, (merged.get(statKey) ?? 0) + value)
  return merged
}

/** A well ordering comparison that ensures that either a < b or they are incomparable */
function lexCompare(a: number[], b: number[]): number {
  const index = a.findIndex((value, i) => b[i] != value)
  return index !== -1 ? a[index] - b[index] : 0
}
/** Partial ordering */
function strictlyGreater(a: number[], aIndex: number, b: number[], bIndex: number): boolean {
  return a.every((v, i) => v >= b[i]) && (aIndex >= bIndex || a.some((v, i) => v > b[i]))
}

function getSetCountString(counts: Iterable<[ArtifactSetKey | "_", number]>): string {
  return [...counts]
    .filter(([_, value]) => value)
    .sort(([a], [b]) => a < b ? -1 : 1)
    .map(([set, num]) => `${set}${num}`)
    .join()
}

export function isSatisfiable(current: Map<ArtifactSetKey | "_", number>, limit: Map<ArtifactSetKey | "_", number>): boolean {
  let total = 0
  for (const [set, count] of current) total += Math.max(count, limit.get(set) ?? 0)
  for (const [set, count] of limit) if (!current.has(set)) total += count
  return total <= 5
}
function sumSetCount<K>(a: Iterable<[K, number]>, b: Iterable<[K, number]>): Map<K, number> {
  const result = new Map(a)
  for (const [key, count] of b)
    result.set(key, (result.get(key) ?? 0) + count)
  return result
}
function minSetCount<K>(a: Map<K, number>, b: Iterable<[K, number]>): Map<K, number> {
  const result = new Map<K, number>()
  for (const [key, bCount] of b) {
    const aCount = a.get(key)
    if (aCount) result.set(key, Math.min(aCount, bCount))
  }
  return result
}
interface Entry {
  index: number
  ids: ICachedArtifact["id"][]
  stat: ArtifactStat
}
type EntriesBySetID = Map<string, {
  setCount: Map<ArtifactSetKey | "_", number>
  entries: Entry[]
}>
type SetCount = Map<ArtifactSetKey, number>
type ArtifactStat = Map<MainStatKey | SubstatKey | ArtifactSetKey, number>
