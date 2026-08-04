import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, NullLiteral, Identifier } from "./ast.js";
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
        return this.parse_expr();
    }
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
            case TokenType.Null:
                this.eat(); // consume 'null'
                return new NullLiteral();
            default:
                throw new Error(`Unexpected token: ${tk.type}`);
        }
    }
}