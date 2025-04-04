export class CppTranspiler {
  private includes: Set<string> = new Set();

  transpile(ast: any): string {
    this.includes.clear();
    const result = this.transpileNode(ast);
    return this.generateIncludes() + result;
  }

  private transpileNode(ast: any): string {
    switch (ast.type) {
      case 'ProgramNode':
        return ast.body
          .map((node: any) => this.transpileNode(node))
          .join('\n\n');
      case 'VariableDeclarationNode':
        return this.transpileVariableDeclaration(ast);
      case 'BinaryExpressionNode':
        return this.transpileBinaryExpression(ast);
      case 'FunctionDeclarationNode':
        return this.transpileFunctionDeclaration(ast);
      case 'ReturnStatementNode':
        return this.transpileReturnStatement(ast);
      case 'StringLiteral':
        return `"${ast.value}"`;
      case 'NumericLiteral':
        return `${ast.value}`;
      case 'Identifier':
        return `${ast.value}`;
      default:
        throw new Error(`Unsupported AST node type: ${ast.type}`);
    }
  }

  transpileVariableDeclaration(node: any): string {
    const { identifier, valueType, value } = node;
    const valueCode = this.transpileNode(value);
    const type = this.transpileType(valueType);
    return `${type} ${identifier} = ${valueCode};`;
  }

  transpileBinaryExpression(node: any): string {
    const { operator, left, right } = node;
    const leftCode = this.transpileNode(left);
    const rightCode = this.transpileNode(right);
    return `${leftCode} ${operator} ${rightCode}`;
  }

  transpileFunctionDeclaration(node: any): string {
    const { identifier, parameters, body } = node;
    const paramsCode = parameters
      .map((param: any) => `${this.transpileType(param.type)} ${param.name}`)
      .join(', ');
    const bodyCode = body
      .map((stmt: any) => this.transpileNode(stmt))
      .join('\n');
    const returnType = this.transpileType(node.returnType);
    return `${returnType} ${identifier}(${paramsCode}) {\n\t${bodyCode}\n}`;
  }

  transpileType(type: string) {
    switch (type) {
      case 'string':
        this.includes.add('#include <string>');
        return 'std::string';
      default:
        return 'int';
    }
  }

  transpileReturnStatement(node: any): string {
    const argumentCode = this.transpileNode(node.argument);
    return `return ${argumentCode};`;
  }

  private generateIncludes(): string {
    if (this.includes.size === 0) {
      return '';
    }
    return Array.from(this.includes).join('\n') + '\n\n';
  }
}
