"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLogInstruction = void 0;
const instruction_1 = require("./instruction");
const callStack_1 = require("../callStack");
class DebugLogInstruction extends instruction_1.Instruction {
    constructor(ID, logValue, name, game, await) {
        super(ID, instruction_1.InstructionType.DebugLog, name, game, await);
        this.logValue = logValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const logValue = await this.logValue.getValue();
                this.game.instructionEmitter.next({
                    command: 'log',
                    value: logValue
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DebugLogInstruction = DebugLogInstruction;
//# sourceMappingURL=debugLogInstruction.js.map