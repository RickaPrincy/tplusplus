import { Tokinezer, Token } from '../src';

describe('Tokinezer Tokenizer', () => {
  let tokenizer: Tokinezer;

  beforeEach(() => {
    tokenizer = new Tokinezer();
  });

  test('should tokenize simple TypeScript code', () => {
    const code = `let x: number = 42;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'x' },
      { type: "PUNCTUATION", value: ':' },
      { type: "KEYWORD", value: 'number' },
      { type: "OPERATOR", value: '=' },
      { type: "NUMBER", value: 42 },
      { type: "PUNCTUATION", value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should tokenize a string with single quotes', () => {
    const code = `let name: string = 'Alice';`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'name' },
      { type: "PUNCTUATION", value: ':' },
      { type: "KEYWORD", value: 'string' },
      { type: "OPERATOR", value: '=' },
      { type: "STRING", value: "'Alice'" },
      { type: "PUNCTUATION", value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should handle mixed spaces and newlines correctly', () => {
    const code = `let x = 5  \n let y = 10;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'x' },
      { type: "OPERATOR", value: '=' },
      { type: "NUMBER", value: 5 },
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'y' },
      { type: "OPERATOR", value: '=' },
      { type: "NUMBER", value: 10 },
      { type: "PUNCTUATION", value: ';' },
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
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'name' },
      { type: "PUNCTUATION", value: ':' },
      { type: "KEYWORD", value: 'string' },
      { type: "OPERATOR", value: '=' },
      { type: "STRING", value: '"John"' },
      { type: "PUNCTUATION", value: ';' },
      { type: "KEYWORD", value: 'let' },
      { type: "IDENTIFIER", value: 'age' },
      { type: "PUNCTUATION", value: ':' },
      { type: "KEYWORD", value: 'number' },
      { type: "OPERATOR", value: '=' },
      { type: "NUMBER", value: 30 },
      { type: "PUNCTUATION", value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });
});
