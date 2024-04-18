import { WikiBot } from "../wiki/WikiBot";
import { LangChainModel } from "../../langchain/Model";
import {
  TriviaPrompt,
  TriviaQuestion,
  TriviaResult,
  TriviaScore,
  TriviaCredentials,
} from "./TriviaTypes";
import { WikiPage } from "../wiki/WikiTypes";
import {
  storeTriviaQuestion,
  getTriviaAnswer,
  getTriviaScore,
  updateTriviaScore,
} from "./supabase";
import { ImageBot } from "../images/ImageBot";

/**
 * Class representing a TriviaBot.
 */
class TriviaBot {
  private wikiBot: WikiBot;
  private credentials: TriviaCredentials;
  private model: LangChainModel;
  private imageBot: ImageBot;

  /**
   * Create a TriviaBot.
   * @param {MemoryCredentials} auth - The credentials for the bot.
   */
  public constructor(auth: TriviaCredentials) {
    this.credentials = auth;
    this.wikiBot = new WikiBot();
    this.imageBot = new ImageBot();
    this.model = LangChainModel.getInstance();
  }

  /**
   * Returns a completed string by passing the given prompt to the language model.
   * @private
   * @param {string} prompt - The prompt for the language model.
   * @returns {Promise<string>} The completed string.
   */
  private async complete(prompt: string): Promise<string> {
    const completion = await this.model.complete(prompt);
    const cleanCompletion = completion.replace(/(\r\n|\n|\r)/gm, "");
    return cleanCompletion;
  }

  /**
   * Fetches a random Wikipedia page's title and data.
   * @private
   * @returns {Promise<{pageTitle: string, pageData: string}>} The page title and data.
   */
  private async getRandomWikiPageData(
    inputCategory?: string
  ): Promise<WikiPage> {
    if (inputCategory)
      return await this.wikiBot.randomPageFromCategory(inputCategory);

    //1 out of 10 times, get a true random page
    const random = Math.floor(Math.random() * 10);
    if (random === 0) {
      return await this.wikiBot.randomPage();
    } else {
      return await this.wikiBot.randomPageFromCategory();
    }
  }

  /**
   * Generates a trivia question from a given context.
   *
   * @private
   * @param {string} context - The context to generate the question from.
   * @returns {Promise<string>} - A Promise that resolves to the generated trivia question.
   */
  private async generateQuestion(context: string): Promise<string> {
    const question = await this.complete(
      `Respond with a Trivia question from this context [${context}]. Respond with ONLY the question.`
    );
    return question;
  }

  /**
   * Generates the correct answer to a Trivia question based on the provided question and context using the LangChainModel.
   *
   * @private
   * @param {string} question - The Trivia question to generate the answer for.
   * @param {string} context - The context to use for generating the answer.
   * @returns {Promise<string>} - A Promise that resolves to the generated correct answer.
   */
  private async generateCorrectAnswer(
    question: string,
    context: string
  ): Promise<string> {
    const answer = await this.complete(
      `Respond with a brief answer to ${question}. (maximum 10 words) Respond ONLY with the answer. Use this context to answer [${context}].`
    );
    return answer;
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
  private async generateIncorrectAnswers(
    question: string,
    answer: string,
    numberOfChoices: number
  ): Promise<string[]> {
    const wrongAnswer = await this.complete(
      `Respond with brief ${
        numberOfChoices - 1
      } incorrect answers to ${question} that is different from current answer: ${answer}. (maximum 10 words) The answers should be in the same format as the correct answer (${answer}). wrap each answer like so #ANSWER# ___  #END ANSWER#.`
    );
    const wrongAnswers = wrongAnswer.match(/#ANSWER#(.*?)#END ANSWER#/g);

    let answerChoices: string[] = [];

    if (wrongAnswers) {
      answerChoices = wrongAnswers.map((answer) =>
        answer.replace(/#ANSWER#|#END ANSWER#/g, "")
      );
    }

    return answerChoices;
  }

  /**
   * Randomizes an array of answer choices.
   *
   * @private
   * @param {string[]} answerChoices - The array of answer choices to randomize.
   * @returns {string[]} - The randomized array of answer choices.
   */
  private randomizeChoices(answerChoices: string[]): string[] {
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
  public async generateNewQuestion(
    inputCategory?: string,
    numberOfTries = 0
  ): Promise<TriviaQuestion> {
    try {
      const { title, content, category } = await this.getRandomWikiPageData(
        inputCategory
      );
      console.log(title, content, category);
      console.log("got page data");
      const question = await this.generateQuestion(content);
      const answer = await this.generateCorrectAnswer(question, content);
      const incorrectAnswerChoices = await this.generateIncorrectAnswers(
        question,
        answer,
        4
      );
      const answers = [answer, ...incorrectAnswerChoices];
      const randomizedChoices = this.randomizeChoices(answers);

      const triviaPrompt: TriviaPrompt = {
        question,
        category,
        correct_answer: answer,
        context: content,
        title,
        choices: randomizedChoices,
        rating: 100,
      };

      const questionWithId = await storeTriviaQuestion(triviaPrompt);
      questionWithId.choices = randomizedChoices;

      return questionWithId;
    } catch (err) {
      numberOfTries++;
      if (numberOfTries > 5) {
        throw new Error("Unable to generate question");
      } else {
        return await this.generateNewQuestion(inputCategory, numberOfTries);
      }
    }
  }

  /**
   * Checks if the user's answer to a Trivia question is correct, updates the user's score, and returns the TriviaResult.
   *
   * @public
   * @param {number} question - The TriviaQuestion object containing the question.
   * @param {string} answer - The user's answer to the question.
   * @returns {Promise<TriviaResult>} - A Promise that resolves to the TriviaResult object containing the user's score, whether the answer is correct or not, and the correct answer.
   */
  public async checkAnswer(
    question: number,
    answer: string
  ): Promise<TriviaResult> {
    const triviaAnswer = await getTriviaAnswer(question);
    const correct = triviaAnswer.correct_answer === answer;
    if (this.credentials && this.credentials.uid) {
      const oldScore = await this.getScore();
      const newScore = await this.updateScore(oldScore, correct);

      const result: TriviaResult = {
        score: newScore,
        correct,
        correct_answer: triviaAnswer.correct_answer,
        answer,
      };

      return result;
    } else {
      return {
        correct,
        correct_answer: triviaAnswer.correct_answer,
        answer,
      };
    }
  }

  /**
   * Retrieves the TriviaScore object for the current user from the database, initializes it if it doesn't exist, and returns it.
   *
   * @public
   * @returns {Promise<TriviaScore>} - A Promise that resolves to the user's TriviaScore object.
   */
  public async getScore(): Promise<TriviaScore> {
    const credentials = this.credentials;
    const { uid } = credentials;
    const score = await getTriviaScore(uid);
    console.log(score);
    return score;
  }

  public getCategories(): string[] {
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
  private async updateScore(
    score: TriviaScore,
    correct: boolean
  ): Promise<TriviaScore> {
    if (correct) {
      score.correct += 1;
      score.correctStreak += 1;
      score.incorrectStreak = 0;
      score.streakType = 1;
      score.rating = Math.max(0, score.rating + score.correctStreak * 10) || 0;
    } else {
      score.incorrect += 1;
      score.correctStreak = 0;
      score.incorrectStreak += 1;
      score.streakType = -1;
      score.rating =
        Math.max(0, score.rating - score.incorrectStreak * 10) || 0;
    }

    score.total += 1;

    await updateTriviaScore(score);

    return score;
  }
}

export { TriviaBot };
