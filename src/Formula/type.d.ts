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

interface ReaderSpecInternal {
  action?: never
  [key: string]: ReaderSpecNode | CommutativeMonoidActions | "unique"
}
export type ReaderSpecNode = ReaderSpecInternal | CommutativeMonoidActions | "unique"
export type ReaderSpec<T extends ReaderSpecNode, X> = T extends ReaderSpecInternal ? {
  [Key in keyof T]: ReaderSpec<T[Key], X>
} : X

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
  path: Path<FormulaContext, Formula | undefined>
  accumulation: CommutativeMonoidActions | "unique"

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
  contexts: Context[]

  info?: never
  baseFormula: Formula
  dependencies?: never
}

export type Formula = ReadFormula | ComputeFormula | SubscriptFormula | ContextFormula | Constant
