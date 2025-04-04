export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'IDENTIFIER'
  | 'FUNCTION_DECLARATION_KEYWORD'
  | 'VARIABLE_DECLARATION_KEYWORD'
  | 'CONTROL_FLOW_KEYWORD'
  | 'DATA_TYPE_KEYWORD'
  | 'PRINT_KEYWORD'
  | 'RETURN_KEYWORD'
  | 'OPERATOR'
  | 'ASSIGNMENT_OPERATOR'
  | 'LBRAKET'
  | 'RBRAKET'
  | 'LBRACE'
  | 'RBRACE'
  | 'LPAREN'
  | 'RPAREN'
  | 'SEMICOLON'
  | 'COMMA'
  | 'COLON';

export interface Token {
  type: TokenType;
  value: string | number;
}

const SPECS: [RegExp, TokenType | null][] = [
  [/^\s+/, null], // Ignore whitespace
  [/^\/\/.*/, null], // Ignore line comments
  [/^\/\*[\s\S]*?\*\//, null], // Ignore block comments
  [/^\d+/, 'NUMBER'], // Numbers
  [/^"[^"]*"/, 'STRING'], // Strings (double quotes)
  [/^'[^']*'/, 'STRING'], // Strings (single quotes)

  // Keywords categorized
  [/^\bfunction\b/, 'FUNCTION_DECLARATION_KEYWORD'], // Function keyword
  [/^\b(let|const)\b/, 'VARIABLE_DECLARATION_KEYWORD'], // Variable declaration
  [/^\bwhile\b/, 'CONTROL_FLOW_KEYWORD'], // Control flow keywords
  [/^\b(string|number)\b/, 'DATA_TYPE_KEYWORD'], // Data types
  [/^\bprint\b/, 'PRINT_KEYWORD'], // Print statement
  [/^\breturn\b/, 'RETURN_KEYWORD'], // Return statement

  // Identifiers
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'IDENTIFIER'],

  // Operators categorized
  [/^=/, 'ASSIGNMENT_OPERATOR'], // Assignment
  [/^[+\-*/%<>!]=?/, 'OPERATOR'], // Arithmetic, comparison, logical operators
  [/^&&|\|\|/, 'OPERATOR'], // Logical AND, OR

  // Punctuation
  [/^{/, 'LBRACE'], // {
  [/^}/, 'RBRACE'], // }
  [/^\(/, 'LPAREN'], // (
  [/^\)/, 'RPAREN'], // )
  [/^\[/, 'LBRAKET'], // [
  [/^\]/, 'RBRAKET'], // ]
  [/^;/, 'SEMICOLON'], // ;
  [/^:/, 'COLON'], // :
  [/^,/, 'COMMA'], // ,
];

export class Tokenizer {
  private _string: string;
  private _cursor: number;

  constructor() {
    this._cursor = 0;
    this._string = '';
  }

  init(input: string) {
    this._string = input;
    this._cursor = 0;
  }

  hasMoreTokens(): boolean {
    return this._cursor < this._string.length;
  }

  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);
    for (const [regexp, type] of SPECS) {
      const value = this._match(regexp, string);

      if (value === null) {
        continue;
      }

      if (type === null) {
        return this.getNextToken();
      }

      return {
        type,
        value,
      };
    }

    throw new SyntaxError(`Unexpected token: "${this._string[this._cursor]}"`);
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token | null;
    while ((token = this.getNextToken()) !== null) {
      tokens.push(token);
    }
    return tokens;
  }

  private _match(regexp: RegExp, input: string): string | null {
    const match = regexp.exec(input);
    if (!match) {
      return null;
    }

    const value = match[0];
    this._cursor += value.length;
    return value;
  }
}
