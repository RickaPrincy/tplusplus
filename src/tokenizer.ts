export type TokenType =
  | "NUMBER"
  | "STRING"
  | "KEYWORD"
  | "IDENTIFIER"
  | "OPERATOR"
  | "PUNCTUATION";

export interface Token {
  type: TokenType;
  value: string | number;
}

const SPECS: [RegExp, TokenType | null][] = [
  [/^\s+/, null], // Ignore whitespace
  [/^\/\/.*/, null], // Ignore line comments
  [/^\/\*[\s\S]*?\*\//, null], // Ignore block comments
  [/^\d+/, "NUMBER"], // Numbers
  [/^"[^"]*"/, "STRING"], // Strings (double quotes)
  [/^'[^']*'/, "STRING"], // Strings (single quotes)
  [/^\b(let|const|while|function|string|number|print)\b/, "KEYWORD"], // Keywords
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, "IDENTIFIER"], // Identifiers (variables, functions)
  [/^[=+\-*/]/, "OPERATOR"], // Operators
  [/^[:;{}()]/, "PUNCTUATION"], // Punctuation
];

export class Tokenizer {
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
        value: type === "NUMBER" ? Number(value) : value,
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


  _match(regexp: RegExp, input: string) {
    const match = regexp.exec(input);
    if (!match) {
      return null;
    };

    const value = match[0];
    this._cursor += value.length;
    return value;
  }

}
