import { QScriptError } from "../runtime/errors.js";
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VariableDeclaration } from "./ast.js";
import { tokenize, Token, TokenType } from "./lexer.js";


/**
 * Parses Tokens into AST (Abstract Syntax Tree)
 *
 * @export
 * @class Parser
 * @typedef {Parser}
 */
export class Parser {

    /**
     * Creates an instance of Parser.
     * No Params
     *
     * @constructor
     */
    constructor() {
        /** @type {Token[]} */
        this.tokens = [];
    }

    // * Helper Methods

    /**
     * Check if we are not at end of file
     * @returns {boolean} 
     */
    #not_eof() {
        return this.tokens[0].type !== TokenType.EOF;
    }
    
    /**
     * Returns the current token
     * @returns {Token} 
     */
    #at() {
        return this.tokens[0];
    }
    
    /**
     * Return the currrent token and advance to the next one
     * @returns {Token} 
     */
    #eat() {
        return this.tokens.shift();
    }
    
    /**
     * Expect specific token, and consume it, otherwise throw an error
     *
     * @param {TokenType} type 
     * @param {string} err 
     * @returns {Token} 
     */
    #expect(type, err) {
        const prev = this.#eat();
        if (prev.type !== type) {
            throw new QScriptError(
                err || `Expected token of type ${type}, but got ${prev.type}`,
                "SyntaxError", 
                prev.line, 
                prev.column
            );
        }
        return prev;
    }

    // * PUBLIC METHODS
    /**
     * Parses source code into an Abstract Syntax Tree.
     *
     * This is the main entry point of the parser.
     *
     * @param {string} sourceCode Source code to parse.
     * @returns {Program} Root AST node.
     */
    produceAST(sourceCode) {
        this.tokens = tokenize(sourceCode);
        const program = new Program([]);

        // Parse Until EOF
        while (this.#not_eof()) {
            program.body.push(this.#parse_stmt());
        }

        return program;
    }

    // * STATEMENT PARSING

    // Parse general statements, and dispatch to specific statement parsing methods
    #parse_stmt() {
        // cases
        switch (this.#at().type) {
            case TokenType.Set:
            case TokenType.Const:
                return this.#parse_var_declaration();
            default:
                return this.#parse_expr(); // fallback
        }
    }

    // Parse variable declaration statements
    #parse_var_declaration() {   
        const isConstant = this.#eat().type == TokenType.Const; // check if it's a constant declaration
        const identifier = this.#expect(TokenType.Identifier, "Expected identifier").value;

        if (this.#at().type == TokenType.Semicolon) {
            this.#eat(); // consume ';'
            if (isConstant) {
                throw new QScriptError(
                    "Constant variables must be initialized",
                    "SyntaxError",
                    this.#at().line,
                    this.#at().column
                );
            }
            return new VariableDeclaration(false, identifier);  
        }

        this.#expect(TokenType.Equals, "Expected assignment operator");
        const declaration = new VariableDeclaration(isConstant, identifier, this.#parse_expr());
        this.#expect(TokenType.Semicolon, "Expected semicolon");

        return declaration;
    }

    // * EXPRESSION PARSING
    // Follows order of precedence

    // general expression parsing method, dispatches to specific expression parsing methods
    #parse_expr() {
        // TODO: Lookahead implimentation

        return this.#parse_additive_expr();
    }
    
    // Addition and subtraction
    #parse_additive_expr() {
        let left = this.#parse_multiplicative_expr();

        while (this.#at().value === '+' || this.#at().value === '-') { 
            const operator = this.#eat().value;
            const right = this.#parse_multiplicative_expr();
            left = new BinaryExpr(left, operator, right); // continue recursively
        }

        return left;
    }

    // Multiplication, division, and modulus
    #parse_multiplicative_expr() {
        // same as additive, but with different operators, and higher precedence
        let left = this.#parse_primary_expr();

        while (this.#at().value === '*' || this.#at().value === '/' || this.#at().value === '%') {
            const operator = this.#eat().value;
            const right = this.#parse_primary_expr();
            left = new BinaryExpr(left, operator, right);
        }

        return left;
    }

    // Primary expressions: identifiers, literals, and parenthesized expressions
    #parse_primary_expr() {
        const tk = this.#at().type;

        // handle cases
        switch (tk) {
            case TokenType.Identifier:
                return new Identifier(this.#eat().value);
            case TokenType.Number:
                return new NumericLiteral(parseFloat(this.#eat().value));
            case TokenType.OpenParen:
                this.#eat(); // consume '('
                const expr = this.#parse_expr();
                this.#expect(TokenType.CloseParen, "Expected closing parenthesis");
                return expr;
            default:
                throw new QScriptError(
                    `Unexpected token: ${tk}`,
                    "SyntaxError", 
                    this.#at().line, 
                    this.#at().column); // fallback error for unexpected tokens
        }
    }
}