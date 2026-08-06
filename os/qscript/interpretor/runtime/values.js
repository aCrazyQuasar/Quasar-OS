/**
 * @file values.js
 * @description Defines all runtime values used by the QScript interpreter.
 *
 * Responsibilities:
 * - Represent runtime data
 * - Provide type information
 * - Standardize interpreter outputs
 */

// * RUNTIME VALUE TYPES
/**
 * Base class for all runtime values.
 *
 * Every value produced by the interpreter
 * derives from RuntimeValue.
 *
 * @type {Record<string, string>}
 */
export const ValueType = Object.freeze({
    null: "null",
    number: "number",
    boolean: "boolean"
});

// * RUNTIME VALUES
/**
 * Value used in the runtime
 *
 * @export
 * @class RuntimeValue
 * @typedef {RuntimeValue}
 */
export class RuntimeValue {
    /**
     * Creates an instance of RuntimeValue.
     *
     * @constructor
     * @param {string} type  
     */
    constructor(type) {
        this.type = type;
    }
}

// * NULL VALUE
/**
 * Nonexistent runtime value
 *
 * @export
 * @class NullValue
 * @typedef {NullValue}
 * @extends {RuntimeValue}
 */
export class NullValue extends RuntimeValue {
    /**
     * Creates an instance of NullValue.
     *
     * @constructor
     */
    constructor() {
        super(ValueType.null);
        this.value = null;
    }
}
/**
 * Create a Null Value
 *
 * @export
 * @returns {NullValue} 
 */
export function MK_NULL() {
    return new NullValue();
}

// * BOOLEAN VALUE
/**
 * True/False value
 *
 * @export
 * @class BooleanValue
 * @typedef {BooleanValue}
 * @extends {RuntimeValue}
 */
export class BooleanValue extends RuntimeValue {
    /**
     * Creates an instance of BooleanValue.
     *
     * @constructor
     * @param {boolean} value 
     */
    constructor(value) {
        super(ValueType.boolean);
        this.value = value;
    }
}
/**
 * Make a Boolean Value
 *
 * @export
 * @param {boolean} value 
 * @returns {BooleanValue} 
 */
export function MK_BOOL(value) {
    return new BooleanValue(value);
}

// * NUMBER VALUE
/**
 * Value for number
 *
 * @export
 * @class NumberValue
 * @typedef {NumberValue}
 * @extends {RuntimeValue}
 */
export class NumberValue extends RuntimeValue {
    /**
     * Creates an instance of NumberValue.
     *
     * @constructor
     * @param {number} value 
     */
    constructor(value) {
        super(ValueType.number);
        this.value = value;
    }
}
/**
 * Create a Number
 *
 * @export
 * @param {number} value 
 * @returns {NumberValue} 
 */
export function MK_NUMBER(value) {
    return new NumberValue(value);
}