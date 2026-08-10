import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { MK_BOOL, MK_NULL } from "./runtime/values.js";
import { createGlobalEnvironment, Environment } from "./runtime/Environment.js";
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
        const env = createGlobalEnvironment();

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