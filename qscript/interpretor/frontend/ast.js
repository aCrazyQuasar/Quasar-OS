export const NodeType = {
    Program: "Program",
    NumericLiteral: "NumericLiteral",
    Identifier: "Identifier",
    BinaryExpression: "BinaryExpression",
    NullLiteral: "NullLiteral"
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
export class NullLiteral extends Expr {
    constructor() {
        super(NodeType.NullLiteral);
        this.value = null;
    }
}