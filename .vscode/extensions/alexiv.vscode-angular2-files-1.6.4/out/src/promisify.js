"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisify = void 0;
exports.promisify = f => (...params) => new Promise((resolve, reject) => {
    f.apply(this, [...params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        }]);
});
//# sourceMappingURL=promisify.js.map