
import type { FormulaContext, Formula, Reader, Context, Info } from "./type"
import { objectFromKeyMap } from "../Util/Util"

export const todo: Formula = { action: "const", value: NaN }

/** min( x1, x2, ... ) */
export function min(...values: (number | Formula)[]): Formula {
  return { action: "min", dependencies: intoDependencies(values) }
}
/** max( x1, x2, ... ) */
export function max(...values: (number | Formula)[]): Formula {
  return { action: "max", dependencies: intoDependencies(values) }
}
/** x1 + x2 + ... */
export function sum(...values: (number | Formula)[]): Formula {
  return { action: "sum", dependencies: intoDependencies(values) }
}
/** x1 * x2 * ... */
export function prod(...values: (number | Formula)[]): Formula {
  return { action: "prod", dependencies: intoDependencies(values) }
}
/** x / (x + c) */
export function frac(x: number | Formula, c: number | Formula): Formula {
  return { action: "frac", dependencies: intoDependencies([x, c]) }
}
/** threshold >= value ? addition : 0 */
export function threshold_add(value: Formula, threshold: number | Formula, addition: number | Formula): Formula {
  return { action: "threshold_add", dependencies: intoDependencies([value, threshold, addition]) }
}
/** list[index] */
export function subscript(index: Formula, list: number[], info?: Info): Formula {
  if (list.some((value, i, array) => i !== 0 && array[i - 1] > value))
    // We use this fact primarily for *diffing*
    throw new Error("Formula Construction Failure: subscription list must be sorted in ascending order")
  return { action: "subscript", baseFormula: index, list, info }
}
export function res(base: number | Formula): Formula {
  return { action: "res", dependencies: intoDependencies([base]) }
}

export function makeReaders<T extends FormulaContext>(context: T, prefix: string[] = []): Reader<T> {
  return context.action
    ? { action: "read", path: prefix } as any
    : objectFromKeyMap(Object.keys(context), key => makeReaders(context[key] as any, [...prefix, key]))
}
export function context(baseFormula: Formula, context: Context): Formula {
  return { action: "context", baseFormula, context }
}

function intoDependencies(values: (number | Formula)[]): Formula[] {
  return values.map(value => typeof value === "number" ? { action: "const", value } : value)
}
