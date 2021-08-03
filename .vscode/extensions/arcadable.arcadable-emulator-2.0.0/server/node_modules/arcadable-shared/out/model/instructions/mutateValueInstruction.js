"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutateValueInstruction = void 0;
const callStack_1 = require("./../callStack");
const instruction_1 = require("./instruction");
class MutateValueInstruction extends instruction_1.Instruction {
    constructor(ID, leftValue, rightValue, name, game, await) {
        super(ID, instruction_1.InstructionType.MutateValue, name, game, await);
        this.leftValue = leftValue;
        this.rightValue = rightValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const valueLeft = this.leftValue.getObject();
                const right = await this.rightValue.getValue();
                await valueLeft.set(right);
                return [];
            }, async, false, [], null, null)];
    }
}
exports.MutateValueInstruction = MutateValueInstruction;
//# sourceMappingURL=mutateValueInstruction.js.map