"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfigValue = void 0;
const _numberValueType_1 = require("./_numberValueType");
const value_1 = require("./value");
class SystemConfigValue extends _numberValueType_1.NumberValueType {
    constructor(ID, configType, name, game) {
        super(ID, value_1.ValueType.systemPointer, name, game);
        this.configType = configType;
    }
    async get() {
        return this.game.systemConfig.get(this.configType);
    }
    async set(newValue) {
    }
    async isTruthy() {
        return (await this.get()) !== 0;
    }
}
exports.SystemConfigValue = SystemConfigValue;
//# sourceMappingURL=systemConfigValue.js.map