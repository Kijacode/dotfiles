"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValue = void 0;
const value_1 = require("./value");
const numberArrayValueType_1 = require("./numberArrayValueType");
class DataValue extends numberArrayValueType_1.NumberArrayValueType {
    constructor(ID, data, name, game) {
        super(ID, data.length, value_1.ValueType.data, name, game);
        this.data = data;
    }
    async get() {
        return this.data;
    }
    async set(s) {
        return;
    }
    async isTruthy() {
        return true;
    }
}
exports.DataValue = DataValue;
//# sourceMappingURL=dataValue.js.map