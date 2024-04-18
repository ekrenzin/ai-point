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
exports.TriviaBot = void 0;
const WikiBot_1 = require("../wiki/WikiBot");
const Model_1 = require("../../langchain/Model");
const supabase_1 = require("./supabase");
const ImageBot_1 = require("../images/ImageBot");
/**
 * Class representing a TriviaBot.
 */
class TriviaBot {
    /**
     * Create a TriviaBot.
     * @param {MemoryCredentials} auth - The credentials for the bot.
     */
    constructor(auth) {
        this.credentials = auth;
        this.wikiBot = new WikiBot_1.WikiBot();
        this.imageBot = new ImageBot_1.ImageBot();
        this.model = Model_1.LangChainModel.getInstance();
    }
    /**
     * Returns a completed string by passing the given prompt to the language model.
     * @private
     * @param {string} prompt - The prompt for the language model.
     * @returns {Promise<string>} The completed string.
     */
    complete(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const completion = yield this.model.complete(prompt);
            const cleanCompletion = completion.replace(/(\r\n|\n|\r)/gm, "");
            return cleanCompletion;
        });
    }
    /**
     * Fetches a random Wikipedia page's title and data.
     * @private
     * @returns {Promise<{pageTitle: string, pageData: string}>} The page title and data.
     */
    getRandomWikiPageData(inputCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputCategory)
                return yield this.wikiBot.randomPageFromCategory(inputCategory);
            //1 out of 10 times, get a true random page
            const random = Math.floor(Math.random() * 10);
            if (random === 0) {
                return yield this.wikiBot.randomPage();
            }
            else {
                return yield this.wikiBot.randomPageFromCategory();
            }
        });
    }
    /**
     * Generates a trivia question from a given context.
     *
     * @private
     * @param {string} context - The context to generate the question from.
     * @returns {Promise<string>} - A Promise that resolves to the generated trivia question.
     */
    generateQuestion(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.complete(`Respond with a Trivia question from this context [${context}]. Respond with ONLY the question.`);
            return question;
        });
    }
    /**
     * Generates the correct answer to a Trivia question based on the provided question and context using the LangChainModel.
     *
     * @private
     * @param {string} question - The Trivia question to generate the answer for.
     * @param {string} context - The context to use for generating the answer.
     * @returns {Promise<string>} - A Promise that resolves to the generated correct answer.
     */
    generateCorrectAnswer(question, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield this.complete(`Respond with a brief answer to ${question}. (maximum 10 words) Respond ONLY with the answer. Use this context to answer [${context}].`);
            return answer;
        });
    }
    /**
     * Generates an array of incorrect answers to a Trivia question.
     *
     * @private
     * @param {string} question - The Trivia question to generate incorrect answers for.
     * @param {string} answer - The correct answer to the Trivia question.
     * @param {number} numberOfChoices - The number of incorrect answer choices to generate.
     * @returns {Promise<string[]>} - A Promise that resolves to an array of generated incorrect answers.
     */
    generateIncorrectAnswers(question, answer, numberOfChoices) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrongAnswer = yield this.complete(`Respond with brief ${numberOfChoices - 1} incorrect answers to ${question} that is different from current answer: ${answer}. (maximum 10 words) The answers should be in the same format as the correct answer (${answer}). wrap each answer like so #ANSWER# ___  #END ANSWER#.`);
            const wrongAnswers = wrongAnswer.match(/#ANSWER#(.*?)#END ANSWER#/g);
            let answerChoices = [];
            if (wrongAnswers) {
                answerChoices = wrongAnswers.map((answer) => answer.replace(/#ANSWER#|#END ANSWER#/g, ""));
            }
            return answerChoices;
        });
    }
    /**
     * Randomizes an array of answer choices.
     *
     * @private
     * @param {string[]} answerChoices - The array of answer choices to randomize.
     * @returns {string[]} - The randomized array of answer choices.
     */
    randomizeChoices(answerChoices) {
        for (let i = answerChoices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = answerChoices[i];
            answerChoices[i] = answerChoices[j];
            answerChoices[j] = temp;
        }
        return answerChoices;
    }
    /**
     * Generates a new TriviaQuestion by retrieving a random page from the WikiBot, generating a question, generating a correct answer, generating incorrect answers, randomizing the answer choices, and storing the question in the database.
     *
     * @public
     * @param {string} inputCategory - The category to generate the question from (optional).
     * @param {number} numberOfTries - The number of times the function has been called recursively. Will throw an  .
     * @returns {Promise<TriviaQuestion>} - A Promise that resolves to the generated TriviaQuestion ID.
     * @throws {Error} - An error.
     */
    generateNewQuestion(inputCategory, numberOfTries = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, content, category } = yield this.getRandomWikiPageData(inputCategory);
                console.log("got page data");
                const question = yield this.generateQuestion(content);
                console.log("generated question");
                const answer = yield this.generateCorrectAnswer(question, content);
                console.log("generated correct answer");
                const incorrectAnswerChoices = yield this.generateIncorrectAnswers(question, answer, 4);
                console.log("generated incorrect answers");
                const answers = [answer, ...incorrectAnswerChoices];
                const randomizedChoices = this.randomizeChoices(answers);
                const triviaPrompt = {
                    question,
                    category,
                    correct_answer: answer,
                    context: content,
                    title,
                    choices: randomizedChoices,
                    rating: 100,
                };
                const questionWithId = yield (0, supabase_1.storeTriviaQuestion)(triviaPrompt);
                questionWithId.choices = randomizedChoices;
                return questionWithId;
            }
            catch (err) {
                numberOfTries++;
                if (numberOfTries > 5) {
                    throw new Error("Unable to generate question");
                }
                else {
                    return yield this.generateNewQuestion(inputCategory, numberOfTries);
                }
            }
        });
    }
    /**
     * Checks if the user's answer to a Trivia question is correct, updates the user's score, and returns the TriviaResult.
     *
     * @public
     * @param {number} question - The TriviaQuestion object containing the question.
     * @param {string} answer - The user's answer to the question.
     * @returns {Promise<TriviaResult>} - A Promise that resolves to the TriviaResult object containing the user's score, whether the answer is correct or not, and the correct answer.
     */
    checkAnswer(question, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            const triviaAnswer = yield (0, supabase_1.getTriviaAnswer)(question);
            const correct = triviaAnswer.correct_answer === answer;
            if (this.credentials && this.credentials.uid) {
                const oldScore = yield this.getScore();
                const newScore = yield this.updateScore(oldScore, correct);
                const result = {
                    score: newScore,
                    correct,
                    correct_answer: triviaAnswer.correct_answer,
                    answer,
                };
                return result;
            }
            else {
                return {
                    correct,
                    correct_answer: triviaAnswer.correct_answer,
                    answer,
                };
            }
        });
    }
    /**
     * Retrieves the TriviaScore object for the current user from the database, initializes it if it doesn't exist, and returns it.
     *
     * @public
     * @returns {Promise<TriviaScore>} - A Promise that resolves to the user's TriviaScore object.
     */
    getScore() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = this.credentials;
            const { uid } = credentials;
            const score = yield (0, supabase_1.getTriviaScore)(uid);
            console.log(score);
            return score;
        });
    }
    getCategories() {
        return this.wikiBot.getCategoryList();
    }
    /**
     * Updates the user's TriviaScore object based on whether their answer to the previous question was correct or not, stores the updated score in the database, and returns it.
     *
     * @private
     * @param {TriviaScore} score - The user's current TriviaScore object.
     * @param {boolean} correct - A boolean indicating whether the user's answer to the previous question was correct or not.
     * @returns {Promise<TriviaScore>} - A Promise that resolves to the updated TriviaScore object.
     */
    updateScore(score, correct) {
        return __awaiter(this, void 0, void 0, function* () {
            if (correct) {
                score.correct += 1;
                score.correctStreak += 1;
                score.incorrectStreak = 0;
                score.streakType = 1;
                score.rating = Math.max(0, score.rating + score.correctStreak * 10) || 0;
            }
            else {
                score.incorrect += 1;
                score.correctStreak = 0;
                score.incorrectStreak += 1;
                score.streakType = -1;
                score.rating =
                    Math.max(0, score.rating - score.incorrectStreak * 10) || 0;
            }
            score.total += 1;
            yield (0, supabase_1.updateTriviaScore)(score);
            return score;
        });
    }
}
exports.TriviaBot = TriviaBot;
//# sourceMappingURL=TriviaBot.js.map