export type ASTType =
  | "Identifier"
  | "ProgramNode"
  | "StringLiteral"
  | "NumericLiteral"
  | "BinaryExpressionNode"
  | "FunctionDeclarationNode"
  | "ReturnStatementNode"
  | "VariableDeclarationNode";

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

export interface Identifier extends ASTNode {
  type: "Identifier";
  value: string;
}

export interface VariableDeclarationNode extends StatementNode {
  type: "VariableDeclarationNode";
  identifier: string;
  valueType: string;
  value: ExpressionNode | NumericLiteral | StringLiteral;
}

export interface FunctionDeclarationNode extends StatementNode {
  type: "FunctionDeclarationNode";
  identifier: string;
  parameters: { name: string, type: string; }[];
  body: StatementNode[];
}

export interface ReturnStatementNode extends StatementNode {
  type: "ReturnStatementNode";
  argument: ExpressionNode | null;
}

export interface BinaryExpressionNode extends ExpressionNode {
  type: "BinaryExpressionNode";
  operator: string;
  left: ExpressionNode | NumericLiteral | StringLiteral;
  right: ExpressionNode | NumericLiteral | StringLiteral;
}
