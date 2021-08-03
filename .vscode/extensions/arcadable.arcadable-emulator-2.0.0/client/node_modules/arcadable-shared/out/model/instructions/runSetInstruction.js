"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunSetInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class RunSetInstruction extends instruction_1.Instruction {
    constructor(ID, set, name, game, await) {
        super(ID, instruction_1.InstructionType.RunSet, name, game, await);
        this.set = set;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                return this.set.getExecutables();
            }, async, false, [], null, null)];
    }
}
exports.RunSetInstruction = RunSetInstruction;
//# sourceMappingURL=runSetInstruction.js.map