"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.InstructionPointer = exports.Instruction = exports.instructionTypes = exports.InstructionType = void 0;
var logicElement_1 = require("../logicElement");
var InstructionType;
(function (InstructionType) {
    InstructionType[InstructionType["MutateValue"] = 0] = "MutateValue";
    InstructionType[InstructionType["RunCondition"] = 1] = "RunCondition";
    InstructionType[InstructionType["DrawPixel"] = 2] = "DrawPixel";
    InstructionType[InstructionType["DrawLine"] = 3] = "DrawLine";
    InstructionType[InstructionType["DrawRect"] = 4] = "DrawRect";
    InstructionType[InstructionType["FillRect"] = 5] = "FillRect";
    InstructionType[InstructionType["DrawCircle"] = 6] = "DrawCircle";
    InstructionType[InstructionType["FillCircle"] = 7] = "FillCircle";
    InstructionType[InstructionType["DrawTriangle"] = 8] = "DrawTriangle";
    InstructionType[InstructionType["FillTriangle"] = 9] = "FillTriangle";
    InstructionType[InstructionType["DrawText"] = 10] = "DrawText";
    InstructionType[InstructionType["Clear"] = 11] = "Clear";
    InstructionType[InstructionType["SetRotation"] = 12] = "SetRotation";
    InstructionType[InstructionType["RunSet"] = 13] = "RunSet";
    InstructionType[InstructionType["DebugLog"] = 14] = "DebugLog";
    InstructionType[InstructionType["InstructionSet"] = 15] = "InstructionSet";
    InstructionType[InstructionType["DrawImage"] = 16] = "DrawImage";
    InstructionType[InstructionType["Wait"] = 17] = "Wait";
    InstructionType[InstructionType["Tone"] = 18] = "Tone";
    InstructionType[InstructionType["AwaitedRunSet"] = 19] = "AwaitedRunSet";
    InstructionType[InstructionType["AwaitedRunCondition"] = 20] = "AwaitedRunCondition";
    InstructionType[InstructionType["AwaitedTone"] = 21] = "AwaitedTone";
})(InstructionType = exports.InstructionType || (exports.InstructionType = {}));
exports.instructionTypes = Object.keys(InstructionType)
    .filter(function (key) { return isNaN(Number(InstructionType[key])); }).map(function (value) {
    switch (Number(value)) {
        case InstructionType.MutateValue:
            return { viewValue: 'Mutate value', codeValue: null, value: Number(value) };
        case InstructionType.RunCondition:
            return { viewValue: 'Run condition', codeValue: "if () {\n\n}", value: Number(value) };
        case InstructionType.DrawPixel:
            return { viewValue: 'Draw pixel', codeValue: 'draw.drawPixel(color, x, y);', value: Number(value) };
        case InstructionType.DrawLine:
            return { viewValue: 'Draw line', codeValue: 'draw.drawLine(color, x1, y1, x2, y2);', value: Number(value) };
        case InstructionType.DrawRect:
            return { viewValue: 'Draw rect', codeValue: 'draw.drawRect(color, tlX, tlY, brX, brY);', value: Number(value) };
        case InstructionType.FillRect:
            return { viewValue: 'Fill rect', codeValue: 'draw.fillRect(color, tlX, tlY, brX, brY);', value: Number(value) };
        case InstructionType.DrawCircle:
            return { viewValue: 'Draw circle', codeValue: 'draw.drawCircle(color, radius, x, y);', value: Number(value) };
        case InstructionType.FillCircle:
            return { viewValue: 'Fill circle', codeValue: 'draw.fillCircle(color, radius, x, y);', value: Number(value) };
        case InstructionType.DrawTriangle:
            return { viewValue: 'Draw triangle', codeValue: 'draw.drawTriangle(color, x1, y1, x2, y2, x3, y3);', value: Number(value) };
        case InstructionType.FillTriangle:
            return { viewValue: 'Fill triangle', codeValue: 'draw.fillTriangle(color, x1, y1, x2, y2, x3, y3);', value: Number(value) };
        case InstructionType.DrawText:
            return { viewValue: 'Draw text', codeValue: 'draw.drawText(color, size, text, x, y);', value: Number(value) };
        case InstructionType.DrawImage:
            return { viewValue: 'Draw image', codeValue: 'draw.drawImage(x, y, imageData);', value: Number(value) };
        case InstructionType.Clear:
            return { viewValue: 'Clear', codeValue: 'draw.clear;', value: Number(value) };
        case InstructionType.SetRotation:
            return { viewValue: 'Set rotation', codeValue: 'draw.setRotation(rotation);', value: Number(value) };
        case InstructionType.RunSet:
            return { viewValue: 'Run instructionset', codeValue: 'execute();', value: Number(value) };
        case InstructionType.DebugLog:
            return { viewValue: 'Log value', codeValue: 'log(value);', value: Number(value) };
        case InstructionType.Wait:
            return { viewValue: 'Wait', codeValue: 'wait(millis);', value: Number(value) };
        case InstructionType.Tone:
            return { viewValue: 'Tone', codeValue: 'tone(speaker, volume, frequency, duration);', value: Number(value) };
        default:
            return { viewValue: '', value: 0 };
    }
});
var Instruction = /** @class */ (function (_super) {
    __extends(Instruction, _super);
    function Instruction(ID, instructionType, name, game, await) {
        var _this = _super.call(this, ID, name, game) || this;
        _this.instructionType = instructionType;
        _this.await = await;
        return _this;
    }
    return Instruction;
}(logicElement_1.LogicElement));
exports.Instruction = Instruction;
var InstructionPointer = /** @class */ (function () {
    function InstructionPointer(ID, game) {
        this.ID = ID;
        this.game = game;
    }
    InstructionPointer.prototype.await = function () {
        return this.game.instructions[this.ID].await;
    };
    InstructionPointer.prototype.getExecutables = function (async) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.game.instructions[this.ID].getExecutables(async)];
            });
        });
    };
    return InstructionPointer;
}());
exports.InstructionPointer = InstructionPointer;
