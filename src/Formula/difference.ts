import { assertUnreachable } from "../Util/Util"
import { prod, sum, threshold_add } from "./utils"
import { constant, mapFormulas } from "./internal"
import { optimize } from "./optimization"
import { Node } from "./type"

const noDiff = constant(NaN) // A marker for non-differentiable formula

// Return a set of formula where the result of `formula` will increase if *every* value of *return value* increases.
export function finiteDifference(formulas: Node[], useDiff: (path: string[]) => boolean): Node[] {
  // The sign of the covariance between `formula` and `key`.
  //  - `+Infinity` if increasing `key` will increase `formula`,
  //  - `-Infinity` if increasing `key` will decrease `formula`,
  //  - `NaN` if it is not known/certain/unrelated.
  // We use `Infinity` and `-Infinity` here so that we can use `-sign` to flip the direction.
  // Also, mixing between `Infinity` and `-Infinity` correctly results in `NaN`.
  const signs = new Map(formulas.map(formula => [formula, Infinity]))
  function addSign(formula: Node, sign: number) {
    signs.set(formula, (signs.get(formula) ?? 0) + sign)
  }

  const exactEntries = new Set<Node>()
  const entries = new Map<Node, Node>()
  let hasIndeterminateEntries = false
  function addEntry(diff: Node, base: Node) {
    if (entries.has(base)) return

    const sign = signs.get(base)!
    if (sign > 0) entries.set(base, diff)
    else if (sign < 0) entries.set(base, prod(diff, -1)) // Flip the sign
    else hasIndeterminateEntries = true
  }

  const topLevelEntry = mapFormulas(formulas, formula => {
    // Setup the sign of each formula
    const sign = signs.get(formula)!
    const { operation } = formula
    switch (operation) {
      case "const": case "read":
        break
      case "frac": {
        const [x, c] = formula.operands // f = x / (x + c)
        // **CAUTION**
        // This assumes that x >= max(-c, 0).
        addSign(x, sign)
        addSign(c, -sign)
        break
      }
      case "min": case "max": case "add": case "mul": {
        // **CAUTION**
        // This assumes that every dependency of "prod" is positive, preserving the sign.
        for (const dependency of formula.operands)
          addSign(dependency, sign)
        break
      }
      case "subscript":
        // **CAUTION**
        // This assumes that the subscription list is sorted in an ascending order.
        addSign(formula.operands[0], sign)
        break
      case "data":
        throw new Error("Found data node while computing finite difference")
      case "threshold_add": {
        // **CAUTION**
        // This assumes that the `addition` term is positive.
        const [value, threshold, addition] = formula.operands
        addSign(value, sign)
        addSign(threshold, -sign)
        addSign(addition, sign)
        break
      }
      case "res": {
        const [value] = formula.operands
        addSign(value, -sign)
        break
      }
      default: assertUnreachable(operation)
    }

    return formula
  }, (diff, value) => {
    if (value.operands.every(dep => exactEntries.has(dep)))
      exactEntries.add(value)

    const { operation } = diff
    switch (operation) {
      case "const": return constant(0)
      case "data": return diff
      case "read":
        if (useDiff(diff.path)) {
          exactEntries.delete(value)
          return diff
        }
        return noDiff
      case "add": {
        const operandsDiff = diff.operands.filter(d => d !== noDiff)
        if (operandsDiff.length !== diff.operands.length) {
          // Breaking up the summations since we can't diff some entries here
          addEntry(sum(...operandsDiff), value)
          return noDiff
        }
        return diff
      }
      case "threshold_add": {
        const [v, threshold] = value.operands!
        const [_v, _threshold, additionDiff] = diff.operands
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
      case "mul": {
        const operands: Node[] = []
        const operandsDiff = diff.operands.filter((d, i) =>
          d !== noDiff
            ? (operands.push(value.operands![i]), true)
            : false)
        let nonZeroDiffCount = 0, lastNonZeroDiff = -1
        operandsDiff.forEach((d, i) => {
          if (d.operation !== "const" || d.value !== 0) {
            nonZeroDiffCount += 1
            lastNonZeroDiff = i
          }
        })
        let result: Node | undefined
        if (nonZeroDiffCount === 1)
          result = prod(...operands
            .map((value, i) => i === lastNonZeroDiff ? diff.operands[i] : value))

        if (operandsDiff.length !== diff.operands.length) {
          // Some entries are `noDiff`, add what we have and bail
          if (result) addEntry(result ?? noDiff, value)
          else operandsDiff.forEach((diff, i) => addEntry(diff, operands[i]))
          return noDiff
        }
        if (result) return result

        // **CAUTION**
        // This (break) assumes that every dependency of "prod" is positive.
        break
      }
      default: assertUnreachable(operation)
    }

    const operandsDiff = diff.operands
    value.operands.forEach((value, i) =>
      addEntry(operandsDiff![i], value))

    return noDiff
  })
  topLevelEntry.forEach((entry, i) => addEntry(entry, formulas[i]))

  if (hasIndeterminateEntries)
    console.error("Found indeterminate covariance when computing finite difference. Please contact support.")

  return [...new Set(optimize([...entries.values()]).filter(formula => formula.operation !== "const"))]
}
