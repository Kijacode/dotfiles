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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeStory = exports.getStoryById = void 0;
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const cache = {};
const fetchingMap = {};
exports.getStoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(id in cache)) {
        if (fetchingMap[id]) {
            return null;
        }
        fetchingMap[id] = true;
        const data = yield query_1.queryNoErr("/text-story/" + id);
        if (data) {
            cache[id] = data.story;
        }
        fetchingMap[id] = false;
    }
    return cache[id];
});
exports.likeStory = (id, newLikeAmount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mutation_1.mutation("/like-text-story/" + id, {});
    }
    catch (_a) {
        return;
    }
    if (id in cache) {
        cache[id].numLikes = newLikeAmount;
    }
});
//# sourceMappingURL=api.js.map