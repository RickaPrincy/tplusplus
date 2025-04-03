import { ProgramNode, NumericLiteral, StringLiteral, ASTNode } from './ast';
import { Token, TokenType, Tokinezer } from './tokinezer';

export class Parser {
  private _string: string;
  private _tokenizer: Tokinezer;
  private _lookahead: Token | null;

  constructor() {
    this._string = "";
    this._lookahead = null;
    this._tokenizer = new Tokinezer();
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
    const body: ASTNode[] = [];

    while (this._lookahead) {
      const statement = this.Statement();
      if (statement) {
        body.push(statement);
      }
    }

    return {
      type: "Program",
      body,
    };
  }

  /**
   * Statement
   *  : VariableDeclaration 
   *    | ExpressionStatement
   * A statement can either be a variable declaration or an expression statement.
   */
  Statement(): ASTNode | null {
    if (!this._lookahead) {
      return null;
    }

    switch (this._lookahead.type) {
      case "NUMBER":
      case "STRING":
        return this.Literal();
      default:
        throw new SyntaxError("Unknown Syntax");
    }
  }

  /**
   *  Literal 
   *    : NumericLiteral
   *    | StringLiteral
   **/
  Literal(): ASTNode {
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
      throw new Error(`Excepted TokenType${token.type}, required ${token.type}`);
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
