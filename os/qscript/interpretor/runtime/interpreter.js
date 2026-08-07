import { RuntimeValue } from "./values.js";
import { NodeType, Stmt } from "../frontend/ast.js";
import { NumberValue } from "./values.js";

// ! OTHER INTERPRETER FUNCTIONS GO IN THESES FILES
import { eval_program, eval_var_declaration } from "./eval/statements.js";
import { eval_assignment, eval_identifier, evaluate_binary_expr } from "./eval/expressions.js";

/**
 * Default an stem evalutate function
 *  - Switches to sperate functions depending on the case
 *
 * @export
 * @param {Stmt} node 
 * @param {Environment} env 
 * @returns {RuntimeValue} 
 */
export function evaluate(node, env) {
    switch (node.kind) {
        case NodeType.NumericLiteral:
            return new NumberValue(node.value);
        case NodeType.Identifier:
            return eval_identifier(node, env);
        case NodeType.AssignmentExpression:
            return eval_assignment(node, env);
        case NodeType.BinaryExpression:
            return evaluate_binary_expr(node, env);
        case NodeType.Program:
            return eval_program(node, env);
        case NodeType.VariableDeclaration:
            return eval_var_declaration(node, env);
        default:
            throw new Error(`Unhandled node kind: ${node.kind}`);
    }
}