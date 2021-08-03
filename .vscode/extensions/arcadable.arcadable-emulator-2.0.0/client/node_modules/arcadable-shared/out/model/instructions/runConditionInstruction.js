"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunConditionInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class RunConditionInstruction extends instruction_1.Instruction {
    constructor(ID, evaluationValue, successSet, failSet, name, game, await) {
        super(ID, instruction_1.InstructionType.RunCondition, name, game, await);
        this.evaluationValue = evaluationValue;
        this.successSet = successSet;
        this.failSet = failSet;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                if (await this.evaluationValue.getObject().isTruthy()) {
                    return this.successSet.getExecutables();
                }
                else if (this.failSet) {
                    return this.failSet.getExecutables();
                }
                return [];
            }, async, false, [], null, null)];
    }
}
exports.RunConditionInstruction = RunConditionInstruction;
//# sourceMappingURL=runConditionInstruction.js.map