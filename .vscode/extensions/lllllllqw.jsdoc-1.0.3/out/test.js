"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
console.log(ts.createSourceFile('', `function name(params, aaa, {ff}) {
    
  }`, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TSX));
//# sourceMappingURL=test.js.map