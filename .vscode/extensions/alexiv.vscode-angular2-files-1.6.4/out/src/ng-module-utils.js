"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToImport = exports.addToType = void 0;
const tokenizer = (st) => {
    let start = 0;
    let pos = 0;
    const arr = [];
    while (pos != st.length) {
        if (st[pos] == ",") {
            while (st[pos] != "\n" && pos != st.length) {
                pos++;
            }
            arr.push(st.substring(start, pos));
            start = pos;
        }
        pos++;
    }
    if (start != pos) {
        arr.push(st.substring(start, pos));
    }
    return arr.filter(x => x.trim().length > 0);
};
const addToType = (data, type, str) => {
    const stInx = data.indexOf(`@NgModule(`);
    const typeIndex = data.indexOf(type, stInx);
    if (typeIndex == -1) {
        const startIndex = data.lastIndexOf("]");
        const tmpl = `
   ${type}: [
    "${str}"
  ]`;
        return data.substring(0, startIndex + 1) + "," + tmpl + data.substring(startIndex + 1, data.length);
    }
    const startIndex = data.indexOf("[", typeIndex);
    const endIndex = data.indexOf("]", startIndex);
    const area = data.substring(startIndex + 1, endIndex);
    const lines = tokenizer(area);
    let last = lines.length > 0 ? lines.pop().trimEnd() : "";
    let commentsIndex = last.indexOf("//");
    let injectIndex = (commentsIndex == -1) ? last.length - 1 : commentsIndex - 1;
    if (commentsIndex != -1) {
        while (last[injectIndex] == " ") {
            injectIndex--;
        }
    }
    if (last[injectIndex] != "," && last.length > 0) {
        last = last.substring(0, injectIndex + 1) + "," + last.substring(injectIndex + 1, last.length);
    }
    // add last line
    lines.push(last);
    // inject new token
    lines.push("\n      " + str);
    const newArea = "[\t" + lines.join('') + "\n   ]";
    const newStr = data.substring(0, startIndex) + newArea + data.substring(endIndex + 1, data.length);
    return newStr;
};
exports.addToType = addToType;
const addToImport = (data, str) => {
    const lastImportInx = data.lastIndexOf('import ');
    const lastImportEndInx = data.indexOf('from', lastImportInx);
    const endOfLastImportInx = data.indexOf('\n', lastImportEndInx);
    const fileLength = data.length;
    return data.substring(0, endOfLastImportInx) + `\n${str}` + data.substring(endOfLastImportInx, fileLength);
};
exports.addToImport = addToImport;
//# sourceMappingURL=ng-module-utils.js.map