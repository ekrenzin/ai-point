"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Model_1 = require("./langchain/Model");
const dotenv_1 = __importDefault(require("dotenv"));
const credentials_1 = require("./middleware/credentials");
const TriviaApp_1 = require("./bots/trivia/TriviaApp");
dotenv_1.default.config();
Model_1.LangChainModel.init();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/memorable/:category", (req, res, next) => {
    const credentials = (0, credentials_1.extractCredentials)(req);
    req.body.credentials = credentials;
    next();
});
app.use("/api/trivia", (req, res, next) => {
    const credentials = (0, credentials_1.extractCredentials)(req);
    req.body.credentials = credentials;
    next();
});
app.post("/api/trivia", TriviaApp_1.triviaPost);
try {
    app.listen(8000);
}
catch (e) {
    app.listen(3000);
}
exports.default = app;
//# sourceMappingURL=index.js.map