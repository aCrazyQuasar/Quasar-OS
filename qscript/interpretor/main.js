import { tokenize } from "./frontend/lexer.js";
import { Parser } from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
const code = document.getElementById('code');
const runcodeBtn = document.getElementById('run-code-btn');
runcodeBtn.addEventListener('click', runCode);
function runCode() {
    const parser = new Parser();
    const tokens = tokenize(code.value);
    console.log(tokens);
    const ast = parser.produceAST(code.value);
    console.log(ast);
    const result = evaluate(ast);
    console.log(result);
}