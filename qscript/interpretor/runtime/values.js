export const ValueType = {
    "null": "null",
    "number": "number"
}
export class RuntimeValue {
    constructor(type, value) {
        this.type = type;
    }
}
export class NullValue extends RuntimeValue {
    constructor() {
        super(ValueType.null);
        this.value = "null"
    }
}
export class NumberValue extends RuntimeValue {
    constructor(value) {
        super(ValueType.number);
        this.value = value;
    }
}