import type { ICachedArtifact, MainStatKey, SubstatKey } from "../Types/artifact"
import { allArtifactSets, allSlotKeys, ArtifactSetKey, SlotKey } from "../Types/consts"
import { finiteDifference } from "../Formula/difference"
import type { Formula } from "../Formula/type"
import { process } from "../Formula/compute"
import { forEachFormulas } from "../Formula/internal"

export function prune(artifactBySlots: StrictDict<SlotKey, ICachedArtifact[]>, setsToKeep: Map<ArtifactSetKey, number>, formulas: Formula[], numKeep: number): EntriesBySetID[/* slots */] {
  const diffFormulas = finiteDifference(formulas, path => !allArtifactSets.includes(path[0] as any))
  let diff: (values: ArtifactStat) => number[]
  {
    const processed = process(diffFormulas)
    diff = values => processed(path => values.get(path[0] as any)!)
  }

  const thresholds = new Map<ArtifactSetKey, number>(setsToKeep)
  // Essentially all artifact sets are guarded behind threshold.
  // We can leverage this to detect all active artifact set effects.
  forEachFormulas(diffFormulas, f => f, f => {
    if (f.action === "threshold_add") {
      const [value, threshold, _] = f.dependencies
      if (value.action === "read" && threshold.action === "const") {
        const set = value.path[0] as any
        if (allArtifactSets.includes(set))
          thresholds.set(set, Math.max(thresholds.get(set) ?? 0, threshold.value))
      }
    }
  })

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
        index: index++, ids: [artifact.id],
        setString, stat
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

export function iterate(entries: EntriesBySetID[/* slots */], setsToKeep: Map<ArtifactSetKey, number>, callback: (ids: ICachedArtifact["id"][], stat: ArtifactStat) => void) {
  const relevantSets = new Set(setsToKeep.keys())
  const artifactsBySlotSet = entries.map(entries => {
    const collected: EntriesBySetID = new Map()
    entries.forEach(({ setCount, entries }) => {
      const setCountString = getSetCountString(new Map([...setCount].filter(([k]) => relevantSets.has(k as any))))
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
      findPerm(i - 1, [j, ...indices], addSetCount(setCount, newSetCount))
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

function pruneInternal(list: EntriesBySetID, diff: (values: ArtifactStat) => number[], numKeep: number, setsToKeep: Map<ArtifactSetKey, number>, thresholds: Map<ArtifactSetKey, number>): EntriesBySetID {
  const sameSetPruned = [...list.values()]
    .filter(({ setCount }) => isSatisfiable(setCount, setsToKeep))
    .map(({ setCount, entries }) => {
      const maxSetCount = [...setCount.keys()].flatMap(k => k !== "_" ? [[k, 5] as const] : [])
      let values = entries.map(entry => ({
        greaterCount: 0, index: entry.index, entry,
        maxValue: diff(new Map([...entry.stat, ...maxSetCount]))
      }))

      values.sort((a, b) => lexCompare(b.maxValue, a.maxValue) || (b.index - a.index))
      values.forEach((current, i, array) => {
        for (let j = i - 1; j >= 0; j--) {
          const other = array[j]
          if (strictGreaterOrEqual(other.maxValue, current.maxValue)) {
            current.greaterCount += 1
            if (current.greaterCount + other.greaterCount >= numKeep) {
              current.greaterCount = numKeep
              return
            }
          }
        }
      })
      return {
        setCount,
        values: values
          .filter(({ greaterCount }) => greaterCount < numKeep)
          .map(({ entry, greaterCount }) => ({ entry, greaterCount }))
      }
    })
  const remaining = sameSetPruned.map(({ setCount, values }) => {
    const relevantSetCounts: Map<ArtifactSetKey, number>[] = []
    {
      const setCountArray = [...setCount]
      const current = new Map<ArtifactSetKey, number>()
      const perm = (i: number, remaining: number) => {
        if (i < 0) {
          relevantSetCounts.push(new Map(current))
          return
        }
        const [set, baseCount] = setCountArray[i]
        // Possible set effect triggers
        for (const i of [1, 2, 4]) {
          if (i < baseCount) continue
          if (set !== "_") current.set(set, i)
          perm(i - 1, remaining - i)
        }
      }

      perm(setCountArray.length - 1, 5)
    }

    return {
      setCount, values: values.map(({ greaterCount, entry }) => {
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
    for (let j = i - 1; j >= 0; j--) {
      const { values: entries1 } = remaining[i], { values: entries2 } = remaining[j]
      let removing1Entries = false, removing2Entries = false
      for (const entry1 of entries1) {
        const minimum1 = entry1.minimum
        for (const entry2 of entries2) {
          const minimum2 = entry2.minimum

          let found1 = false, found2 = false, removing1 = false, removing2 = false
          for (const maximal1 of entry1.maximal) {
            if (strictGreaterOrEqual(minimum2.value, maximal1.value)) {
              if (entry2.entry.index > entry1.entry.index || !strictGreaterOrEqual(maximal1.value, minimum2.value)) {
                found1 = true
                maximal1.greaterCount += 1
                if (maximal1.greaterCount + minimum2.greaterCount >= numKeep) {
                  removing1 = true
                  maximal1.greaterCount = numKeep
                }
              }
            }
          }
          for (const maximal2 of entry2.maximal) {
            if (strictGreaterOrEqual(minimum1.value, maximal2.value)) {
              if (entry1.entry.index > entry2.entry.index || !strictGreaterOrEqual(maximal2.value, minimum1.value)) {
                found2 = true
                maximal2.greaterCount += 1
                if (maximal2.greaterCount + minimum1.greaterCount >= numKeep) {
                  removing2 = true
                  maximal2.greaterCount = numKeep
                }

              }
            }
          }

          if (found1 ||
            (strictGreaterOrEqual(minimum2.value, minimum1.value) &&
              (entry2.entry.index > entry1.entry.index ||
                !strictGreaterOrEqual(minimum1.value, minimum2.value))))
            minimum1.greaterCount += 1
          if (found2 ||
            (strictGreaterOrEqual(minimum1.value, minimum2.value) &&
              (entry1.entry.index > entry2.entry.index ||
                !strictGreaterOrEqual(minimum2.value, minimum1.value))))
            minimum2.greaterCount += 1

          if (removing1) {
            entry1.maximal = entry1.maximal.filter(({ greaterCount }) => greaterCount < numKeep)
            removing1Entries = true
          }
          if (removing2) {
            entry2.maximal = entry2.maximal.filter(({ greaterCount }) => greaterCount < numKeep)
            removing2Entries = true
          }
        }
      }

      if (removing1Entries) remaining[i].values = entries1.filter(e => e.maximal.length > 0)
      if (removing2Entries) remaining[j].values = entries2.filter(e => e.maximal.length > 0)
    }
  }

  return new Map(remaining.map(({ setCount, values: entries }) =>
    [getSetCountString(setCount), {
      setCount, entries: entries
        .filter(entry => entry.maximal.some(({ greaterCount }) => greaterCount < numKeep))
        .map(({ entry }) => entry)
    }] as const)
    .filter(entries => entries.values.length))

}

function isSatisfiable(current: Map<ArtifactSetKey | "_", number>, limit: Map<ArtifactSetKey | "_", number>): boolean {
  let total = 0
  for (const [set, count] of current.entries()) total += Math.max(count, limit.get(set) ?? 0)
  for (const [set, count] of limit.entries()) if (!current.has(set)) total += count
  return total <= 5
}

function product(a: EntriesBySetID, b: EntriesBySetID): EntriesBySetID {
  let index = 0
  const result: EntriesBySetID = new Map()
  for (const { setCount: countA, entries: itemsA } of a.values()) {
    for (const { setCount: countB, entries: itemsB } of b.values()) {
      const setCount = addSetCount(countA, countB)
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
            setString,
          })
        }
      }
    }
  }
  return result
}

function mergeStat(a: ArtifactStat, b: ArtifactStat): ArtifactStat {
  const merged = new Map(a)
  for (const [statKey, value] of b.entries())
    merged.set(statKey, (merged.get(statKey) ?? 0) + value)
  return merged
}

function lexCompare(a: number[], b: number[]): number {
  const index = a.findIndex((value, i) => b[i] != value)
  return index !== -1 ? a[index] - b[index] : 0
}
function strictGreaterOrEqual(a: number[], b: number[]): boolean {
  return a.every((v, i) => v >= b[i])
}
function addSetCount<K>(a: Map<K, number>, b: Map<K, number>): Map<K, number> {
  const result = new Map(a)
  for (const [key, count] of b)
    result.set(key, (result.get(key) ?? 0) + count)
  return result
}

function getSetCountString(counts: Map<ArtifactSetKey | "_", number>): string {
  return [...counts.entries()]
    .filter(([_, value]) => value)
    .sort(([a], [b]) => a < b ? -1 : 1)
    .map(([set, num]) => `${set}${num}`)
    .join()
}

interface Entry {
  index: number
  ids: ICachedArtifact["id"][]
  setString: string
  stat: ArtifactStat
}
type EntriesBySetID = Map<string, {
  setCount: Map<ArtifactSetKey | "_", number>
  entries: Entry[]
}>
type ArtifactStat = Map<MainStatKey | SubstatKey | ArtifactSetKey, number>
