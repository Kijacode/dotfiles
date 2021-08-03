"use strict";
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
exports.Arcadable = void 0;
var rxjs_1 = require("rxjs");
var callStack_1 = require("./callStack");
var value_1 = require("./values/value");
var Arcadable = /** @class */ (function () {
    function Arcadable(systemConfig) {
        this.instructionEmitter = new rxjs_1.Subject();
        this.interruptedEmitter = new rxjs_1.Subject();
        this.unchangedValues = {};
        this.values = {};
        this.instructions = {};
        this.instructionSets = {};
        this.setupInstructionSet = 0;
        this.mainInstructionSet = 0;
        this.renderInstructionSet = 0;
        this.prevMainMillis = 0;
        this.prevRenderMillis = 0;
        this.startMillis = 0;
        this.mainCallStack = new callStack_1.CallStack();
        this.renderCallStack = new callStack_1.CallStack();
        this.systemConfig = systemConfig;
        this.startMillis = new Date().getTime();
    }
    Arcadable.prototype.setGameLogic = function (unchangedValues, values, instructions, instructionSets, setupInstructionSet, mainInstructionSet, renderInstructionSet) {
        var _this = this;
        Object.keys(this.unchangedValues).forEach(function (k) { return _this.unchangedValues[+k].game = undefined; });
        Object.keys(this.values).forEach(function (k) { return _this.values[+k].game = undefined; });
        Object.keys(this.instructions).forEach(function (k) { return _this.instructions[+k].game = undefined; });
        Object.keys(this.instructionSets).forEach(function (k) { return _this.instructionSets[+k].game = undefined; });
        this.unchangedValues = unchangedValues;
        this.values = values;
        this.instructions = instructions;
        this.instructionSets = instructionSets;
        this.setupInstructionSet = setupInstructionSet;
        this.mainInstructionSet = mainInstructionSet;
        this.renderInstructionSet = renderInstructionSet;
    };
    Arcadable.prototype.start = function () {
        var _this = this;
        this.mainCallStack = new callStack_1.CallStack(10000);
        this.renderCallStack = new callStack_1.CallStack(10000);
        Object.keys(this.values).forEach(function (k) {
            if (_this.values[Number(k)].type === value_1.ValueType.evaluation) {
                _this.values[Number(k)]._STATIC_RESULT = undefined;
            }
        });
        this.systemConfig.startMillis = new Date().getTime();
        this.startMain();
        this.startRender();
    };
    Arcadable.prototype.stop = function (error) {
        this.interruptedEmitter.next(error);
    };
    Arcadable.prototype.startRender = function () {
        var _this = this;
        var timerSubscr = rxjs_1.timer(0, this.systemConfig.targetRenderMillis).subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.doRenderStep()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.instructionEmitter.next({ message: 'An unexpected error occured.' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        var interruptSubscr = this.interruptedEmitter.subscribe(function (e) {
            timerSubscr.unsubscribe();
            interruptSubscr.unsubscribe();
        });
    };
    Arcadable.prototype.startMain = function () {
        var _this = this;
        var first = true;
        var timerSubscr = rxjs_1.timer(0, this.systemConfig.targetMainMillis).subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.doMainStep(first)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.instructionEmitter.next({ message: 'An unexpected error occured.' });
                        return [3 /*break*/, 3];
                    case 3:
                        first = false;
                        return [2 /*return*/];
                }
            });
        }); });
        var interruptSubscr = this.interruptedEmitter.subscribe(function (e) {
            timerSubscr.unsubscribe();
            interruptSubscr.unsubscribe();
        });
    };
    Arcadable.prototype.doMainStep = function (first) {
        return __awaiter(this, void 0, void 0, function () {
            var mainInstructionSet, _a, _b, _c, setupInstructionSet, _d, _e, _f;
            var _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        this.systemConfig.fetchInputValues();
                        this.mainCallStack.prepareStep();
                        mainInstructionSet = this.instructionSets[this.mainInstructionSet];
                        _b = (_a = (_g = this.mainCallStack).pushfront).apply;
                        _c = [_g];
                        return [4 /*yield*/, mainInstructionSet.getExecutables()];
                    case 1:
                        _b.apply(_a, _c.concat([(_j.sent())]));
                        if (!first) return [3 /*break*/, 3];
                        setupInstructionSet = this.instructionSets[this.setupInstructionSet];
                        _e = (_d = (_h = this.mainCallStack).pushfront).apply;
                        _f = [_h];
                        return [4 /*yield*/, setupInstructionSet.getExecutables()];
                    case 2:
                        _e.apply(_d, _f.concat([(_j.sent())]));
                        _j.label = 3;
                    case 3:
                        this.processCallStack(this.mainCallStack);
                        return [2 /*return*/];
                }
            });
        });
    };
    Arcadable.prototype.doRenderStep = function () {
        return __awaiter(this, void 0, void 0, function () {
            var renderInstructionSet, _a, _b, _c;
            var _d;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.renderCallStack.prepareStep();
                        renderInstructionSet = this.instructionSets[this.renderInstructionSet];
                        _b = (_a = (_d = this.renderCallStack).pushfront).apply;
                        _c = [_d];
                        return [4 /*yield*/, renderInstructionSet.getExecutables()];
                    case 1:
                        _b.apply(_a, _c.concat([(_e.sent())]));
                        this.renderCallStack.pushback(new callStack_1.Executable(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.instructionEmitter.next({ command: 'renderDone' });
                                return [2 /*return*/, []];
                            });
                        }); }, false, false, [], null, null));
                        this.processCallStack(this.renderCallStack);
                        return [2 /*return*/];
                }
            });
        });
    };
    Arcadable.prototype.processCallStack = function (callStack) {
        return __awaiter(this, void 0, void 0, function () {
            var executable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(callStack.size() > 0)) return [3 /*break*/, 8];
                        executable = callStack.pop();
                        if (!executable) return [3 /*break*/, 7];
                        return [4 /*yield*/, executable.checkWaitMillis()];
                    case 1:
                        _a.sent();
                        if (!!!executable.executeOnMillis) return [3 /*break*/, 5];
                        if (!(executable.executeOnMillis <= new Date().getTime())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.processExecutable(executable, callStack)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        callStack.delayScheduledSection(executable);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.processExecutable(executable, callStack)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (callStack.doProcessMore()) {
                            this.processCallStack(callStack);
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Arcadable.prototype.processExecutable = function (executable, callStack) {
        return __awaiter(this, void 0, void 0, function () {
            var newExecutables, waitFor_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, executable.action()];
                    case 1:
                        newExecutables = (_a.sent()).map(function (e) { return executable.parentAwait ? e.withParentAwait(executable.parentAwait) : e; });
                        if (newExecutables.length > 0) {
                            if (executable.async) {
                                if (executable.awaiting.length > 0) {
                                    waitFor_1 = new callStack_1.Executable(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, executable.awaiting.map(function (e) { return executable.parentAwait ? e.withParentAwait(executable.parentAwait) : e; })];
                                    }); }); }, true, false, [], executable.parentAwait, null);
                                    newExecutables = newExecutables.map(function (e) { return e.withParentAwait(waitFor_1); });
                                    callStack.pushfront.apply(callStack, newExecutables);
                                    if (executable.parentAwait) {
                                        callStack.pushinfrontof(executable.parentAwait, waitFor_1);
                                    }
                                    else {
                                        callStack.pushback(waitFor_1);
                                    }
                                }
                                else {
                                    callStack.pushfront.apply(callStack, newExecutables);
                                }
                            }
                            else {
                                callStack.pushfront.apply(callStack, newExecutables);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Arcadable;
}());
exports.Arcadable = Arcadable;
