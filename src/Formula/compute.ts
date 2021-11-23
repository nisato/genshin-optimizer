import { forEachFormulas } from "./internal"
import { allActions, optimize } from "./optimization"
import { Constant, Formula, ReadFormula } from "./type"

export function process(_formulas: Formula[]): (lookup: (path: string[]) => number) => number[] {
    const formulas = optimize(_formulas)

    const outputLocations = new Map(formulas.map((f, i) => [f, i]))
    const inputLocations = new Map<ReadFormula, number>()
    const constantLocations = new Map<Constant, number>()
    const formulaLocations = new Map<Formula, number>()
    const outputFromInput = new Map<Formula, number>()

    forEachFormulas(formulas, _ => { }, formula => {
        switch (formula.action) {
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
        let action: ((args: number[]) => number)
        switch (formula.action) {
            case "const": case "read": case "context": throw new Error("Unreachable")
            case "subscript": {
                const list = formula.list
                action = ([i]) => list[i]
                break
            }
            default: {
                const f = allActions[formula.action]
                action = arg => f(arg)
            }
        }
        return {
            outputIndex, action,
            dependencies: formula.dependencies?.map(dep => locations.get(dep)!)
                ?? [locations.get(formula.baseFormula!)!]
        }
    })
    const copyArray = [...outputFromInput].map(([output, inputIndex]) =>
        [locations.get(output)!, inputIndex + inputOffset])

    return lookup => {
        inputs.forEach((path, i) => buffer[i + inputOffset] = lookup(path))
        commands.forEach(({ outputIndex, action, dependencies }) =>
            buffer[outputIndex] = action(dependencies.map(i => buffer[i])))
        copyArray.forEach(([o, i]) => buffer[o] = buffer[i])
        return buffer.slice(0, outputSize)
    }
}

interface CompressedFormula {
    outputIndex: number
    action: (_: number[]) => number
    dependencies: number[]
}
