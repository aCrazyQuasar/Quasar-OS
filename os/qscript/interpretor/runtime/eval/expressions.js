import { AssignmentExpr, BinaryExpr, Identifier, NodeType} from "../../frontend/ast.js";
import { Environment } from "../Environment.js";
import { evaluate } from "../interpreter.js";
import { ValueType, NumberValue, RuntimeValue, MK_NULL, MK_NUMBER } from "../values.js";

// * BINARY EXPRESSIONS
/**
 * Evaluates a binary expression node
 *
 * @export
 * @param {BinaryExpr} binop 
 * @param {Environment} env 
 * @returns {RuntimeValue} 
 */
export function evaluate_binary_expr(binop, env) {

    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type === ValueType.number && rhs.type === ValueType.number) {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }

    return MK_NULL();
}
/**
 * Evaluates the numerical version of a binary expression
 *
 * @param {NumberValue} lhs 
 * @param {NumberValue} rhs 
 * @param {string} operator 
 * @returns {RuntimeValue} 
 */
function eval_numeric_binary_expr(lhs, rhs, operator) {
    switch (operator) {
        case "+":
            return MK_NUMBER(lhs.value + rhs.value);
        case "-":
            return MK_NUMBER(lhs.value - rhs.value);
        case "*":
            return MK_NUMBER(lhs.value * rhs.value);
        case "/":
            // TODO: Divide by 0
            return MK_NUMBER(lhs.value / rhs.value);
        case "%":
            return MK_NUMBER(lhs.value % rhs.value);
        default:
            throw new Error(`Unhandled operator: ${operator}`);
    }
}

// * IDENTIFIERS
/**
 * Evaluates Identifier expressions
 *
 * @export
 * @param {Identifier} ident 
 * @param {Environment} env 
 * @returns {RuntimeValue} 
 */
export function eval_identifier(ident, env) {
    return env.lookupVariable(ident.symbol);
}

// * ASSIGNMENT
/**
 * Assigns a value to a variables
 *
 * @export
 * @param {AssignmentExpr} node 
 * @param {Environment} env 
 */
export function eval_assignment(node, env) {
    if (node.assigne.kind !== NodeType.Identifier) {
        throw new Error("Invalid LHS in assignment expression.")
    }

    const varname = node.assigne.symbol;
    return env.assignVariable(varname, evaluate(node.value, env));
}