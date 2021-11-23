import type { Path } from "../Util/KeyPathUtil"

export type CommutativeMonoidActions = "min" | "max" | "sum" | "prod"
export type Action = CommutativeMonoidActions | "res" | "frac" | "threshold_add"

export interface Context {
    formula: FormulaContext
    string: StringContext
}
export interface FormulaContext {
    action?: never
    [key: string]: FormulaContext | Formula
}
export interface StringContext {
    [key: string]: StringContext | string
}
export type Reader<T extends FormulaContext> = {
    [Key in keyof T]: T[Key] extends FormulaContext ? Reader<T[Key]> : ReadFormula
}

export interface Constant {
    action: "const"
    value: number

    baseFormula?: never
    dependencies?: never
}
export interface ReadFormula {
    action: "read"
    path: Path<FormulaContext, Formula>

    baseFormula?: never
    dependencies?: never
}

export interface SubscriptFormula {
    action: "subscript"
    list: number[]
    baseFormula: Formula

    dependencies?: never
}
export interface ComputeFormula {
    action: Action
    dependencies: Formula[]

    baseFormula?: never
}

export interface ContextFormula {
    action: "context"
    context: Context
    baseFormula: Formula

    dependencies?: never
}

export type Formula = ReadFormula | ComputeFormula | SubscriptFormula | ContextFormula | Constant
