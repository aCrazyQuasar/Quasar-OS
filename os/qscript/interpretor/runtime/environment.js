/**
 * @file environment.js
 * @description Variable scope management for QScript.
 *
 * Responsibilities:
 * - Variable declaration
 * - Variable lookup
 * - Variable assignment
 * - Scope resolution
 * - Constant enforcement
 */

import { RuntimeValue } from "./values";

/**
 * Environment Class to store variables on a scope
 *
 * @export
 * @class Environment
 * @typedef {Environment}
 */
export class Environment {
    /**
     * Creates an instance of Environment.
     *
     * @constructor
     * @param {Environment | undefined} parent 
     */
    constructor(parent) {
        this.parent = parent;

        /** @type {Map<string, RuntimeValue>} */
        this.variables = new Map();

        /** @type {Set<string>} */
        this.constants = new Set();
    }

    // * Declare Variable
    /**
     * Declare a variable in current Environment
     *
     * @param {string} name 
     * @param {RuntimeValue} value 
     * @param {boolean} [constant=false] 
     * @returns {RuntimeValue} 
     */
    declareVariable(name, value, constant = false) {
        // Check if variable already exists in current Environment
        if (this.variables.has(name)) {
            throw new Error(`Variable '${name}' is already declared.`);
        }
        this.variables.set(name, value);
        // Write name to constants for future reference if constant is true
        if (constant) {
            this.constants.add(name);
        }
        return value;
    }

    // * Assign Variable
    /**
     * Assign a value to a variable
     *
     * @param {string} name 
     * @param {RuntimeValue} value 
     * @returns {RuntimeValue} 
     */
    assignVariable(name, value) {
        const env = this.resolveVariable(name);
        // Check if variable is a constant
        if (env.constants.has(name)) {
            throw new Error(`Cannot reassign constant '${name}'.`);
        }
        // Assign value to variable in that Environment
        env.variables.set(name, value);
        return value;
    }

    // * Lookup Variable
    /**
     * Return the value of a variable
     *
     * @param {string} name 
     * @returns {RuntimeValue} 
     */
    lookupVariable(name) {
        const env = this.resolveVariable(name);
        return env.variables.get(name);
    }

    // * Resolve Variable
    /**
     * Find the Environment containing a variable
     *
     * @param {string} name 
     * @returns {Environment} 
     */
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