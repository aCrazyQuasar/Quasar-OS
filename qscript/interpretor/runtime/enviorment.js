export class Enviorment {
    constructor(parent) {
        this.parent = parent;
        this.variables = new Map();
        this.constants = new Set();
    }

    declareVariable(name, value, constant = false) {
        if (this.variables.has(name)) {
            throw new Error(`Variable '${name}' is already declared.`);
        }
        const val = this.variables.set(name, value);
        if (constant) {
            this.constants.add(name);
        }
        return val;
    }

    assignVariable(name, value) {
        if (this.constants.has(name)) {
            throw new Error(`Cannot reassign constant '${name}'.`);
        }
        const env = this.resolveVariable(name);
        this.variables.set(name, value);
        return value;
    }

    lookupVariable(name) {
        const env = this.resolveVariable(name);
        return env.variables.get(name);
    }

    resolveVariable(name) {
        if (this.variables.has(name)) {
            return this;
        }
        if (this.parent) {
            return this.parent.resolveVariable(name);
        }
        throw new Error(`Variable '${name}' is not declared.`);
    }
}