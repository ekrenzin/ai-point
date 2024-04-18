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
exports.getTriviaQuestions = exports.storeTriviaQuestion = void 0;
const supabase_1 = require("../../../supabase/supabase");
const answers_1 = require("./answers");
function storeTriviaQuestion(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const question = {
            question: prompt.question,
            context: prompt.context,
            category: prompt.category,
            title: prompt.title,
            rating: prompt.rating,
        };
        try {
            const { error, data } = yield supabase_1.supabase
                .from("questions")
                .insert([question])
                .select();
            if (error) {
                console.error(error);
                return question;
            }
            if (!data) {
                console.error("No data returned from Supabase");
                return question;
            }
            const questionResult = data[0];
            const id = questionResult.id;
            const answer = {
                question_id: id,
                choices: prompt.choices,
                correct_answer: prompt.correct_answer,
            };
            yield (0, answers_1.storeTriviaAnswer)(answer);
            question.id = id;
            return question;
        }
        catch (error) {
            console.error(`Error storing trivia question: ${error.message}`);
            return question;
        }
    });
}
exports.storeTriviaQuestion = storeTriviaQuestion;
function getTriviaQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase.from("questions").select("*");
            if (error) {
                console.error(error);
                return null;
            }
            const questions = data;
            return questions;
        }
        catch (error) {
            console.error(`Error getting trivia questions: ${error.message}`);
            return null;
        }
    });
}
exports.getTriviaQuestions = getTriviaQuestions;
//# sourceMappingURL=questions.js.map