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
exports.triviaPost = void 0;
const TriviaBot_1 = require("./TriviaBot");
function triviaPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { method, auth } = req.body;
            const bot = new TriviaBot_1.TriviaBot(auth);
            if (method === "question") {
                const { category } = req.body;
                const question = yield bot.generateNewQuestion(category);
                res.status(200).json({ question });
            }
            else if (method === "answer") {
                const { question, answer } = req.body;
                const result = yield bot.checkAnswer(question, answer);
                res.status(200).json({ result });
            }
            else if (method === "score") {
                const score = yield bot.getScore();
                res.status(200).json({ result: score });
            }
            else if (method === "categories") {
                const categories = bot.getCategories();
                res.status(200).json({ categories });
            }
        }
        catch (error) {
            console.error(`Error with TRIVIA API request: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    });
}
exports.triviaPost = triviaPost;
//# sourceMappingURL=TriviaApp.js.map