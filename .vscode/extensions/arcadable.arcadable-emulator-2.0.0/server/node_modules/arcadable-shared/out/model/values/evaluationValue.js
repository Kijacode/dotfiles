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
exports.EvaluationValue = exports.evaluationOperatorTypes = exports.EvaluationOperator = void 0;
var _numberValueType_1 = require("./_numberValueType");
var value_1 = require("./value");
var EvaluationOperator;
(function (EvaluationOperator) {
    EvaluationOperator[EvaluationOperator["add"] = 0] = "add";
    EvaluationOperator[EvaluationOperator["sub"] = 1] = "sub";
    EvaluationOperator[EvaluationOperator["mul"] = 2] = "mul";
    EvaluationOperator[EvaluationOperator["subdiv"] = 3] = "subdiv";
    EvaluationOperator[EvaluationOperator["mod"] = 4] = "mod";
    EvaluationOperator[EvaluationOperator["b_and"] = 5] = "b_and";
    EvaluationOperator[EvaluationOperator["b_or"] = 6] = "b_or";
    EvaluationOperator[EvaluationOperator["b_xor"] = 7] = "b_xor";
    EvaluationOperator[EvaluationOperator["lsh"] = 8] = "lsh";
    EvaluationOperator[EvaluationOperator["rsh"] = 9] = "rsh";
    EvaluationOperator[EvaluationOperator["pow"] = 10] = "pow";
    EvaluationOperator[EvaluationOperator["eq"] = 11] = "eq";
    EvaluationOperator[EvaluationOperator["ne"] = 12] = "ne";
    EvaluationOperator[EvaluationOperator["gt"] = 13] = "gt";
    EvaluationOperator[EvaluationOperator["lt"] = 14] = "lt";
    EvaluationOperator[EvaluationOperator["ge"] = 15] = "ge";
    EvaluationOperator[EvaluationOperator["le"] = 16] = "le";
})(EvaluationOperator = exports.EvaluationOperator || (exports.EvaluationOperator = {}));
exports.evaluationOperatorTypes = Object.keys(EvaluationOperator)
    .filter(function (key) { return isNaN(Number(EvaluationOperator[key])); }).map(function (value) {
    switch (Number(value)) {
        case EvaluationOperator.add:
            return { viewValue: '+', value: Number(value) };
        case EvaluationOperator.sub:
            return { viewValue: '-', value: Number(value) };
        case EvaluationOperator.mul:
            return { viewValue: '*', value: Number(value) };
        case EvaluationOperator.subdiv:
            return { viewValue: '/', value: Number(value) };
        case EvaluationOperator.mod:
            return { viewValue: '%', value: Number(value) };
        case EvaluationOperator.b_and:
            return { viewValue: '&', value: Number(value) };
        case EvaluationOperator.b_or:
            return { viewValue: '|', value: Number(value) };
        case EvaluationOperator.b_xor:
            return { viewValue: '^', value: Number(value) };
        case EvaluationOperator.lsh:
            return { viewValue: '<<', value: Number(value) };
        case EvaluationOperator.rsh:
            return { viewValue: '>>', value: Number(value) };
        case EvaluationOperator.pow:
            return { viewValue: 'pow', value: Number(value) };
        case EvaluationOperator.eq:
            return { viewValue: '==', value: Number(value) };
        case EvaluationOperator.ne:
            return { viewValue: '!=', value: Number(value) };
        case EvaluationOperator.gt:
            return { viewValue: '>', value: Number(value) };
        case EvaluationOperator.lt:
            return { viewValue: '<', value: Number(value) };
        case EvaluationOperator.ge:
            return { viewValue: '>=', value: Number(value) };
        case EvaluationOperator.le:
            return { viewValue: '<=', value: Number(value) };
        default:
            return { viewValue: '', value: 0 };
    }
});
var EvaluationValue = /** @class */ (function (_super) {
    __extends(EvaluationValue, _super);
    function EvaluationValue(ID, left, right, evaluationOperator, isStatic, name, game) {
        var _this = _super.call(this, ID, value_1.ValueType.evaluation, name, game) || this;
        _this.left = left;
        _this.right = right;
        _this.evaluationOperator = evaluationOperator;
        _this.isStatic = isStatic;
        return _this;
    }
    EvaluationValue.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var left, right, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isStatic && this._STATIC_RESULT !== undefined) {
                            return [2 /*return*/, this._STATIC_RESULT];
                        }
                        return [4 /*yield*/, this.left.getValue()];
                    case 1:
                        left = _a.sent();
                        return [4 /*yield*/, this.right.getValue()];
                    case 2:
                        right = _a.sent();
                        switch (this.evaluationOperator) {
                            case EvaluationOperator.add:
                                result = left + right;
                                break;
                            case EvaluationOperator.sub:
                                result = left - right;
                                break;
                            case EvaluationOperator.mul:
                                result = left * right;
                                break;
                            case EvaluationOperator.subdiv:
                                result = left / right;
                                break;
                            case EvaluationOperator.mod:
                                result = Math.floor(left) % Math.floor(right);
                                break;
                            case EvaluationOperator.b_and:
                                result = Math.floor(left) & Math.floor(right);
                                break;
                            case EvaluationOperator.b_or:
                                result = Math.floor(left) | Math.floor(right);
                                break;
                            case EvaluationOperator.b_xor:
                                result = Math.floor(left) ^ Math.floor(right);
                                break;
                            case EvaluationOperator.lsh:
                                result = Math.floor(left) << Math.floor(right);
                                break;
                            case EvaluationOperator.rsh:
                                result = Math.floor(left) >> Math.floor(right);
                                break;
                            case EvaluationOperator.pow:
                                result = Math.pow(left, right);
                                break;
                            case EvaluationOperator.eq:
                                result = (left === right) ? 1 : 0;
                                break;
                            case EvaluationOperator.ne:
                                result = (left !== right) ? 1 : 0;
                                break;
                            case EvaluationOperator.gt:
                                result = (left > right) ? 1 : 0;
                                break;
                            case EvaluationOperator.lt:
                                result = (left < right) ? 1 : 0;
                                break;
                            case EvaluationOperator.ge:
                                result = (left >= right) ? 1 : 0;
                                break;
                            case EvaluationOperator.le:
                                result = (left <= right) ? 1 : 0;
                                break;
                            default:
                                result = -1;
                                break;
                        }
                        if (this.isStatic) {
                            this._STATIC_RESULT = result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    EvaluationValue.prototype.set = function (newValue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    EvaluationValue.prototype.isTruthy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get()];
                    case 1: return [2 /*return*/, (_a.sent()) !== 0];
                }
            });
        });
    };
    return EvaluationValue;
}(_numberValueType_1.NumberValueType));
exports.EvaluationValue = EvaluationValue;
