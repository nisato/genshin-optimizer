import { assertUnreachable } from "../Util/Util"
import { prod, sum, threshold_add } from "./utils"
import { constant, mapFormulas } from "./internal"
import { optimize } from "./optimization"
import { Formula } from "./type"

const noDiff = constant(NaN) // A marker for non-differentiable formula

// Return a set of formula where the result of `formula` will increase if *every* value of *return value* increases.
export function finiteDifference(formulas: Formula[], useDiff: (path: string[]) => boolean): Formula[] {
  // The sign of the covariance between `formula` and `key`.
  //  - `+Infinity` if increasing `key` will increase `formula`,
  //  - `-Infinity` if increasing `key` will decrease `formula`,
  //  - `NaN` if it is not known/certain/unrelated.
  // We use `Infinity` and `-Infinity` here so that we can use `-sign` to flip the direction.
  // Also, mixing between `Infinity` and `-Infinity` correctly results in `NaN`.
  const signs = new Map(formulas.map(formula => [formula, Infinity]))
  function addSign(formula: Formula, sign: number) {
    signs.set(formula, (signs.get(formula) ?? 0) + sign)
  }

  const exactEntries = new Set<Formula>()
  const entries = new Map<Formula, Formula>()
  let hasIndeterminateEntries = false
  function addEntry(diff: Formula, base: Formula) {
    if (entries.has(base)) return

    const sign = signs.get(base)!
    if (sign > 0) entries.set(base, diff)
    else if (sign < 0) entries.set(base, prod(diff, -1)) // Flip the sign
    else hasIndeterminateEntries = true
  }

  const topLevelEntry = mapFormulas(formulas, formula => {
    // Setup the sign of each formula
    const sign = signs.get(formula)!
    const { action } = formula
    switch (action) {
      case "const": case "read":
        break
      case "frac": {
        const [x, c] = formula.dependencies // f = x / (x + c)
        // **CAUTION**
        // This assumes that x >= max(-c, 0).
        addSign(x, sign)
        addSign(c, -sign)
        break
      }
      case "min": case "max": case "sum": case "prod": {
        // **CAUTION**
        // This assumes that every dependency of "prod" is positive, preserving the sign.
        for (const dependency of formula.dependencies)
          addSign(dependency, sign)
        break
      }
      case "subscript":
        // **CAUTION**
        // This assumes that the subscription list is sorted in an ascending order.
        addSign(formula.baseFormula, sign)
        break
      case "context":
        throw new Error("Found context formula while computing finite difference")
      case "threshold_add": {
        // **CAUTION**
        // This assumes that the `addition` term is positive.
        const [value, threshold, addition] = formula.dependencies
        addSign(value, sign)
        addSign(threshold, -sign)
        addSign(addition, sign)
        break
      }
      case "res": {
        const [value] = formula.dependencies
        addSign(value, -sign)
        break
      }
      default: assertUnreachable(action)
    }

    return formula
  }, (diff, value) => {
    if ((value.dependencies?.every(dep => exactEntries.has(dep)) ?? true) &&
      ((value.baseFormula && exactEntries.has(value.baseFormula)) ?? true))
      exactEntries.add(value)

    const { action } = diff
    switch (action) {
      case "const": return constant(0)
      case "context": return diff
      case "read":
        if (useDiff(diff.path)) {
          exactEntries.delete(value)
          return diff
        }
        return noDiff
      case "sum": {
        const dependenciesDiff = diff.dependencies.filter(d => d !== noDiff)
        if (dependenciesDiff.length !== diff.dependencies.length) {
          // Breaking up the summations since we can't diff some entries here
          addEntry(sum(...dependenciesDiff), value)
          return noDiff
        }
        return diff
      }
      case "threshold_add": {
        const [v, threshold] = value.dependencies!
        const [_v, _threshold, additionDiff] = diff.dependencies
        if (exactEntries.has(v) && exactEntries.has(threshold))
          return threshold_add(v, threshold, additionDiff)
        break
      }
      case "frac": case "res":
      case "max": case "min":
        break
      // **CAUTION**
      // This (break) assumes that the `list` in "subscript" is sorted in an ascending order.
      case "subscript":
        break
      case "prod": {
        const dependencies: Formula[] = []
        const dependenciesDiff = diff.dependencies.filter((d, i) =>
          d !== noDiff
            ? (dependencies.push(value.dependencies![i]), true)
            : false)
        let nonZeroDiffCount = 0, lastNonZeroDiff = -1
        dependenciesDiff.forEach((d, i) => {
          if (d.action !== "const" || d.value !== 0) {
            nonZeroDiffCount += 1
            lastNonZeroDiff = i
          }
        })
        let result: Formula | undefined
        if (nonZeroDiffCount === 1)
          result = prod(...dependencies
            .map((value, i) => i === lastNonZeroDiff ? diff.dependencies[i] : value))

        if (dependenciesDiff.length !== diff.dependencies.length) {
          // Some entries are `noDiff`, add what we have and bail
          if (result) addEntry(result ?? noDiff, value)
          else dependenciesDiff.forEach((diff, i) => addEntry(diff, dependencies[i]))
          return noDiff
        }
        if (result) return result

        // **CAUTION**
        // This (break) assumes that every dependency of "prod" is positive.
        break
      }
      default: assertUnreachable(action)
    }

    const dependenciesDiff = diff.dependencies
    value.dependencies?.forEach((value, i) =>
      addEntry(dependenciesDiff![i], value))

    const baseFormulaDiff = diff.baseFormula
    if (baseFormulaDiff)
      addEntry(baseFormulaDiff, value.baseFormula!)

    return noDiff
  })
  topLevelEntry.forEach((entry, i) => addEntry(entry, formulas[i]))

  if (hasIndeterminateEntries)
    console.error("Found indeterminate covariance when computing finite difference. Please contact support.")

  return [...new Set(optimize([...entries.values()]).filter(formula => formula.action !== "const"))]
}
