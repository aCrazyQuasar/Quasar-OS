import { Program, VariableDeclaration } from "../../frontend/ast.js";
import { Environment } from "../Environment.js";
import { evaluate } from "../interpreter.js";
import { MK_NULL, RuntimeValue } from "../values.js";

// * PROGRAM
/**
 * Evaluates a Program Node
 *
 * @export
 * @param {Program} program 
 * @param {Environment} env 
 * @returns {RuntimeValue} 
 */
export function eval_program(program, env) {
    let lastEvaluated = MK_NULL();

    for (const stmt of program.body) {
        lastEvaluated = evaluate(stmt, env);
    }
    return lastEvaluated;
}

// * VARIABLE DECLARATION
/**
 * Evaluates a variable declaration statement
 *
 * @export
 * @param {VariableDeclaration} decl 
 * @param {Environment} env 
 * @returns {RuntimeValue} 
 */
export function eval_var_declaration(decl, env) {
    const value = decl.value ? evaluate(decl.value, env) : MK_NULL();
    return env.declareVariable(decl.identifier, value, decl.constant);
}