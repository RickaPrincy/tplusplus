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
});
