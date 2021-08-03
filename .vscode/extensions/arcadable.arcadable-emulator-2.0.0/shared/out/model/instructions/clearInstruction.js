"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class ClearInstruction extends instruction_1.Instruction {
    constructor(ID, name, game, await) {
        super(ID, instruction_1.InstructionType.Clear, name, game, await);
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                this.game.instructionEmitter.next({
                    command: 'clear'
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.ClearInstruction = ClearInstruction;
//# sourceMappingURL=clearInstruction.js.map