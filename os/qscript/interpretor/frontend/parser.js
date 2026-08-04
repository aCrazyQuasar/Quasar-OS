import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VariableDeclaration } from "./ast.js";
import { tokenize, Token, TokenType } from "./lexer.js";

export class Parser {

    constructor() {
        this.tokens = [];
    }

    not_eof() {
        return this.tokens[0].type !== TokenType.EOF;
    }
    at() {
        return this.tokens[0];
    }
    eat() {
        return this.tokens.shift();
    }
    expect(type, err) {
        const prev = this.eat();
        if (prev.type !== type) {
            throw new Error(err);
        }
        return prev;
    }

    produceAST(sourceCode) {
        this.tokens = tokenize(sourceCode);
        const program = new Program([]);

        // Parse Until EOF
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    parse_stmt() {
        switch (this.at().type) {
            case TokenType.Set:
                return this.parse_var_declaration();
            default:
                return this.parse_expr();
        }
    }
    parse_var_declaration() {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected identifier").value;
        if (this.at().type == TokenType.Semicolon) {
            this.eat(); // consume ';'
            if (isConstant) {
                throw new Error("Constant variables must be initialized");
            }
            return new VariableDeclaration(false, identifier);
        }

        this.expect(TokenType.Equals, "Expected assignment operator");
        const declaration = new VariableDeclaration(isConstant, identifier, this.parse_expr());
        this.expect(TokenType.Semicolon, "Expected semicolon");
        return declaration;
    }

    // Expr
    parse_expr() {
        return this.parse_additive_expr();
    }
    parse_additive_expr() {
        let left = this.parse_multiplicative_expr();

        while (this.at().value === '+' || this.at().value === '-') {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = new BinaryExpr(left, operator, right);
        }

        return left;
    }
    parse_multiplicative_expr() {
        let left = this.parse_primary_expr();

        while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%') {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = new BinaryExpr(left, operator, right);
        }

        return left;
    }
    parse_primary_expr() {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return new Identifier(this.eat().value);
            case TokenType.Number:
                return new NumericLiteral(parseFloat(this.eat().value));
            case TokenType.OpenParen:
                this.eat(); // consume '('
                const expr = this.parse_expr();
                this.expect(TokenType.CloseParen, "Expected closing parenthesis");
                return expr;
            default:
                throw new Error(`Unexpected token: ${tk.type}`);
        }
    }
}