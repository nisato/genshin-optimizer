import { assertUnreachable } from "../Util/Util"
import { Formula } from "./type"

export function formulaString(formula: Formula): string {
  const { action } = formula
  switch (action) {
    case "const": return `${formula.value}`
    case "read": return `Read[${formula.path}]`
    case "context": return `Context${formulaString(formula.baseFormula)}`
    case "subscript": return `Lookup${formulaString(formula.baseFormula)}`
    case "min": case "max":
      return `${action}( ${formula.dependencies.map(formulaString).join(", ")} )`
    case "sum":
      return `( ${formula.dependencies.map(formulaString).join(" + ")} )`
    case "prod":
      return `( ${formula.dependencies.map(formulaString).join(" * ")} )`
    case "frac":
      const [x, c] = formula.dependencies.map(formulaString)
      return `( ${x} / ( ${x} + ${c} ) )`
    case "threshold_add":
      const [value, threshold, addition] = formula.dependencies.map(formulaString)
      return `( ${value} >= ${threshold} ? ${addition} : 0 )`
    case "res":
      return `Res${formulaString(formula.dependencies[0])}`
    default: assertUnreachable(action)
  }
}
