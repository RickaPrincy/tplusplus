import { Parser } from '../parser';
import { CppTranspiler } from './cpp-transpiler';
import * as fs from 'fs';
import * as path from 'path';

export class CppTranspilerFile {
  private parser: Parser;
  private transpiler: CppTranspiler;

  constructor() {
    this.parser = new Parser();
    this.transpiler = new CppTranspiler();
  }

  transpileFile(inputFile: string): void {
    const inputCode = fs.readFileSync(inputFile, 'utf-8');
    const ast = this.parser.parse(inputCode);
    const cppCode = this.transpiler.transpile(ast);

    const outputDir = path.dirname(inputFile);
    const baseName = path.basename(inputFile, '.ts');

    const outputCppFile = path.join(outputDir, baseName + '.cpp');
    const outputAstFile = path.join(outputDir, baseName + '-ast.json');

    fs.writeFileSync(outputCppFile, cppCode, 'utf-8');
    console.log(`Transpiled file saved to: ${outputCppFile}`);

    fs.writeFileSync(outputAstFile, JSON.stringify(ast, null, 2), 'utf-8');
    console.log(`AST saved to: ${outputAstFile}`);
  }
}
