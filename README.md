# tplusplus (Transpiler | Typescript to C++) :weary:

I have no idea why, but here it is! A transpiler that parses **TypeScript-like** code into an **Abstract Syntax Tree (AST)** and then converts it to **C++** code. Cool, right? :information_desk_person:

## Features :green_heart::

- Parse **TypeScript**-like Code: It turns your code into an AST representation, capturing structure and logic. :cherries:
- Convert to **C++**: After parsing into the AST, it transpiles the structure into C++ code. :collision:

## Example Input (Typescript-like)

```ts
const myName: string = 'RickaPrincy';

function idk(value: number): number {
  return value * 5;
}
```

## Resulting C++ Code:

```cpp
#include <string>

std::string myName = "RickaPrincy";

int idk(int value) {
  return value * 5;
}
```

## Supported AST Node Types:

- **ProgramNode**: Represents the entire program.

- **StringLiteral**: Represents string literals.

- **NumericLiteral**: Represents numeric literals.

- **Identifier**: Represents variables.

- **FunctionDeclarationNode**: Represents function declarations.

- **BinaryExpressionNode**: Handles binary operations like `*`.

- **ReturnStatementNode**: Handles return statements.
