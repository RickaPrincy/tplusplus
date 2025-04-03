import { Tokinezer, Token, TokenType } from '../src';

describe('Tokinezer Tokenizer', () => {
  let tokenizer: Tokinezer;

  beforeEach(() => {
    tokenizer = new Tokinezer();
  });

  test('should tokenize simple TypeScript code', () => {
    const code = `let x: number = 42;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'x' },
      { type: TokenType.PUNCTUATION, value: ':' },
      { type: TokenType.KEYWORD, value: 'number' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.NUMBER, value: 42 },
      { type: TokenType.PUNCTUATION, value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should tokenize a string with single quotes', () => {
    const code = `let name: string = 'Alice';`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'name' },
      { type: TokenType.PUNCTUATION, value: ':' },
      { type: TokenType.KEYWORD, value: 'string' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.STRING, value: "'Alice'" },
      { type: TokenType.PUNCTUATION, value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should handle mixed spaces and newlines correctly', () => {
    const code = `let x = 5  \n let y = 10;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'x' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.NUMBER, value: 5 },
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'y' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.NUMBER, value: 10 },
      { type: TokenType.PUNCTUATION, value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should throw an error for unexpected tokens', () => {
    const code = `let x = 5 @ y;`;
    tokenizer.init(code);

    expect(() => tokenizer.tokenize()).toThrow(SyntaxError);
  });

  test('should tokenize code with comments and strings', () => {
    const code = `
      // This is a comment
      let name: string = "John";
      /* Block comment */
      let age: number = 30;
    `;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'name' },
      { type: TokenType.PUNCTUATION, value: ':' },
      { type: TokenType.KEYWORD, value: 'string' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.STRING, value: '"John"' },
      { type: TokenType.PUNCTUATION, value: ';' },
      { type: TokenType.KEYWORD, value: 'let' },
      { type: TokenType.IDENTIFIER, value: 'age' },
      { type: TokenType.PUNCTUATION, value: ':' },
      { type: TokenType.KEYWORD, value: 'number' },
      { type: TokenType.OPERATOR, value: '=' },
      { type: TokenType.NUMBER, value: 30 },
      { type: TokenType.PUNCTUATION, value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });
});
