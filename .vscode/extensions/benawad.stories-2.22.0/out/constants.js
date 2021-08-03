"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kickstarterUrl = exports.newExtensionUrl = exports.apiBaseUrl = exports.refreshTokenKey = exports.accessTokenKey = exports._prod_ = void 0;
exports._prod_ = process.env.NODE_ENV === "production";
exports.accessTokenKey = "@stories/token" + (exports._prod_ ? "" : "dev");
exports.refreshTokenKey = "@stories/refresh-token" + (exports._prod_ ? "" : "dev");
exports.apiBaseUrl = exports._prod_
    ? "https://bowl.azurewebsites.net"
    : "http://localhost:8080";
exports.newExtensionUrl = "https://marketplace.visualstudio.com/items?itemName=bar9.stories";
exports.kickstarterUrl = "https://www.kickstarter.com/projects/rolandbrand/vs-code-stories";
//# sourceMappingURL=constants.js.map