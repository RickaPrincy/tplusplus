import { Parser } from "../src/parser";

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test('should parse a numeric literal', () => {
    const input = '10';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'Program',
      body: [
        {
          type: 'NumericLiteral',
          value: 10,
        },
      ],
    });
  });

  test('should parse a string literal', () => {
    const input = '"Hello, world!"';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'Program',
      body: [
        {
          type: 'StringLiteral',
          value: 'Hello, world!',
        },
      ],
    });
  });

  test('should parse a program with a numeric and a string literal', () => {
    const input = '10 "Hello, world!"';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'Program',
      body: [
        {
          type: 'NumericLiteral',
          value: 10,
        },
        {
          type: 'StringLiteral',
          value: 'Hello, world!',
        },
      ],
    });
  });

  test('should throw an error for invalid input', () => {
    const input = 'undefined_variable';
    
    expect(() => {
      parser.parse(input);
    }).toThrow('Unknown Syntax');
  });

  test('should handle an empty program gracefully', () => {
    const input = '';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'Program',
      body: [],
    });
  });
});
