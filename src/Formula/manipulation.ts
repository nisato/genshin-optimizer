import { constant, mapFormulas } from "./internal";
import { Constant, Formula, ReadFormula } from "./type";

export function mapReadFormulas(formulas: Formula[], map: (path: string[]) => ReadFormula | Constant): Formula[] {
  return mapFormulas(formulas, f => f, f =>
    (f.action === "read") ? map(f.path) : f)
}

export function replaceFormulas(formulas: Formula[], map: (formula: Formula) => number | undefined): Formula[] {
  return mapFormulas(formulas, f => f, f => {
    const mapped = map(f)
    return mapped ? constant(mapped) : f
  })
}
