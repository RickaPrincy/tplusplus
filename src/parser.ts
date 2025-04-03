import { ProgramNode, StatementNode, ExpressionNode, NumericLiteral, StringLiteral, VariableDeclarationNode, BinaryExpressionNode } from './ast';
import { Token, TokenType, Tokenizer } from './tokenizer';

export class Parser {
  private _string: string;
  private _tokenizer: Tokenizer;
  private _lookahead: Token | null;

  constructor() {
    this._string = "";
    this._lookahead = null;
    this._tokenizer = new Tokenizer();
  }

  parse(input: string): ProgramNode {
    this._string = input;
    this._tokenizer.init(this._string);
    this._lookahead = this._tokenizer.getNextToken();

    /*
     * Main Entry point
     * */
    return this.Program();
  }

  /**
   * Program
   *  : Statement*
   * A program consists of multiple statements.
   */
  Program(): ProgramNode {
    const body: StatementNode[] = [];

    while (this._lookahead) {
      const statement = this.Statement();
      if (statement) {
        body.push(statement);
      }
    }

    return {
      type: "ProgramNode",
      body,
    };
  }

  /**
   * Statement
   * : VariableDeclaration 
   * A statement can either be a variable declaration or an expression statement.
   */
  Statement(): StatementNode | null {
    if (!this._lookahead) {
      return null;
    }

    switch (this._lookahead.type) {
      case "VARIABLE_DECLARATION_KEYWORD":
        return this.VariableDeclaration();
      default:
        throw new Error("Not Implemented");
    }
  }

  /**
   * VariableDeclaration
   **/
  VariableDeclaration(): VariableDeclarationNode {
    this._eat("VARIABLE_DECLARATION_KEYWORD");        // const | let
    const identifier = this._eat("IDENTIFIER")?.value;       // variable_name
    this._eat("COLON");                               // :
    const valueType = this._eat("DATA_TYPE_KEYWORD")?.value; // string | number
    this._eat("ASSIGNMENT_OPERATOR");                 // =
    const value = this.Expression();                     // Expression
    return {
      type: "VariableDeclarationNode",
      value,
      identifier: identifier as string,
      valueType: valueType as string
    };
  }

  /**
   * Expression
   * : Literal
   * | Expression
   */
  Expression(): ExpressionNode {
    let left = this.Literal();
    while (this._lookahead && this._lookahead.type === "OPERATOR") {
      const operator = this._eat("OPERATOR").value;
      const right = this.Literal();
      left = { type: "BinaryExpressionNode", operator, left, right } as BinaryExpressionNode;
    }
    return left;
  }

  /**
   *  Literal 
   *    : NumericLiteral
   *    | StringLiteral
   **/
  Literal(): ExpressionNode {
    const token = this._lookahead;

    if (!token) {
      throw new SyntaxError("Unexpected end of input");
    }

    switch (token.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      default:
        throw new SyntaxError(`Unexpected token: ${token.type}`);
    }
  }

  /**
   *  StringLiteral
   *    : LITERAL 
   **/
  StringLiteral(): StringLiteral {
    const value = this._eat("STRING").value as unknown as string;
    return {
      type: 'StringLiteral',
      value: value.slice(1, -1)
    }
  }

  /**
   *  NumericLiteral
   *    : LITERAL 
   **/
  NumericLiteral(): NumericLiteral {
    const value = this._eat("NUMBER")?.value;
    return {
      type: 'NumericLiteral',
      value: Number(value)
    }
  }

  _eat(tokenType: TokenType) {
    const token = this._lookahead;
    if (token === null) {
      throw new Error(`Excepted Token to be ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new Error(`Excepted TokenType ${token.type}, required ${tokenType}`);
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
