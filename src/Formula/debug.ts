import { assertUnreachable } from "../Util/Util"
import { Node } from "./type"

export function formulaString(formula: Node): string {
  const { operation } = formula
  switch (operation) {
    case "const": case "string": return `${formula.value}`
    case "read": return `Read[${formula.path}]`
    case "data": return `Context${formulaString(formula.operands[0])}`
    case "subscript": case "stringSubscript": return `Lookup${formulaString(formula.operands[0])}`
    case "min": case "max":
      return `${operation}( ${formula.operands.map(formulaString).join(", ")} )`
    case "add":
      return `( ${formula.operands.map(formulaString).join(" + ")} )`
    case "mul":
      return `( ${formula.operands.map(formulaString).join(" * ")} )`
    case "frac":
      const [x, c] = formula.operands.map(formulaString)
      return `( ${x} / ( ${x} + ${c} ) )`
    case "threshold_add":
      const [value, threshold, addition] = formula.operands.map(formulaString)
      return `( ${value} >= ${threshold} ? ${addition} : 0 )`
    case "res":
      return `Res${formulaString(formula.operands[0])}`
    default: assertUnreachable(operation)
  }
}
