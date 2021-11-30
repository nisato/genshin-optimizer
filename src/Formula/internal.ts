import { Formula, Info } from "./type"

export function forEachFormulas(formulas: Formula[], topDown: (formula: Formula) => void, bottomUp: (formula: Formula) => void) {
  const visiting = new Set<Formula>(), visited = new Set<Formula>()

  function traverse(formula: Formula) {
    if (visited.has(formula)) return

    if (visiting.has(formula)) {
      console.error("Found cyclical dependency during formula traversal")
      return
    }
    visiting.add(formula)

    topDown(formula)

    if (formula.baseFormula) traverse(formula.baseFormula)
    formula.dependencies?.forEach(traverse)

    bottomUp(formula)

    visiting.delete(formula)
    visited.add(formula)
  }

  formulas.forEach(traverse)
}

export function mapFormulas(formulas: Formula[], topDownMap: (formula: Formula) => Formula, bottomUpMap: (current: Formula, orig: Formula) => Formula): Formula[] {
  const visiting = new Set<Formula>()
  const topDownMapped = new Map<Formula, Formula>()
  const bottomUpMapped = new Map<Formula, Formula>()

  function check(formula: Formula): Formula {
    let topDown = topDownMapped.get(formula)
    if (topDown) return topDown
    topDown = topDownMap(formula)

    let bottomUp = bottomUpMapped.get(topDown)
    if (bottomUp) return bottomUp

    if (visiting.has(topDown)) {
      console.error("Found cyclical dependency during formula mapping")
      return constant(NaN)
    }
    visiting.add(topDown)

    bottomUp = bottomUpMap(traverse(topDown), formula)

    visiting.delete(topDown)

    topDownMapped.set(formula, bottomUp)
    bottomUpMapped.set(topDown, bottomUp)
    return bottomUp
  }

  function traverse(formula: Formula): Formula {
    const baseFormula = formula.baseFormula && check(formula.baseFormula)
    const dependencies = formula.dependencies?.map(check)

    if (baseFormula !== formula.baseFormula || !arrayEqual(dependencies, formula.dependencies)) {
      const result = { ...formula }
      if (baseFormula) result.baseFormula = baseFormula
      if (dependencies) result.dependencies = dependencies
      return result
    }
    return formula
  }

  return formulas.map(check)
}

export function mapContextualFormulas(formulas: Formula[], topDownMap: (formula: Formula, contextId: ContextID) => [Formula, ContextID], bottomUpMap: (formula: Formula, orig: Formula, contextId: ContextID, origContextId: ContextID) => Formula): Formula[] {
  const visiting = new Set<Formula>()
  const topDownByContext = new Map<ContextID, Map<Formula, Formula>>()
  const bottomUpByContext = new Map<ContextID, Map<Formula, Formula>>()

  function check(formula: Formula, parentContextId: ContextID): Formula {
    let topDownMapping = topDownByContext.get(parentContextId)
    if (!topDownMapping) {
      topDownMapping = new Map()
      topDownByContext.set(parentContextId, topDownMapping)
    }

    let topDown = topDownMapping.get(formula)
    if (topDown) return topDown
    let topDownContextId: number
    [topDown, topDownContextId] = topDownMap(formula, parentContextId)

    if (visiting.has(topDown)) {
      console.error("Found cyclical dependency during formula mapping")
      return constant(NaN)
    }

    let bottomUpMapping = bottomUpByContext.get(topDownContextId)
    if (!bottomUpMapping) {
      bottomUpMapping = new Map()
      bottomUpByContext.set(topDownContextId, bottomUpMapping)
    }

    let bottomUp = bottomUpMapping.get(topDown)
    if (bottomUp) return bottomUp

    visiting.add(topDown)
    bottomUp = bottomUpMap(traverse(topDown, topDownContextId), formula, topDownContextId, parentContextId)
    visiting.delete(topDown)

    bottomUpMapping.set(topDown, bottomUp)
    topDownMapping.set(formula, bottomUp)
    return bottomUp
  }

  function traverse(formula: Formula, contextId: ContextID): Formula {
    const baseFormula = formula.baseFormula && check(formula.baseFormula, contextId)
    const dependencies = formula.dependencies?.map(f => check(f, contextId))

    if (baseFormula !== formula.baseFormula || !arrayEqual(dependencies, formula.dependencies)) {
      const result = { ...formula }
      if (baseFormula) result.baseFormula = baseFormula
      if (dependencies) result.dependencies = dependencies
      return result
    }
    return formula
  }

  return formulas.map(f => check(f, 0))
}

type ContextID = number

export function constant(value: number, info?: Info): Formula {
  return { action: "const", value, info }
}

function arrayEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
  if (a === undefined) return b === undefined
  if (b === undefined) return false

  return a.length === b.length && a.every((value, i) => value === b[i])
}
