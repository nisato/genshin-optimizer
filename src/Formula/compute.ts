import { forEachNodes } from "./internal"
import { allOperations, optimize } from "./optimization"
import { ConstantNode, Node, ReadNode } from "./type"

export function process(_formulas: Node[]): (lookup: (path: string[]) => number) => number[] {
  const formulas = optimize(_formulas)

  const outputLocations = new Map(formulas.map((f, i) => [f, i]))
  const inputLocations = new Map<ReadNode, number>()
  const constantLocations = new Map<ConstantNode, number>()
  const formulaLocations = new Map<Node, number>()
  const outputFromInput = new Map<Node, number>()

  forEachNodes(formulas, _ => { }, formula => {
    switch (formula.operation) {
      case "const":
        if (!constantLocations.has(formula))
          constantLocations.set(formula, constantLocations.size + 1)
        break
      case "read": {
        const index = inputLocations.size + 1
        inputLocations.set(formula, index)
        if (outputLocations.has(formula))
          outputFromInput.set(formula, index)
        break
      }
      case "string": case "stringSubscript":
        throw new Error(`Found ${formula.operation} node while processing formulas`)
      default:
        const index = outputLocations.get(formula) ?? (formulaLocations.size + 1)
        formulaLocations.set(formula, index)
    }
  })

  // [ ...output, ...input, ...const, ...intermediate ]

  const outputSize = outputLocations.size
  let offset = outputSize

  const inputOffset = offset
  offset += inputLocations.size

  const constantOffset = offset
  offset += constantLocations.size

  for (const [key, index] of formulaLocations)
    formulaLocations.set(key, index + offset)
  offset += formulaLocations.size

  const buffer: number[] = Array(offset).fill(NaN)
  for (const [{ value }, index] of constantLocations) buffer[index + constantOffset] = value
  const inputs = [...inputLocations].sort((a, b) => a[1] - b[1]).map(x => x[0].path)

  const locations = new Map([...outputLocations, ...inputLocations, ...constantLocations, ...formulaLocations])
  const commands: CompressedFormula[] = [...formulaLocations].map(([formula, outputIndex]) => {
    let operation: ((args: number[]) => number)
    switch (formula.operation) {
      case "const": case "read": case "data": throw new Error("Unreachable")
      case "subscript": {
        const list = formula.list
        operation = ([i]) => list[i]
        break
      }
      default: {
        const f = allOperations[formula.operation]
        operation = arg => f(arg)
      }
    }
    return {
      outputIndex, operation,
      operands: formula.operands.map(dep => locations.get(dep)!)
    }
  })
  const copyArray = [...outputFromInput].map(([output, inputIndex]) =>
    [locations.get(output)!, inputIndex + inputOffset])

  return lookup => {
    inputs.forEach((path, i) => buffer[i + inputOffset] = lookup(path))
    commands.forEach(({ outputIndex, operation: operation, operands }) =>
      buffer[outputIndex] = operation(operands.map(i => buffer[i])))
    copyArray.forEach(([o, i]) => buffer[o] = buffer[i])
    return buffer.slice(0, outputSize)
  }
}

interface CompressedFormula {
  outputIndex: number
  operation: (_: number[]) => number
  operands: number[]
}
