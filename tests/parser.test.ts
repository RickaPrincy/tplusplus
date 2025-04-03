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

  test('should parse declartion with operator ', () => {
    const input = 'const myNumber: number = 50 + 30';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "myNumber",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 50
            },
            right: {
              type: "NumericLiteral",
              value: 30
            },
          }
        },
      ],
    });
  });

  test('should parse declartion with multiple operator ', () => {
    const input = 'const myNumber: number = 50 + 30 - 39 + 15';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      "type": "ProgramNode",
      "body": [
        {
          "type": "VariableDeclarationNode",
          "value": {
            "type": "BinaryExpressionNode",
            "operator": "+",
            "left": {
              "type": "BinaryExpressionNode",
              "operator": "-",
              "left": {
                "type": "BinaryExpressionNode",
                "operator": "+",
                "left": {
                  "type": "NumericLiteral",
                  "value": 50
                },
                "right": {
                  "type": "NumericLiteral",
                  "value": 30
                }
              },
              "right": {
                "type": "NumericLiteral",
                "value": 39
              }
            },
            "right": {
              "type": "NumericLiteral",
              "value": 15
            }
          },
          "identifier": "myNumber",
          "valueType": "number"
        }
      ]
    });
  });

  test('should parse declaration with multiplication', () => {
    const input = 'const result: number = 5 * 3';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "result",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "*",
            left: { type: "NumericLiteral", value: 5 },
            right: { type: "NumericLiteral", value: 3 }
          }
        }
      ]
    });
  });

  test('should parse declaration with division', () => {
    const input = 'const quotient: number = 10 / 2';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "quotient",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "/",
            left: { type: "NumericLiteral", value: 10 },
            right: { type: "NumericLiteral", value: 2 }
          }
        }
      ]
    });
  });

  test('should parse declaration with mixed operators and precedence', () => {
    const input = 'const mixed: number = 10 + 2 * 3';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "mixed",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "+",
            left: { type: "NumericLiteral", value: 10 },
            right: {
              type: "BinaryExpressionNode",
              operator: "*",
              left: { type: "NumericLiteral", value: 2 },
              right: { type: "NumericLiteral", value: 3 }
            }
          }
        }
      ]
    });
  });

  test('should parse declaration with parentheses', () => {
    const input = 'const grouped: number = (10 + 2) * 3';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "grouped",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "*",
            left: {
              type: "BinaryExpressionNode",
              operator: "+",
              left: { type: "NumericLiteral", value: 10 },
              right: { type: "NumericLiteral", value: 2 }
            },
            right: { type: "NumericLiteral", value: 3 }
          }
        }
      ]
    });
  });

  test('should parse declaration with nested parentheses', () => {
    const input = 'const nested: number = (2 + (3 * 4))';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: "nested",
          valueType: "number",
          value: {
            type: "BinaryExpressionNode",
            operator: "+",
            left: { type: "NumericLiteral", value: 2 },
            right: {
              type: "BinaryExpressionNode",
              operator: "*",
              left: { type: "NumericLiteral", value: 3 },
              right: { type: "NumericLiteral", value: 4 }
            }
          }
        }
      ]
    });
  });

  test("should parse a simple function declaration", () => {
    const input = "function greet() {}";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: "ProgramNode",
      body: [
        {
          type: "FunctionDeclarationNode",
          parameters: [],
          identifier: "greet",
          body: [],
        },
      ],
    });
  });

  test("should parse a function declaration with statement inside", () => {
    const input = "function greet() { const test: number = 5 + 2 * 3 \n const name: string = 'billy' }";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: "ProgramNode",
      body: [
        {
          type: "FunctionDeclarationNode",
          parameters: [],
          identifier: "greet",
          body: [
            {
              type: "VariableDeclarationNode",
              identifier: "test",
              valueType: "number",
              value: {
                type: "BinaryExpressionNode",
                operator: "+",
                left: { type: "NumericLiteral", value: 5 },
                right: {
                  type: "BinaryExpressionNode",
                  operator: "*",
                  left: { type: "NumericLiteral", value: 2 },
                  right: { type: "NumericLiteral", value: 3 },
                },
              },
            },
            {
              type: "VariableDeclarationNode",
              identifier: "name",
              valueType: "string",
              value: { type: "StringLiteral", value: "billy" },
            },
          ],
        }
      ],
    });
  })

  test("should parse a function declaration with parameters", () => {
    const input = "function add(a: number, b: number) {}";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: "ProgramNode",
      body: [
        {
          type: "FunctionDeclarationNode",
          identifier: "add",
          parameters: [
            { name: "a", type: "number" },
            { name: "b", type: "number" }
          ],
          body: [],
        },
      ],
    });
  });

  test("should parse a function with a return statement", () => {
    const input = "function square(n: number) { const name: string = 'ricka' \n return 4 * 9; }";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: "ProgramNode",
      body: [
        {
          type: "FunctionDeclarationNode",
          identifier: "square",
          parameters: [{ name: "n", type: "number" }],
          body: [
            {
              type: "VariableDeclarationNode",
              identifier: "name",
              valueType: "string",
              value: { type: "StringLiteral", value: "ricka" },
            },
            {
              type: "ReturnStatementNode",
              argument: {
                type: "BinaryExpressionNode",
                operator: "*",
                left: { type: "NumericLiteral", value: 4 },
                right: { type: "NumericLiteral", value: 9 }
              }
            }
          ]
        }
      ],
    });
  });
});
