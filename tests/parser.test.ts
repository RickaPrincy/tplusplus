import { Parser } from '../src/parser';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  test('should parse simple string declaration', () => {
    const input = 'const test: string = "hello";';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'test',
          valueType: 'string',
          value: {
            type: 'StringLiteral',
            value: 'hello',
          },
        },
      ],
    });
  });

  test('should parse simple number declaration', () => {
    const input = 'const myNumber: number = 50;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'myNumber',
          valueType: 'number',
          value: {
            type: 'NumericLiteral',
            value: 50,
          },
        },
      ],
    });
  });

  test('should parse declartion with operator ', () => {
    const input = 'const myNumber: number = 50 + 30;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'myNumber',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 50,
            },
            right: {
              type: 'NumericLiteral',
              value: 30,
            },
          },
        },
      ],
    });
  });

  test('should parse declartion with multiple operator ', () => {
    const input = 'const myNumber: number = 50 + 30 - 39 + 15;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          value: {
            type: 'BinaryExpressionNode',
            operator: '+',
            left: {
              type: 'BinaryExpressionNode',
              operator: '-',
              left: {
                type: 'BinaryExpressionNode',
                operator: '+',
                left: {
                  type: 'NumericLiteral',
                  value: 50,
                },
                right: {
                  type: 'NumericLiteral',
                  value: 30,
                },
              },
              right: {
                type: 'NumericLiteral',
                value: 39,
              },
            },
            right: {
              type: 'NumericLiteral',
              value: 15,
            },
          },
          identifier: 'myNumber',
          valueType: 'number',
        },
      ],
    });
  });

  test('should parse declaration with multiplication', () => {
    const input = 'const result: number = 5 * 3;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'result',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '*',
            left: { type: 'NumericLiteral', value: 5 },
            right: { type: 'NumericLiteral', value: 3 },
          },
        },
      ],
    });
  });

  test('should parse declaration with division', () => {
    const input = 'const quotient: number = 10 / 2;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'quotient',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '/',
            left: { type: 'NumericLiteral', value: 10 },
            right: { type: 'NumericLiteral', value: 2 },
          },
        },
      ],
    });
  });

  test('should parse declaration with mixed operators and precedence', () => {
    const input = 'const mixed: number = 10 + 2 * 3;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'mixed',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '+',
            left: { type: 'NumericLiteral', value: 10 },
            right: {
              type: 'BinaryExpressionNode',
              operator: '*',
              left: { type: 'NumericLiteral', value: 2 },
              right: { type: 'NumericLiteral', value: 3 },
            },
          },
        },
      ],
    });
  });

  test('should parse declaration with parentheses', () => {
    const input = 'const grouped: number = (10 + 2) * 3;';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'grouped',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '*',
            left: {
              type: 'BinaryExpressionNode',
              operator: '+',
              left: { type: 'NumericLiteral', value: 10 },
              right: { type: 'NumericLiteral', value: 2 },
            },
            right: { type: 'NumericLiteral', value: 3 },
          },
        },
      ],
    });
  });

  test('should parse declaration with nested parentheses', () => {
    const input = 'const nested: number = (2 + (3 * 4));';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'VariableDeclarationNode',
          identifier: 'nested',
          valueType: 'number',
          value: {
            type: 'BinaryExpressionNode',
            operator: '+',
            left: { type: 'NumericLiteral', value: 2 },
            right: {
              type: 'BinaryExpressionNode',
              operator: '*',
              left: { type: 'NumericLiteral', value: 3 },
              right: { type: 'NumericLiteral', value: 4 },
            },
          },
        },
      ],
    });
  });

  test('should parse a simple function declaration', () => {
    const input = 'function greet(): string {}';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          parameters: [],
          returnType: 'string',
          identifier: 'greet',
          body: [],
        },
      ],
    });
  });

  test('should parse a function declaration with statement inside', () => {
    const input =
      "function greet():string { const test: number = 5 + 2 * 3; \n const name: string = 'billy'; }";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          parameters: [],
          returnType: 'string',
          identifier: 'greet',
          body: [
            {
              type: 'VariableDeclarationNode',
              identifier: 'test',
              valueType: 'number',
              value: {
                type: 'BinaryExpressionNode',
                operator: '+',
                left: { type: 'NumericLiteral', value: 5 },
                right: {
                  type: 'BinaryExpressionNode',
                  operator: '*',
                  left: { type: 'NumericLiteral', value: 2 },
                  right: { type: 'NumericLiteral', value: 3 },
                },
              },
            },
            {
              type: 'VariableDeclarationNode',
              identifier: 'name',
              valueType: 'string',
              value: { type: 'StringLiteral', value: 'billy' },
            },
          ],
        },
      ],
    });
  });

  test('should parse a function declaration with parameters', () => {
    const input = 'function add(a: number, b: number): number {}';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          identifier: 'add',
          returnType: 'number',
          parameters: [
            { name: 'a', type: 'number' },
            { name: 'b', type: 'number' },
          ],
          body: [],
        },
      ],
    });
  });

  test('should parse a function with a return statement', () => {
    const input =
      "function square(n: number): number { const name: string = 'ricka'; \n return 4 * 9; }";
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          returnType: 'number',
          identifier: 'square',
          parameters: [{ name: 'n', type: 'number' }],
          body: [
            {
              type: 'VariableDeclarationNode',
              identifier: 'name',
              valueType: 'string',
              value: { type: 'StringLiteral', value: 'ricka' },
            },
            {
              type: 'ReturnStatementNode',
              argument: {
                type: 'BinaryExpressionNode',
                operator: '*',
                left: { type: 'NumericLiteral', value: 4 },
                right: { type: 'NumericLiteral', value: 9 },
              },
            },
          ],
        },
      ],
    });
  });

  test('should parse a function that returns an identifier', () => {
    const input = 'function getValue(x: number): number { return x; }';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          returnType: 'number',
          identifier: 'getValue',
          parameters: [{ name: 'x', type: 'number' }],
          body: [
            {
              type: 'ReturnStatementNode',
              argument: {
                type: 'Identifier',
                value: 'x',
              },
            },
          ],
        },
      ],
    });
  });

  test('should parse a function that returns an addition expression with an identifier', () => {
    const input = 'function addOne(x: number): number { return x + 1; }';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          identifier: 'addOne',
          returnType: 'number',
          parameters: [{ name: 'x', type: 'number' }],
          body: [
            {
              type: 'ReturnStatementNode',
              argument: {
                type: 'BinaryExpressionNode',
                operator: '+',
                left: { type: 'Identifier', value: 'x' },
                right: { type: 'NumericLiteral', value: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  test('should parse a function that returns a multiplication expression with an identifier', () => {
    const input = 'function double(x: number): number { return x * 2; }';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          returnType: 'number',
          identifier: 'double',
          parameters: [{ name: 'x', type: 'number' }],
          body: [
            {
              type: 'ReturnStatementNode',
              argument: {
                type: 'BinaryExpressionNode',
                operator: '*',
                left: { type: 'Identifier', value: 'x' },
                right: { type: 'NumericLiteral', value: 2 },
              },
            },
          ],
        },
      ],
    });
  });

  test('should parse a function that returns a complex binary expression with an identifier', () => {
    const input =
      'function compute(y: number, z: number): string { return y * 2 + z; }';
    const ast = parser.parse(input);

    expect(ast).toEqual({
      type: 'ProgramNode',
      body: [
        {
          type: 'FunctionDeclarationNode',
          returnType: 'string',
          identifier: 'compute',
          parameters: [
            { name: 'y', type: 'number' },
            { name: 'z', type: 'number' },
          ],
          body: [
            {
              type: 'ReturnStatementNode',
              argument: {
                type: 'BinaryExpressionNode',
                operator: '+',
                left: {
                  type: 'BinaryExpressionNode',
                  operator: '*',
                  left: { type: 'Identifier', value: 'y' },
                  right: { type: 'NumericLiteral', value: 2 },
                },
                right: { type: 'Identifier', value: 'z' },
              },
            },
          ],
        },
      ],
    });
  });
});
