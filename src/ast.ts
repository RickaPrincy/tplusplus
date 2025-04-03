export type ASTNodeType =
  | "Program"
  | "StringLiteral"
  | "NumericLiteral"

export interface ASTNode {
  type: ASTNodeType;
}

export interface ProgramNode extends ASTNode {
  type: "Program";
  body: ASTNode[];
}

export interface StringLiteral extends ASTNode {
  type: "StringLiteral",
  value: string;
}

export interface NumericLiteral extends ASTNode {
  type: "NumericLiteral",
  value: number;
} 
