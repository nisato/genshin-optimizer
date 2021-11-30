
import { objectFromKeyMap } from "../Util/Util"
import type { CommutativeMonoidActions, ComputeFormula, Context, ContextFormula, Formula, Info, ReaderSpec, ReaderSpecNode, ReadFormula, SubscriptFormula } from "./type"

export const todo: Formula = { action: "const", value: NaN }

/** min( x1, x2, ... ) */
export function min(...values: (number | Formula)[]): ComputeFormula {
  return { action: "min", dependencies: intoDependencies(values) }
}
/** max( x1, x2, ... ) */
export function max(...values: (number | Formula)[]): ComputeFormula {
  return { action: "max", dependencies: intoDependencies(values) }
}
/** x1 + x2 + ... */
export function sum(...values: (number | Formula)[]): ComputeFormula {
  return { action: "sum", dependencies: intoDependencies(values) }
}
/** x1 * x2 * ... */
export function prod(...values: (number | Formula)[]): ComputeFormula {
  return { action: "prod", dependencies: intoDependencies(values) }
}
/** x / (x + c) */
export function frac(x: number | Formula, c: number | Formula): ComputeFormula {
  return { action: "frac", dependencies: intoDependencies([x, c]) }
}
/** threshold >= value ? addition : 0 */
export function threshold_add(value: Formula, threshold: number | Formula, addition: number | Formula): ComputeFormula {
  return { action: "threshold_add", dependencies: intoDependencies([value, threshold, addition]) }
}
/** list[index] */
export function subscript(index: Formula, list: number[], info?: Info): SubscriptFormula {
  if (list.some((value, i, array) => i !== 0 && array[i - 1] > value))
    // We use this fact primarily for *diffing*
    throw new Error("Formula Construction Failure: subscription list must be sorted in ascending order")
  return { action: "subscript", baseFormula: index, list, info }
}
export function res(base: number | Formula): ComputeFormula {
  return { action: "res", dependencies: intoDependencies([base]) }
}

export function makeReaders<T extends ReaderSpecNode>(context: T, prefix: string[] = []): ReaderSpec<T, ReadFormula> {
  return typeof context === "string"
    ? { action: "read", accumulation: context, path: prefix }
    : objectFromKeyMap(Object.keys(context) as string[], key => makeReaders(context[key], [...prefix, key])) as any
}
export function context(baseFormula: Formula, contexts: Context[]): ContextFormula {
  return { action: "context", baseFormula, contexts }
}

function intoDependencies(values: (number | Formula)[]): Formula[] {
  return values.map(value => typeof value === "number" ? { action: "const", value } : value)
}
