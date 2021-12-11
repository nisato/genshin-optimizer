
import { objectFromKeyMap } from "../Util/Util"
import type { FormulaNode, Data, DataNode, Node, Info, ReaderSpec, ReaderSpecNode, ReadNode, SubscriptNode } from "./type"

export const todo: Node = { operation: "const", value: NaN, operands: [] }

/** min( x1, x2, ... ) */
export function min(...values: (number | Node)[]): FormulaNode {
  return { operation: "min", operands: intoOperands(values) }
}
/** max( x1, x2, ... ) */
export function max(...values: (number | Node)[]): FormulaNode {
  return { operation: "max", operands: intoOperands(values) }
}
/** x1 + x2 + ... */
export function sum(...values: (number | Node)[]): FormulaNode {
  return { operation: "add", operands: intoOperands(values) }
}
/** x1 * x2 * ... */
export function prod(...values: (number | Node)[]): FormulaNode {
  return { operation: "mul", operands: intoOperands(values) }
}
/** x / (x + c) */
export function frac(x: number | Node, c: number | Node): FormulaNode {
  return { operation: "frac", operands: intoOperands([x, c]) }
}
/** threshold >= value ? addition : 0 */
export function threshold_add(value: Node, threshold: number | Node, addition: number | Node): FormulaNode {
  return { operation: "threshold_add", operands: intoOperands([value, threshold, addition]) }
}
/** list[index] */
export function subscript(index: Node, list: number[], info?: Info): SubscriptNode {
  if (list.some((value, i, array) => i !== 0 && array[i - 1] > value))
    // We use this fact primarily for *diffing*
    throw new Error("Formula Construction Failure: subscription list must be sorted in ascending order")
  return { operation: "subscript", operands: [index], list, info }
}
export function res(base: number | Node): FormulaNode {
  return { operation: "res", operands: intoOperands([base]) }
}

export function makeReaders<T extends ReaderSpecNode>(context: T, prefix: string[] = []): ReaderSpec<T, ReadNode> {
  return typeof context === "string"
    ? { operation: "read", accumulation: context, path: prefix, operands: [] }
    : objectFromKeyMap(Object.keys(context) as string[], key => makeReaders(context[key], [...prefix, key])) as any
}
export function data(baseFormula: Node, contexts: Data[]): DataNode {
  return { operation: "data", operands: [baseFormula], data: contexts }
}

function intoOperands(values: (number | Node)[]): Node[] {
  return values.map(value => typeof value === "number" ? { operation: "const", value, operands: [] } : value)
}
