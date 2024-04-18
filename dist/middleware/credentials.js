"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCredentials = void 0;
function extractCredentials(req) {
    const body = req.body;
    const { uid, chain } = body;
    const id = req.params.id;
    const credentials = {
        uid,
        chain,
        id
    };
    return credentials;
}
exports.extractCredentials = extractCredentials;
//# sourceMappingURL=credentials.js.map