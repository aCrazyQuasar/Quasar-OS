import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { MK_BOOL, MK_NULL } from "./runtime/values.js";
import { Environment } from "./runtime/Environment.js";
import { tokenize } from "./frontend/lexer.js";
import { QScriptError, showQscriptError } from "./runtime/errors.js";

// Dom
const code = document.getElementById('code');
const runcodeBtn = document.getElementById('run-code-btn');
runcodeBtn.addEventListener('click', runCode);

//  Run func
function runCode() {
    try {
        const parser = new Parser();
        const env = new Environment();

        // Vars
        env.declareVariable("true", MK_BOOL(true), true);
        env.declareVariable("false", MK_BOOL(false), true);
        env.declareVariable("null", MK_NULL(), true);

        // Tokenize
        const tokens = tokenize(code.value);
        console.log(tokens);

        // Parse
        const ast = parser.produceAST(code.value);
        console.log(ast);

        // Evaluate
        const result = evaluate(ast, env);
        console.log(result);

    } catch (error) {
        if (error instanceof QScriptError) {
            showQscriptError(error, code.value);
        } else {
            throw error;
        }
    }
}