import { Program } from "../../frontend/ast.js";
import { Enviorment } from "../enviorment.js";
import { evaluate } from "../interpreter.js";
import { NullValue, RuntimeValue } from "../values.js";

export function eval_program(program, env) {
    let lastEvaluated = new NullValue();

    for (const stmt of program.body) {
        lastEvaluated = evaluate(stmt, env);
    }
    return lastEvaluated;
}
export function eval_var_declaration(decl, env) {
    const value = decl.value ? evaluate(decl.value, env) : new NullValue();
    return env.declareVariable(decl.identifier, value, decl.constant);
}