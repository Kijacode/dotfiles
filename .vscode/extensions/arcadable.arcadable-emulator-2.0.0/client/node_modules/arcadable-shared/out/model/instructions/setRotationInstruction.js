"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRotationInstruction = void 0;
const callStack_1 = require("./../callStack");
const instruction_1 = require("./instruction");
class SetRotationInstruction extends instruction_1.Instruction {
    constructor(ID, rotationValue, name, game, await) {
        super(ID, instruction_1.InstructionType.SetRotation, name, game, await);
        this.rotationValue = rotationValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const rotation = await this.rotationValue.getValue();
                this.game.instructionEmitter.next({
                    command: 'setRotation',
                    rotation,
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.SetRotationInstruction = SetRotationInstruction;
//# sourceMappingURL=setRotationInstruction.js.map