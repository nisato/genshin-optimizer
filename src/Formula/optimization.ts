import { resolve, assign } from "../Util/KeyPathUtil"
import { assertUnreachable } from "../Util/Util"
import { constant, mapContextualFormulas, mapFormulas } from "./internal"
import { Action, ComputeFormula, Constant, FormulaContext, Formula, Context } from "./type"

const allCommutativeMonoidActions = {
  min: (x: number[]): number => Math.min(...x),
  max: (x: number[]): number => Math.max(...x),
  sum: (x: number[]): number => x.reduce((a, b) => a + b, 0),
  prod: (x: number[]): number => x.reduce((a, b) => a * b, 1),
} as const
export const allActions = {
  ...allCommutativeMonoidActions,
  res: ([res]: number[]): number => {
    if (res < 0) return 1 - res / 2
    else if (res >= 0.75) return 1 / (res * 4 + 1)
    return 1 - res
  },
  frac: ([x, c]: number[]): number => x / (x + c),
  threshold_add: ([value, threshold, addition]: number[]): number => value >= threshold ? addition : 0,
} as const

const commutativeMonoidActionSet = new Set(Object.keys(allCommutativeMonoidActions) as (Formula["action"])[])

export function optimize(contextualFormulas: Formula[]): Formula[] {
  let formulas = constantFold(contextualFormulas)
  const state = { progress: false }

  do {
    state.progress = false

    const commonFormulas = findCommonFormulas(formulas)
    const flattened = flatten(formulas, commonFormulas, state)
    formulas = deduplicate(flattened, state)
  } while (state.progress)

  return formulas
}

function findCommonFormulas(formulas: Formula[]): Set<Formula> {
  // We need to reimplement the `mapFormulas` logic here since `mapFormulas` removes duplicates automatically.
  const visited = new Set<Formula>(), common = new Set<Formula>()

  function check(formula: Formula) {
    if (!formula.baseFormula && !formula.dependencies) return

    if (visited.has(formula)) {
      common.add(formula)
      return
    }
    visited.add(formula)

    if (formula.baseFormula) check(formula.baseFormula)
    formula.dependencies?.forEach(check);
  }

  formulas.forEach(check)
  return common
}

export function flatten(formulas: Formula[], fixedFormulas: Set<Formula>, state: { progress: boolean }): Formula[] {
  return mapFormulas(formulas, formula => formula, _formula => {
    if (!commutativeMonoidActionSet.has(_formula.action)) return _formula
    const formula = _formula as ComputeFormula
    const { action } = formula

    let flattened = false
    const dependencies = formula.dependencies.flatMap(dep => {
      return (dep.action === action && !fixedFormulas.has(dep)) ? (flattened = true, dep.dependencies) : [dep]
    })
    return flattened ? (state.progress = true, { ...formula, dependencies }) : formula
  })
}
function deduplicate(formulas: Formula[], state: { progress: boolean }): Formula[] {
  function elementCounts<T>(array: T[]): Map<T, number> {
    const result = new Map<T, number>()
    for (const value of array) result.set(value, (result.get(value) ?? 0) + 1)
    return result
  }
  function arrayFromCounts<T>(counts: Map<T, number>): T[] {
    return [...counts].flatMap(([dep, count]) => Array(count).fill(dep))
  }

  let common = {
    counts: new Map<Formula, number>(),
    formulas: new Set<Formula>(),
    action: "sum" as Action
  }

  while (true) {
    let next: typeof common | undefined

    const factored: ComputeFormula = { action: common.action, dependencies: arrayFromCounts(common.counts) }

    let candidatesByAction = new Map<Action, [ComputeFormula, Map<Formula, number>][]>()
    for (const action of Object.keys(allCommutativeMonoidActions))
      candidatesByAction.set(action, [])

    formulas = mapFormulas(formulas, _formula => {
      if (common.formulas.has(_formula)) {
        const formula = _formula as ComputeFormula
        const remainingCounts = new Map(common.counts)
        const dependencies = formula.dependencies.filter(dep => {
          const count = remainingCounts.get(dep)
          if (count) {
            remainingCounts.set(dep, count - 1)
            return false
          }
          return true
        })

        if (!dependencies.length)
          return factored
        dependencies.push(factored)
        return { ...formula, dependencies }
      }
      return _formula
    }, _formula => {
      if (!commutativeMonoidActionSet.has(_formula.action)) return _formula
      const formula = _formula as ComputeFormula

      if (next) {
        if (next.action === formula.action) {
          const currentCounts = elementCounts(formula.dependencies), commonCounts = new Map<Formula, number>()
          const nextCounts = next.counts
          let total = 0

          for (const [dependency, currentCount] of currentCounts.entries()) {
            const commonCount = Math.min(currentCount, nextCounts.get(dependency) ?? 0)
            if (commonCount) {
              commonCounts.set(dependency, commonCount)
              total += commonCount
            } else commonCounts.delete(dependency)
          }
          if (total > 1) {
            next.counts = commonCounts
            next.formulas.add(formula)
          }
        }
      } else {
        const candidates = candidatesByAction.get(formula.action)!
        const counts = elementCounts(formula.dependencies)

        for (const [candidate, candidateCounts] of candidates) {
          let total = 0

          const commonCounts = new Map<Formula, number>()
          for (const [dependency, candidateCount] of candidateCounts.entries()) {
            const count = Math.min(candidateCount, counts.get(dependency) ?? 0)
            if (count) {
              commonCounts.set(dependency, count)
              total += count
            }
          }
          if (total > 1) {
            next = {
              counts: commonCounts,
              formulas: new Set([formula, candidate]),
              action: formula.action
            }
            candidatesByAction.clear()
            break
          }
        }
        if (!next) candidates.push([formula, counts])
      }

      return formula
    })

    if (next) {
      common = next
      state.progress = true
    } else break
  }

  return formulas
}

