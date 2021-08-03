"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FillCircleInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class FillCircleInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, radiusValue, xValue, yValue, name, game, await) {
        super(ID, instruction_1.InstructionType.FillCircle, name, game, await);
        this.colorValue = colorValue;
        this.radiusValue = radiusValue;
        this.xValue = xValue;
        this.yValue = yValue;
        this.await = await;
    }
    async getExecutables(async) {
        return [new callStack_1.Executable(async () => {
                const [color, radius, centerX, centerY] = await Promise.all([
                    this.colorValue.getValue(),
                    this.radiusValue.getValue(),
                    this.xValue.getValue(),
                    this.yValue.getValue()
                ]);
                this.game.instructionEmitter.next({
                    command: 'fillCircle',
                    color,
                    radius,
                    centerX,
                    centerY
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.FillCircleInstruction = FillCircleInstruction;
//# sourceMappingURL=fillCircleInstruction.js.map