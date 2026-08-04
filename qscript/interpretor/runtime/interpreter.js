import { ValueType, RuntimeValue, NullValue, NumberValue } from "./values.js";
import { NodeType, Stmt } from "../frontend/ast.js";

function eval_program(program) {
    let lastEvaluated = new NullValue();

    for (const stmt of program.body) {
        lastEvaluated = evaluate(stmt);
    }
    return lastEvaluated;
}
function evaluate_binary_expr(binop) {

    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type === "number" && rhs.type === "number") {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }

    return new NullValue();
}
function eval_numeric_binary_expr(lhs, rhs, operator) {
    switch (operator) {
        case "+":
            return new NumberValue(lhs.value + rhs.value);
        case "-":
            return new NumberValue(lhs.value - rhs.value);
        case "*":
            return new NumberValue(lhs.value * rhs.value);
        case "/":
            // TODO: Divide by 0
            return new NumberValue(lhs.value / rhs.value);
        case "%":
            return new NumberValue(lhs.value % rhs.value);
        default:
            throw new Error(`Unhandled operator: ${operator}`);
    }
}

export function evaluate(node) {
    switch (node.kind) {
        case "NumericLiteral":
            return new NumberValue(node.value);
        case "NullLiteral":
            return new NullValue();
        case "BinaryExpression":
            return evaluate_binary_expr(node);
        case "Program":
            return eval_program(node);
        default:
            throw new Error(`Unhandled node kind: ${node.kind}`);
    }
}