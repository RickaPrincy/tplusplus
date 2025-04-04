import { Tokenizer, Token } from '../src';

describe('Tokinezer Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  test('should tokenize simple TypeScript code', () => {
    const code = `let x: number = 42;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'let' },
      { type: 'IDENTIFIER', value: 'x' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'number' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'NUMBER', value: '42' },
      { type: 'SEMICOLON', value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should tokenize a string with single quotes', () => {
    const code = `let name: string = 'Alice';`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'let' },
      { type: 'IDENTIFIER', value: 'name' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'string' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'STRING', value: "'Alice'" },
      { type: 'SEMICOLON', value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should handle mixed spaces and newlines correctly', () => {
    const code = `let x: number = 5  \n let y: number = 10;`;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'let' },
      { type: 'IDENTIFIER', value: 'x' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'number' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'NUMBER', value: '5' },
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'let' },
      { type: 'IDENTIFIER', value: 'y' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'number' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'NUMBER', value: '10' },
      { type: 'SEMICOLON', value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });

  test('should throw an error for unexpected tokens', () => {
    const code = `let x: number = 5 @ y;`;
    tokenizer.init(code);

    expect(() => tokenizer.tokenize()).toThrow(SyntaxError);
  });

  test('should tokenize code with comments and strings', () => {
    const code = `
      // This is a comment
      const name: string = "John";
      /* Block comment */
      let age: number = 30;
    `;
    tokenizer.init(code);

    const expectedTokens: Token[] = [
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'const' },
      { type: 'IDENTIFIER', value: 'name' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'string' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'STRING', value: '"John"' },
      { type: 'SEMICOLON', value: ';' },
      { type: 'VARIABLE_DECLARATION_KEYWORD', value: 'let' },
      { type: 'IDENTIFIER', value: 'age' },
      { type: 'COLON', value: ':' },
      { type: 'DATA_TYPE_KEYWORD', value: 'number' },
      { type: 'ASSIGNMENT_OPERATOR', value: '=' },
      { type: 'NUMBER', value: '30' },
      { type: 'SEMICOLON', value: ';' },
    ];

    expect(tokenizer.tokenize()).toEqual(expectedTokens);
  });
});
