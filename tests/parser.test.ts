import { Parser } from "../src/parser";

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test('should parse simple declaration', () => {
    const input = 'const test: string = "hello"';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "test",
          value: {
            type: "StringLiteral",
            value: "hello"
          }
        },
      ],
    });
  });


  test('should parse simple declaration', () => {
    const input = 'const myage: number = 50';
    const program = parser.parse(input);

    expect(program).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "myage",
          value: {
            type: "NumericLiteral",
            value: 50
          }
        },
      ],
    });
  });
});
