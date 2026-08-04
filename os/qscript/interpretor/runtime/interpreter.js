import { ValueType, RuntimeValue, NumberValue, NullValue, BooleanValue } from "./values.js";
import { NodeType, Stmt } from "../frontend/ast.js";
import { eval_program, eval_var_declaration } from "./eval/statements.js";
import { eval_identifier, evaluate_binary_expr } from "./eval/expressions.js";

export function evaluate(node, env) {
    switch (node.kind) {
        case "NumericLiteral":
            return new NumberValue(node.value);
        case "Identifier":
            return eval_identifier(node, env);
        case "BinaryExpression":
            return evaluate_binary_expr(node, env);
        case "Program":
            return eval_program(node, env);
        case "VariableDeclaration":
            return eval_var_declaration(node, env);
        default:
            throw new Error(`Unhandled node kind: ${node.kind}`);
    }
}