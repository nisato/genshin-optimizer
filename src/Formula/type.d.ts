import { ElementKey, ReactionModeKey } from "../Types/consts"
import type { Path } from "../Util/KeyPathUtil"

export type CommutativeMonoidActions = "min" | "max" | "sum" | "prod"
export type Action = CommutativeMonoidActions | "res" | "frac" | "threshold_add"

export interface Context {
  formula: FormulaContext
}
export interface FormulaContext {
  action?: never
  [key: string]: FormulaContext | Formula
}
export type Reader<T extends FormulaContext> = {
  [Key in keyof T]: T[Key] extends FormulaContext ? Reader<T[Key]> : ReadFormula
}

interface FormulaBase {
  info?: Info
  baseFormula?: Formula
  dependencies?: Formula[]
}

export type Info = {
  name?: string
  variant?: "physical" | ElementKey | ReactionModeKey
  unit?: "%" | "flat"
}

export interface Constant extends FormulaBase {
  action: "const"
  value: number

  baseFormula?: never
  dependencies?: never
}
export interface ReadFormula extends FormulaBase {
  action: "read"
  path: Path<FormulaContext, Formula>

  info?: never
  baseFormula?: never
  dependencies?: never
}

export interface SubscriptFormula extends FormulaBase {
  action: "subscript"
  list: number[]

  baseFormula: Formula
  dependencies?: never
}
export interface ComputeFormula extends FormulaBase {
  action: Action

  baseFormula?: never
  dependencies: Formula[]
}

export interface ContextFormula extends FormulaBase {
  action: "context"
  context: Context

  info?: never
  baseFormula: Formula
  dependencies?: never
}

export type Formula = ReadFormula | ComputeFormula | SubscriptFormula | ContextFormula | Constant
