/**
 * @file ast.js
 * @description Defines the Abstract Syntax Tree used by QScript.
 *
 * Responsibilities:
 * - Define node types
 * - Define statement nodes
 * - Define expression nodes
 */

/**
 * Enumeration of all AST node types recognized by QScript.
 *
 * @type {Record<string, string>}
 */
export const NodeType = {
    // STATEMENTS
    Program: "Program",
    VariableDeclaration: "VariableDeclaration",

    // EXPRESSIONS
    AssignmentExpression: "AssignmentExpression",

    // literals
    Property: "Property",
    ObjectLiteral: "ObjectLiteral",
    NumericLiteral: "NumericLiteral",
    Identifier: "Identifier",
    BinaryExpression: "BinaryExpression",
}

// * AST Node Classes

// * STATEMENTS

// * General Statement
/**
 * General Statement
 *
 * @export
 * @class Stmt
 * @typedef {Stmt}
 */
export class Stmt {
    /**
     * Creates an instance of Stmt.
     *
     * @constructor
     * @param {string} kind 
     */
    constructor(kind) {
        this.kind = kind;
    }
}

// * PROGRAM
/**
 * Statement containing an array of statements in body[]
 *
 * @export
 * @class Program
 * @typedef {Program}
 * @extends {Stmt}
 */
export class Program extends Stmt {
    /**
     * Creates an instance of Program.
     *
     * @constructor
     * @param {Stmt[]} body 
     */
    constructor(body) {
        super(NodeType.Program);
        this.body = body;
    }
}

// * VARIABLE DECLARATION
/**
 * Statement to declare a variable
 *
 * @export
 * @class VariableDeclaration
 * @typedef {VariableDeclaration}
 * @extends {Stmt}
 */
export class VariableDeclaration extends Stmt {
    /**
     * Creates an instance of VariableDeclaration.
     *
     * @constructor
     * @param {boolean} constn 
     * @param {string} identifier 
     * @param {Expr | undefined} value 
     */
    constructor(constn, identifier, value) {
        super(NodeType.VariableDeclaration);
        this.constant = constn;
        this.identifier = identifier;
        this.value = value;
    }
}

// * EXPRESSIONS

// * General Expression
/**
 * General Expression
 *
 * @export
 * @class Expr
 * @typedef {Expr}
 * @extends {Stmt}
 */
export class Expr extends Stmt {
    /**
     * Creates an instance of Expr.
     *
     * @constructor
     * @param {string} kind 
     */
    constructor(kind) {
        super(kind);
    }
}

// * ASSIGNMENT EXPRESSION
/**
 * Assigns a value to a variable
 *
 * @export
 * @class AssignmentExpr
 * @typedef {AssignmentExpr}
 * @extends {Expr}
 */
export class AssignmentExpr extends Expr {
    /**
     * Creates an instance of AssignmentExpr.
     *
     * @constructor
     * @param {Expr} assinge 
     * @param {Expr} value 
     */
    constructor(assinge, value) {
        super(NodeType.AssignmentExpression);
        this.assigne = assinge;
        this.value = value;
    }
}

// * BINARY EXPRESSION
/**
 * Expression containing to values and an operator
 *
 * @export
 * @class BinaryExpr
 * @typedef {BinaryExpr}
 * @extends {Expr}
 */
export class BinaryExpr extends Expr {
    /**
     * Creates an instance of BinaryExpr.
     *
     * @constructor
     * @param {Expr} left 
     * @param {string} operator 
     * @param {Expr} right 
     */
    constructor(left, operator, right) {
        super(NodeType.BinaryExpression);
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

// * IDENTIFIER
/**
 * Represents a user-defined identifier in the source.
 *
 * @export
 * @class Identifier
 * @typedef {Identifier}
 * @extends {Expr}
 */
export class Identifier extends Expr {
    /**
     * Creates an instance of Identifier.
     *
     * @constructor
     * @param {string} symbol 
     */
    constructor(symbol) {
        super(NodeType.Identifier);
        this.symbol = symbol;
    }
}

// * NUMERIC LITERAL
/**
 * AST version of a number
 *
 * @export
 * @class NumericLiteral
 * @typedef {NumericLiteral}
 * @extends {Expr}
 */
export class NumericLiteral extends Expr {
    /**
     * Creates an instance of NumericLiteral.
     *
     * @constructor
     * @param {number} value 
     */
    constructor(value) {
        super(NodeType.NumericLiteral);
        this.value = value;
    }
}

// * PROPERTIES
/**
 * Property AST Node
 *
 * @export
 * @class Property
 * @typedef {Property}
 * @extends {Expr}
 */
export class Property extends Expr {
    /**
     * Creates an instance of Property.
     *
     * @constructor
     * @param {string} key 
     * @param {Expr | undefined} value 
     */
    constructor(key, value) {
        super(NodeType.Property);
        this.key = key;
        this.value = value;
    }
}

// * OBJECT LITERAL
/**
 * Object literally class
 *
 * @export
 * @class ObjectLiteral
 * @typedef {ObjectLiteral}
 * @extends {Expr}
 */
export class ObjectLiteral extends Expr {
    /**
     * Creates an instance of ObjectLiteral.
     *
     * @constructor
     * @param {Property[]} properties 
     */
    constructor(properties) {
        super(NodeType.ObjectLiteral);
        this.properties = properties;
    }
}