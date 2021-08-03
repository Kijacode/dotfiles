"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawCircleInstruction = void 0;
const callStack_1 = require("../callStack");
const instruction_1 = require("./instruction");
class DrawCircleInstruction extends instruction_1.Instruction {
    constructor(ID, colorValue, radiusValue, xValue, yValue, name, game, await) {
        super(ID, instruction_1.InstructionType.DrawCircle, name, game, await);
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
                    command: 'drawCircle',
                    color,
                    radius,
                    centerX,
                    centerY
                });
                return [];
            }, async, false, [], null, null)];
    }
}
exports.DrawCircleInstruction = DrawCircleInstruction;
//# sourceMappingURL=drawCircleInstruction.js.map