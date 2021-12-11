import { ElementKey, ReactionModeKey } from "../Types/consts"
import type { Path } from "../Util/KeyPathUtil"

export type Node = ConstantNode | ReadNode | FormulaNode | SubscriptNode | DataNode

interface NodeBase {
  operands: Node[]
}

export interface ConstantNode extends NodeBase {
  operation: "const"
  value: number

  info?: Info
}
export interface SubscriptNode extends NodeBase {
  operation: "subscript"
  list: number[]

  info?: Info
}

export interface ReadNode extends NodeBase {
  operation: "read"
  path: Path<FormulaData, Node | undefined>
  accumulation: CommutativeMonoidOperation | "unique"
}
export interface DataNode extends NodeBase {
  operation: "data"
  data: Data[]
}
export interface Data {
  formula: FormulaData
}
export interface FormulaData {
  action?: never
  [key: string]: FormulaData | Node
}

export interface FormulaNode extends NodeBase {
  operation: Operation
}

export type CommutativeMonoidOperation = "min" | "max" | "add" | "mul"
export type Operation = CommutativeMonoidOperation |
  "res" | // Resistance from base resistance
  "frac" | // linear fractional; operands[0] / (operands[0] + operands[1])
  "threshold_add" // operands[0] <= operands[1] ? operands[2] : 0

type Info = {
  name?: string
  variant?: "physical" | ElementKey | ReactionModeKey
  unit?: "%" | "flat"
}

interface ReaderSpecInternal {
  operation?: never
  [key: string]: ReaderSpecNode | CommutativeMonoidOperation | "unique"
}
export type ReaderSpecNode = ReaderSpecInternal | CommutativeMonoidOperation | "unique"
export type ReaderSpec<T extends ReaderSpecNode, X> = T extends ReaderSpecInternal ? {
  [Key in keyof T]: ReaderSpec<T[Key], X>
} : X
