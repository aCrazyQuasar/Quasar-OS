import { BinaryExpr, Identifier } from "../../frontend/ast.js";
import { Enviorment } from "../enviorment.js";
import { evaluate } from "../interpreter.js";
import { NumberValue, RuntimeValue, NullValue } from "../values.js";

export function evaluate_binary_expr(binop, env) {

    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

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

export function eval_identifier(ident, env) {
    const val = env.lookupVariable(ident.symbol);
    return val;
}