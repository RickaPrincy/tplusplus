export type ASTType =
  | "ProgramNode"
  | "VariableDeclarationNode"
  | "BinaryExpressionNode"
  | "Identifier"
  | "NumericLiteral"
  | "StringLiteral"

export interface ASTNode {
  type: ASTType;
}

export interface ProgramNode extends ASTNode {
  type: "ProgramNode";
  body: StatementNode[];
}

export interface StatementNode extends ASTNode { }
export interface ExpressionNode extends ASTNode { }

export interface StringLiteral extends ExpressionNode {
  type: "StringLiteral";
  value: string;
}

export interface NumericLiteral extends ExpressionNode {
  type: "NumericLiteral";
  value: number;
}

export interface Identifier extends ExpressionNode {
  type: "Identifier";
  value: string;
}

export interface VariableDeclarationNode extends StatementNode {
  identifier: string;
  type: "VariableDeclarationNode";
  value: ExpressionNode;
}

export interface BinaryExpressionNode extends ExpressionNode {
  type: "BinaryExpressionNode";
  operator: string;
  left: ExpressionNode;
  right: ExpressionNode;
}
