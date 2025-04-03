import { ProgramNode, StatementNode, ExpressionNode, NumericLiteral, StringLiteral, VariableDeclarationNode } from './ast';
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
   *  : VariableDeclaration 
   * A statement can either be a variable declaration or an expression statement.
   */
  Statement(): StatementNode | null {
    if (!this._lookahead) {
      return null;
    }

    switch (this._lookahead.type) {
      case "KEYWORD":
        return this.VariableDeclaration();
      default:
        throw new SyntaxError("Unknown Syntax");
    }
  }

  /**
   *  VariableDeclaration
   **/
  VariableDeclaration(): VariableDeclarationNode {
    this._eat("KEYWORD");
    const identifier = this._eat("IDENTIFIER");

    if (this._eat("PUNCTUATION")?.value !== ":") {
      throw new SyntaxError("Expect :");
    }

    this._eat("KEYWORD") // variable type

    if (this._eat("OPERATOR")?.value !== "=") {
      throw new SyntaxError("Expect =");
    }

    const value = this.Literal();

    return {
      type: "VariableDeclarationNode",
      identifier: identifier.value as string,
      value
    };
  }

  /**
   *  Literal 
   *    : NumericLiteral
   *    | StringLiteral
   **/
  Literal(): ExpressionNode {
    switch (this._lookahead?.type) {
      case "NUMBER": return this.NumericLiteral();
      case "STRING": return this.StringLiteral();
      default: throw new Error("Not Support literal");
    }
  }

  /**
   *  StringLiteral
   *    : STRING 
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
   *    : NUMBER
   **/
  NumericLiteral(): NumericLiteral {
    const token = this._eat("NUMBER");
    return {
      type: 'NumericLiteral',
      value: Number(token.value)
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