function constantFold(formulas: Formula[]): Formula[] {
  const readFormulas: FormulaContext = {}
  const contexts = new Map<number, Context>()
  const prevContexts = new Map<number, number>()
  const nextContexts = new Map<number, Map<Context, number>>()

  let currentMaxContextId = 1

  return mapContextualFormulas(formulas, (formula, contextId) => {
    switch (formula.action) {
      case "context": {
        const { context, baseFormula } = formula
        let nextContext = nextContexts.get(contextId)
        if (!nextContext) {
          nextContext = new Map()
          nextContexts.set(contextId, nextContext)
        }

        let nextContextId = nextContext.get(context)
        if (!nextContextId) {
          nextContextId = ++currentMaxContextId
          nextContext.set(context, nextContextId)
          prevContexts.set(nextContextId, contextId)
          contexts.set(nextContextId, context)
        }
        return [baseFormula, nextContextId]
      }
      case "read": {
        const path = formula.path
        let id = contextId
        let context = contexts.get(id)
        while (context) {
          const value = resolve(context.formula, path)
          if (value) return [value, prevContexts.get(id)!]

          id = prevContexts.get(id)!
          context = contexts.get(id)
        }
      }
    }
    return [formula, contextId]
  }, formula => {
    const { action } = formula
    switch (action) {
      case "const": return formula
      case "read":
        let prev = resolve(readFormulas, formula.path)
        if (prev) return prev
        assign(readFormulas, formula.path, formula)
        return formula
      case "context": throw new Error("Unreachable")
      case "subscript":
        const baseFormula = formula.baseFormula
        if (baseFormula.action === "const")
          return constant(formula.list[baseFormula.value])
        return formula
      case "threshold_add":
        const [value, threshold, addition] = formula.dependencies
        if (value.action === "const" && threshold.action === "const")
          return value.value >= threshold.value ? addition : constant(0)
        break
      case "min": case "max": case "sum": case "prod":
        const f: (_: number[]) => number = allActions[action]
        const numericDependencies: number[] = []
        const formulaDependencies: Formula[] = formula.dependencies.filter(formula =>
          (formula.action !== "const") ? true : (numericDependencies.push(formula.value), false))
        const numericValue = f(numericDependencies)

        if (action === "prod" && numericValue === 0)
          // The only (practical) degenerate cases is
          //
          //  -  0 * ... = 0
          //
          // There are also
          //
          //  - max( infinity, ... ) = infinity
          //  - min( -infinity, ... ) = -infinity
          //  - infinity + ... = infinity
          //  - infinity * ... = infinity
          //
          // However, they will not appear under expected usage.
          return constant(0)

        if (numericValue !== f([])) // Skip vacuous numeric
          formulaDependencies.push(constant(numericValue))
        if (formulaDependencies.length <= 1)
          return formulaDependencies[0] ?? constant(f([]))
        return { ...formula, dependencies: formulaDependencies }
      case "frac": case "res": break
      default: assertUnreachable(action) // Exhaustive switch
    }
    if (formula.dependencies.every(({ action }) => action === "const")) {
      const dependencies = (formula.dependencies as Constant[]).map(({ value }) => value)
      return constant(allActions[action](dependencies))
    }
    return formula
  })
}
