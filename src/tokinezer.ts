export enum TokenType {
  NUMBER = "NUMBER",
  STRING = "STRING",
  KEYWORD = "KEYWORD",
  IDENTIFIER = "IDENTIFIER",
  OPERATOR = "OPERATOR",
  PUNCTUATION = "PUNCTUATION"
}

export interface Token {
  type: TokenType;
  value: string | number;
}

const SPECS: [RegExp, TokenType | null][] = [
  [/^\s+/, null], // Ignore whitespace
  [/^\/\/.*/, null], // Ignore line comments
  [/^\/\*[\s\S]*?\*\//, null], // Ignore block comments
  [/^\d+/, TokenType.NUMBER], // Numbers
  [/^"[^"]*"/, TokenType.STRING], // Strings (double quotes)
  [/^'[^']*'/, TokenType.STRING], // Strings (single quotes)
  [/^\b(let|const|while|function|string|number)\b/, TokenType.KEYWORD], // Keywords
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, TokenType.IDENTIFIER], // Identifiers (variables, functions)
  [/^[=+\-*/]/, TokenType.OPERATOR], // Operators
  [/^[:;{}()]/, TokenType.PUNCTUATION] // Punctuation
];

export class Tokinezer {
  private _string: string;
  private _cursor: number;

  constructor() {
    this._cursor = 0;
    this._string = "";
  }

  init(input: string) {
    this._string = input;
    this._cursor = 0;
  }

  hasMoreTokens(): boolean {
    return this._cursor < this._string.length;
  }

  _match(regexp: RegExp, input: string) {
    const match = regexp.exec(input);
    if (!match) {
      return null;
    };

    const value = match[0];
    this._cursor += value.length;
    return value;
  }

  nextToken(): Token | null {
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
        return this.nextToken();
      }

      return {
        type,
        value: type === TokenType.NUMBER ? Number(value) : value,
      };
    }

    throw new SyntaxError(`Unexpected token: "${this._string[this._cursor]}"`);
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token | null;
    while ((token = this.nextToken()) !== null) {
      tokens.push(token);
    }
    return tokens;
  }
}
