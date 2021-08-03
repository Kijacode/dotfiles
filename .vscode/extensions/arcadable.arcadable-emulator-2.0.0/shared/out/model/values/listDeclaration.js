"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDeclaration = void 0;
const value_1 = require("./value");
const valueArrayValueType_1 = require("./valueArrayValueType");
class ListDeclaration extends valueArrayValueType_1.ValueArrayValueType {
    constructor(ID, size, values, name, game) {
        super(ID, size, value_1.ValueType.listDeclaration, name, game);
        this.values = values;
    }
    async get() {
        return this.values;
    }
    async set(newValue) {
        this.values = newValue;
    }
    async isTruthy() {
        return true;
    }
}
exports.ListDeclaration = ListDeclaration;
//# sourceMappingURL=listDeclaration.js.map