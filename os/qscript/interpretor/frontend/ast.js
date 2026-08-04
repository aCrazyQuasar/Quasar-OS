export const NodeType = {
    // STATEMENTS
    Program: "Program",
    VariableDeclaration: "VariableDeclaration",

    // EXPRESSIONS
    NumericLiteral: "NumericLiteral",
    Identifier: "Identifier",
    BinaryExpression: "BinaryExpression",
}

export class Stmt {
    constructor(kind) {
        this.kind = kind;
    }
}
export class Program extends Stmt {
    constructor(body) {
        super(NodeType.Program);
        this.body = body;
    }
}
export class VariableDeclaration extends Stmt {
    constructor(constn, identifier, value) {
        super(NodeType.VariableDeclaration);
        this.constant = constn;
        this.identifier = identifier;
        this.value = value;
    }
}
export class Expr extends Stmt {
    constructor(kind) {
        super(kind);
    }
}
export class BinaryExpr extends Expr {
    constructor(left, operator, right) {
        super(NodeType.BinaryExpression);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
export class Identifier extends Expr {
    constructor(symbol) {
        super(NodeType.Identifier);
        this.symbol = symbol;
    }
}
export class NumericLiteral extends Expr {
    constructor(value) {
        super(NodeType.NumericLiteral);
        this.value = value;
    }
}