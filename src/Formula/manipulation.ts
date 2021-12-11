import { constant, mapFormulas } from "./internal";
import { ConstantNode, Node, ReadNode } from "./type";

export function mapReadNodes(formulas: Node[], map: (path: string[]) => ReadNode | ConstantNode): Node[] {
  return mapFormulas(formulas, f => f, f =>
    (f.operation === "read") ? map(f.path) : f)
}

export function replaceFormulas(formulas: Node[], map: (formula: Node) => number | undefined): Node[] {
  return mapFormulas(formulas, f => f, f => {
    const mapped = map(f)
    return mapped ? constant(mapped) : f
  })
}
