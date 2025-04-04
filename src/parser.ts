import {
  ProgramNode,
  Identifier,
  StatementNode,
  ExpressionNode,
  NumericLiteral,
  StringLiteral,
  VariableDeclarationNode,
  BinaryExpressionNode,
  FunctionDeclarationNode,
  ReturnStatementNode,
} from './ast';
import { Token, TokenType, Tokenizer } from './tokenizer';

export class Parser {
  private _string: string;
  private _tokenizer: Tokenizer;
  private _lookahead: Token | null;

  constructor() {
    this._string = '';
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
      type: 'ProgramNode',
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
      case 'VARIABLE_DECLARATION_KEYWORD':
        return this.VariableDeclaration();
      case 'FUNCTION_DECLARATION_KEYWORD':
        return this.FunctionDeclaration();
      case 'RETURN_KEYWORD':
        return this.ReturnStatement();
      default:
        throw new Error('Not Implemented');
    }
  }

  /**
   * VariableDeclaration
   **/
  VariableDeclaration(): VariableDeclarationNode {
    this._eat('VARIABLE_DECLARATION_KEYWORD'); // const | let
    const identifier = this._eat('IDENTIFIER')?.value; // variable_name
    this._eat('COLON'); // :
    const valueType = this._eat('DATA_TYPE_KEYWORD')?.value; // string | number
    this._eat('ASSIGNMENT_OPERATOR'); // =
    const value = this.Expression(); // Expression
    this._eat('SEMICOLON'); // =
    return {
      type: 'VariableDeclarationNode',
      value,
      identifier: identifier as string,
      valueType: valueType as string,
    };
  }

  /**
   * Parses a return statement.
   */
  FunctionDeclaration(): FunctionDeclarationNode {
    this._eat('FUNCTION_DECLARATION_KEYWORD');
    const identifier = this._eat('IDENTIFIER')!.value as string;

    const parameters = this._parseParameters();
    this._eat('COLON');
    const returnType = this._eat('DATA_TYPE_KEYWORD')!.value as string;
    this._eat('LBRACE');

    const body = this._parseBlock();
    return {
      type: 'FunctionDeclarationNode',
      identifier,
      parameters,
      body,
      returnType,
    };
  }

  /**
   * Parses a return statement.
   */
  ReturnStatement(): ReturnStatementNode {
    this._eat('RETURN_KEYWORD');

    let argument: ExpressionNode | null = null;
    if (this._lookahead?.type !== 'SEMICOLON') {
      argument = this.Expression();
    }

    this._eat('SEMICOLON');
    return { type: 'ReturnStatementNode', argument };
  }

  /**
   * Expression
   * : Term (("+" | "-") Term)*
   */
  Expression(): ExpressionNode {
    let left = this.Term(); // Handle multiplication/division first

    while (
      this._lookahead &&
      (this._lookahead.value === '+' || this._lookahead.value === '-')
    ) {
      const operator = this._eat('OPERATOR').value;
      const right = this.Term(); // Continue processing with lower precedence
      left = {
        type: 'BinaryExpressionNode',
        operator,
        left,
        right,
      } as BinaryExpressionNode;
    }

    return left;
  }

  /**
   * Term
   * : Factor (("*" | "/") Factor)*
   */
  Term(): ExpressionNode {
    let left = this.Factor();

    while (
      this._lookahead &&
      (this._lookahead.value === '*' || this._lookahead.value === '/')
    ) {
      const operator = this._eat('OPERATOR').value;
      const right = this.Factor();
      left = {
        type: 'BinaryExpressionNode',
        operator,
        left,
        right,
      } as BinaryExpressionNode;
    }

    return left;
  }

  /**
   * Factor
   * : "(" Expression ")"
   * | Literal
   */
  Factor(): ExpressionNode {
    if (this._lookahead?.type === 'LPAREN') {
      this._eat('LPAREN'); // Consume '('
      const expression = this.Expression(); // Parse the expression inside
      this._eat('RPAREN'); // Consume ')'
      return expression;
    }
    return this.Literal();
  }

  /**
   *  Literal
   *    : NumericLiteral
   *    | StringLiteral
   *    | Identifier
   **/
  Literal(): ExpressionNode {
    const token = this._lookahead;

    if (!token) {
      throw new SyntaxError('Unexpected end of input');
    }

    switch (token.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
      case 'IDENTIFIER':
        return this.Identifier();
      default:
        throw new SyntaxError(`Unexpected token: ${token.type}`);
    }
  }

  Identifier(): Identifier {
    return {
      type: 'Identifier',
      value: this._eat('IDENTIFIER').value as string,
    };
  }

  /**
   *  StringLiteral
   *    : LITERAL
   **/
  StringLiteral(): StringLiteral {
    const value = this._eat('STRING').value as unknown as string;
    return {
      type: 'StringLiteral',
      value: value.slice(1, -1),
    };
  }

  /**
   *  NumericLiteral
   *    : LITERAL
   **/
  NumericLiteral(): NumericLiteral {
    const value = this._eat('NUMBER')?.value;
    return {
      type: 'NumericLiteral',
      value: Number(value),
    };
  }

  /**
   * Parses function parameters.
   */
  private _parseParameters(): FunctionDeclarationNode['parameters'] {
    this._eat('LPAREN');

    const parameters: FunctionDeclarationNode['parameters'] = [];
    while (this._lookahead?.type !== 'RPAREN') {
      const name = this._eat('IDENTIFIER')!.value as string;
      this._eat('COLON');
      const type = this._eat('DATA_TYPE_KEYWORD')!.value as string;
      parameters.push({ name, type });

      if (this._lookahead?.type === 'COMMA') {
        this._eat('COMMA');
      }
    }

    this._eat('RPAREN');
    return parameters;
  }

  /**
   * Parses a block of statements enclosed in curly braces `{ ... }`.
   */
  private _parseBlock(): StatementNode[] {
    const body: StatementNode[] = [];

    while (this._lookahead && this._lookahead.type !== 'RBRACE') {
      body.push(this.Statement() as StatementNode);
    }

    this._eat('RBRACE');
    return body;
  }

  private _eat(tokenType: TokenType) {
    const token = this._lookahead;
    if (token === null) {
      throw new Error(`Excepted Token to be ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new Error(
        `Excepted TokenType ${token.type}, required ${tokenType}`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
