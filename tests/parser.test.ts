import { Parser } from "../src/parser";

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test('should parse simple string declaration', () => {
    const input = 'const test: string = "hello"';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "test",
          valueType: "string",
          value: {
            type: "StringLiteral",
            value: "hello"
          }
        },
      ],
    });
  });

  test('should parse simple number declaration', () => {
    const input = 'const myNumber: number = 50';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "myNumber",
          valueType: "number",
          value: {
            type: "NumericLiteral",
            value: 50
          }
        },
      ],
    });
  });
});
