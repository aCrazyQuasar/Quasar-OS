import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import { NumberValue, BooleanValue, NullValue } from "./runtime/values.js";
import { Environment } from "./runtime/Environment.js";
import { tokenize } from "./frontend/lexer.js";

// Dom
const code = document.getElementById('code');
const runcodeBtn = document.getElementById('run-code-btn');
runcodeBtn.addEventListener('click', runCode);

//  Run func
function runCode() {
    const parser = new Parser();
    const env = new Environment();

    // Vars
    env.declareVariable("true", new BooleanValue(true), true);
    env.declareVariable("false", new BooleanValue(false), true);
    env.declareVariable("null", new NullValue(), true);

    // Tokenize
    const tokens = tokenize(code.value);
    console.log(tokens);

    // Parse
    const ast = parser.produceAST(code.value);
    console.log(ast);

    // Evaluate
    const result = evaluate(ast, env);
    console.log(result);
}