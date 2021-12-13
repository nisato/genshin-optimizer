import { ArtifactSlotKey } from 'pipeline';
// eslint-disable-next-line
import Worker from "worker-loader!./BuildWorkerWorker";
import Formula from '../Formula';
import { GetDependencies } from '../StatDependency';
import { StatKey } from '../Types/artifact';
import { Build, BuildRequest, SetFilter } from '../Types/Build';
import { ArtifactSetKey, SetNum, SlotKey } from '../Types/consts';
import { BonusStats } from '../Types/stats';
import { mergeStats } from '../Util/StatUtil';
import '../WorkerHack';
import { calculateTotalBuildNumber, pruneArtifacts } from "./Build";

const plotMaxPoints = 1500

onmessage = async (e: { data: BuildRequest }) => {
  const t1 = performance.now()
  const { splitArtifacts, setFilters, minFilters = {}, initialStats: stats, artifactSetEffects, maxBuildsToShow, optimizationTarget, plotBase } = e.data

  let target: (stats) => number, targetKeys: string[]
  if (typeof optimizationTarget === "string") {
    target = (stats) => stats[optimizationTarget]
    targetKeys = [optimizationTarget]
  } else {
    const targetFormula = await Formula.get(optimizationTarget)
    if (typeof targetFormula === "function")
      [target, targetKeys] = targetFormula(stats)
    else {
      postMessage({ progress: 0, timing: 0 }, undefined as any)
      postMessage({ builds: [], timing: 0 }, undefined as any)
      return
    }
    if (targetKeys.length === 1 && !plotBase) {
      // CAUTION: This optimization works only with monotonic dependencies
      const key = targetKeys[0]
      target = (stats) => stats[key]
    }
  }

  const artifactSetBySlot = Object.fromEntries(Object.entries(splitArtifacts).map(([key, artifacts]) =>
    [key, new Set(artifacts.map(artifact => artifact.setKey))]
  ))
  // modifierStats contains all modifiers that are applicable to the current build
  const modifierStats: BonusStats = {}
  Object.entries(artifactSetEffects).forEach(([set, effects]) =>
    Object.entries(effects).filter(([setNum, stats]) =>
      ("modifiers" in stats) && canApply(set, parseInt(setNum) as SetNum, artifactSetBySlot, setFilters)
    ).forEach(bonus => mergeStats(modifierStats, bonus[1]))
  )
  mergeStats(modifierStats, { modifiers: stats.modifiers ?? {} })

  const dependencies = GetDependencies(stats, modifierStats.modifiers, [...targetKeys, ...Object.keys(minFilters), ...(plotBase ? [plotBase] : [])]) as StatKey[]
  const oldCount = calculateTotalBuildNumber(splitArtifacts, setFilters)

  let prunedArtifacts = splitArtifacts, newCount = oldCount

  { // Prune artifact with strictly inferior (relevant) stats.
    // Don't prune artifact sets that are filtered
    const alwaysAccepted = setFilters.map(set => set.key) as any

    prunedArtifacts = Object.fromEntries(Object.entries(splitArtifacts).map(([key, values]) =>
      [key, pruneArtifacts(values, artifactSetEffects, new Set(dependencies), stats, maxBuildsToShow, new Set(alwaysAccepted))]))
    newCount = calculateTotalBuildNumber(prunedArtifacts, setFilters)
  }

  let buildCount = 0, skipped = oldCount - newCount, workerTime = 0
  let builds: Build[] = []
  const plotDataMap: Dict<string, number> = {}
  let bucketSize = 0.01

  const cleanupBuilds = () => {
    builds.sort((a, b) => (b.buildFilterVal - a.buildFilterVal))
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

  // Find the slot in the pruned artifacts with the lowest number of artifacts
  const leastSlot = Object.entries(prunedArtifacts).reduce((lowestKey, [key, arr]) => {
    return prunedArtifacts[key]!.length < prunedArtifacts[lowestKey].length ? key : lowestKey
  }, "flower") as unknown as ArtifactSlotKey

  const maxWorkers = (navigator.hardwareConcurrency || 4) - 1;
  const workers = [...Array(maxWorkers).keys()].map(workerIndex => {
    return new Promise((resolve) => {
      console.log("start worker", workerIndex)
      const worker = new Worker()
      worker.onmessage = ({ data }) => {
        if (data.buildCount) {
          const { buildCount: workerCount, builds: workerbuilds, plotDataMap: workerPlotDataMap } = data
          buildCount += workerCount
          if (workerbuilds.length)
            builds = builds.concat(workerbuilds)

          Object.entries(workerPlotDataMap as object).forEach(([index, value]) =>
            plotDataMap[index] = Math.max(value, plotDataMap[index] ?? -Infinity))
        }
        if (data.timing)
          workerTime += data.timing
        postMessage({ progress: buildCount, timing: performance.now() - t1, skipped }, undefined as any)
        if (data.finished)
          resolve(worker)
      }
      const { [leastSlot]: leastArr, ...rest } = prunedArtifacts
      const leastArrFiltered = leastArr?.filter((a, i) => (i % maxWorkers) === workerIndex)
      worker.postMessage({ dependencies, initialStats: stats, maxBuildsToShow, minFilters, optimizationTarget, plotBase, prunedArtifacts: { [leastSlot]: leastArrFiltered, ...rest }, setFilters, artifactSetEffects })
    })
  })
  const finWorkers = await Promise.all(workers)
  finWorkers.forEach(w => (w as any).terminate())

  cleanupBuilds()
  cleanupPlots()
  const t2 = performance.now()

  const plotData = plotBase
    ? Object.entries(plotDataMap)
      .map(([plotBase, optimizationTarget]) => ({ plotBase: parseInt(plotBase) * bucketSize, optimizationTarget }))
      .sort((a, b) => a.plotBase - b.plotBase)
    : undefined
  postMessage({ progress: buildCount, timing: t2 - t1, skipped }, undefined as any)
  postMessage({ builds, plotData, timing: t2 - t1, skipped }, undefined as any)
}

function canApply(set: ArtifactSetKey, num: SetNum, setBySlot: Dict<SlotKey, Set<ArtifactSetKey>>, filters: SetFilter): boolean {
  const otherNum = filters.reduce((accu, { key, num }) => key === set ? accu : accu + num, 0)
  const artNum = Object.values(setBySlot).filter(sets => sets.has(set)).length
  return otherNum + num <= 5 && num <= artNum
}
