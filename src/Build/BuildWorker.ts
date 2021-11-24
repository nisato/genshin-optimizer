import '../WorkerHack'
import { ICachedArtifact } from '../Types/artifact';
import { allArtifactSets, ArtifactSetKey, SetNum, SlotKey } from '../Types/consts';
import { iterate, prune, isSatisfiable } from './iterate'
import { Formula } from '../Formula/type';
import { constantFold } from '../Formula/optimization';
import { process } from '../Formula/compute';
import { SetFilter } from '../Types/Build';
import { forEachFormulas, mapFormulas } from '../Formula/internal';

const plotMaxPoints = 1500

onmessage = async ({ data }: { data: BuildRequest }) => {
  const t1 = performance.now()
  const { splitArtifacts, minFilters, maxBuildsToShow, optimizationTarget, plotBase } = data
  const setFilters = new Map(data.setFilters.flatMap(({ key, num }) => key ? [[key, num] as const] : []))

  const { formulas, thresholds } = prepareFormula(constantFold([optimizationTarget, ...minFilters.map(({ formula }) => formula), ...(plotBase ? [plotBase] : [])]), setFilters)
  const sortingFormula = plotBase ? formulas.slice(0, -1) : formulas
  const minimum = [-Infinity, ...minFilters.map(({ value }) => value)]
  const compute = process(formulas)

  const pruned = prune(data.splitArtifacts, sortingFormula, setFilters, thresholds, maxBuildsToShow)

  // TODO: old count & new count

  let buildCount = 0, skipped = 0
  let builds: { value: number, ids: string[] }[] = [], threshold = -Infinity
  const plotDataMap: Dict<string, number> = {}
  let bucketSize = 0.01

  const cleanupBuilds = () => {
    builds.sort((a, b) => (b.value - a.value))
    builds.splice(maxBuildsToShow)
  }

  const cleanupPlots = () => {
    const entries = Object.entries(plotDataMap)
    if (entries.length > plotMaxPoints) {
      const multiplier = Math.pow(2, Math.ceil(Math.log2(entries.length / plotMaxPoints)))
      bucketSize *= multiplier
      for (const [x, y] of entries) {
        delete plotDataMap[x]
        const index = Math.round(parseInt(x) / multiplier)
        plotDataMap[index] = Math.max(plotDataMap[index] ?? -Infinity, y)
      }
    }
  }

  const plotBaseIndex = minimum.length

  iterate(pruned, setFilters, (ids, stats) => {
    if (!(++buildCount % 10000)) {
      if (builds.length > 10000) {
        cleanupBuilds()
        threshold = builds[builds.length - 1].value
      }
      cleanupPlots()
      postMessage({ progress: buildCount, timing: performance.now() - t1, skipped }, undefined as any)
    }

    const values = compute(path => stats[path[0] as any])
    if (minimum.some((min, i) => min > values[i])) return

    if (plotBase) {
      const index = Math.round(values[plotBaseIndex] / bucketSize)
      plotDataMap[index] = Math.max(values[0], plotDataMap[index] ?? -Infinity)
    }

    if (values[0] >= threshold)
      builds.push({ value: values[0], ids })
  })

  cleanupBuilds()
  cleanupPlots()

  const t2 = performance.now()

  const plotData = plotBase
    ? Object.entries(plotDataMap)
      .map(([plotBase, optimizationTarget]) => ({ plotBase: parseInt(plotBase) * bucketSize, optimizationTarget }))
      .sort((a, b) => a.plotBase - b.plotBase)
    : undefined

  const artifactMap = new Map(Object.values(splitArtifacts).flatMap(arts => arts.map(art => [art.id, art] as const)))

  postMessage({ progress: buildCount, timing: t2 - t1, skipped }, undefined as any)
  postMessage({
    builds: builds.map(({ value, ids }) => ({
      buildFilterVal: value,
      artifacts: ids.map(id => artifactMap.get(id)!),
    })), plotData, timing: t2 - t1, skipped
  }, undefined as any)
}

export function prepareFormula(formulas: Formula[], setsToKeep: Map<ArtifactSetKey, number>): { formulas: Formula[], thresholds: Map<ArtifactSetKey, Set<number>> } {
  const thresholds = new Map<ArtifactSetKey, Set<number>>()
  formulas = mapFormulas(formulas, f => {
    if (f.action === "read") {
      // We have nothing to apply non-artifact values at this point.
      if (f.path[0] !== "art") return { action: "const", value: 0 }
      return { action: "read", path: f.path.slice(1) }
    } else if (f.action === "threshold_add") {
      const [value, threshold, _] = f.dependencies
      if (value.action === "read" && threshold.action === "const") {
        const set = value.path[0] as any
        if (allArtifactSets.includes(set)) {
          if (!isSatisfiable(new Map([[set, threshold.value]]), setsToKeep))
            return { action: "const", value: 0 }

          if (!thresholds.has(set)) thresholds.set(set, new Set())
          thresholds.get(set)!.add(threshold.value)
        }
      }
    }
    return f
  }, f => f)

  return { formulas, thresholds }
}

export interface BuildRequest {
  splitArtifacts: StrictDict<SlotKey, ICachedArtifact[]>
  setFilters: SetFilter
  minFilters: { formula: Formula, value: number }[],
  maxBuildsToShow: number,
  optimizationTarget: Formula,
  plotBase?: Formula
}
