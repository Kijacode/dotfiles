"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListValue = void 0;
const value_1 = require("./value");
class ListValue extends value_1.Value {
    constructor(ID, listValue, listIndex, name, game) {
        super(ID, value_1.ValueType.listValue, name, game);
        this.listValue = listValue;
        this.listIndex = listIndex;
    }
    async get() {
        const index = await this.listIndex.getValue();
        if (index >= 0 && index < this.listValue.getObject().size) {
            const v = (await this.listValue.getValue())[index];
            return await v.getValue();
        }
        else {
            this.game.stop({ message: 'Index out of bounds! (index = ' + index + ', size = ' + this.listValue.getObject().size + ')', values: [this.listIndex.ID, this.listValue.ID], instructions: [] });
            return null;
        }
    }
    async set(newValue) {
        const index = await this.listIndex.getValue();
        if (index >= 0 && index < this.listValue.getObject().size) {
            const v = (await this.listValue.getValue())[index];
            return await v.getObject().set(newValue);
        }
        else {
            this.game.stop({ message: 'Index out of bounds!', values: [this.listIndex.ID, this.listValue.ID], instructions: [] });
            return;
        }
    }
    async isTruthy() {
        const index = await this.listIndex.getValue();
        const v = (await this.listValue.getValue())[index];
        return await v.getObject().isTruthy();
    }
}
exports.ListValue = ListValue;
//# sourceMappingURL=listValue.js.map