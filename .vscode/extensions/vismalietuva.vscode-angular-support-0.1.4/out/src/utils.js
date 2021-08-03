"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parse text by regexp and position. WARNING: Uses very specific approach..
 * Should always have TWO side by side match groups.
 * First group is used to find out second match group position.
 * Ex. /(\*\w+=\")(.*)\"/g
 * @param text - Text to parse from.
 * @param position - Position used in case of multiple occurrences.
 * @param regexp - Regexp to match.
 */
function parseByLocationRegexp(text, position, regexp) {
    let propertyName = null;
    let match;
    while (match = regexp.exec(text)) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regexp.lastIndex) {
            regexp.lastIndex++;
        }
        // Check if position is in whole regexp match
        if (match.index <= position && regexp.lastIndex >= position && match.length === 3) {
            // Check position of group match
            const matchedGroupIndex = match.index + match[match.length - 2].length;
            const matchedGroupLastIndex = matchedGroupIndex + match[match.length - 1].length;
            if (matchedGroupIndex <= position && matchedGroupLastIndex >= position) {
                propertyName = match[match.length - 1];
                break;
            }
        }
    }
    return propertyName;
}
exports.parseByLocationRegexp = parseByLocationRegexp;
function parseByLocationRegexps(text, position, regexps) {
    for (let regexp of regexps) {
        let result = parseByLocationRegexp(text, position, regexp);
        if (result)
            return result;
    }
    return null;
}
exports.parseByLocationRegexps = parseByLocationRegexps;
//# sourceMappingURL=utils.js.map