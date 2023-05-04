import { db } from "../firebase/firebase";
import { MemoryCredentials } from "../types";
import { WikiBot } from "./WikiBot";
import { LangChainModel } from "../langchain/Model";
import {
  TriviaQuestion,
  TriviaAnswer,
  TriviaResult,
  TriviaScore,
} from "./types";
import { storeTriviaQuestion } from "../supabase/supabase";

/**
 * Class representing a TriviaBot.
 */
class TriviaBot {
  private wikiBot: WikiBot;
  private credentials: MemoryCredentials;
  private model: LangChainModel;

  /**
   * Create a TriviaBot.
   * @param {MemoryCredentials} credentials - The credentials for the bot.
   */
  public constructor(credentials: MemoryCredentials) {
    this.credentials = credentials;
    this.wikiBot = new WikiBot();
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
  private async getRandomWikiPageData(): Promise<{
    pageTitle: string;
    pageData: string;
  }> {
    const pageTitle = await this.wikiBot.randomPage();
    const pageData = await this.wikiBot.getPageData(pageTitle);
    return { pageTitle, pageData };
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
      `Respond with the answer to ${question}. Respond ONLY with the answer. Use this context to answer [${context}].`
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
      `Respond with ${
        numberOfChoices - 1
      } incorrect answers to ${question} that is different from current answer: ${answer}. The answers should be in the same format as the correct answer. wrap each answer like so #ANSWER# ___  #END ANSWER#.`
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
   * @returns {Promise<TriviaQuestion>} - A Promise that resolves to the generated TriviaQuestion.
   */
  public async generateNewQuestion(): Promise<TriviaQuestion> {
    const { pageTitle, pageData } = await this.getRandomWikiPageData();
    const question = await this.generateQuestion(pageData);
    const answer = await this.generateCorrectAnswer(question, pageData);
    const answerChoices = await this.generateIncorrectAnswers(
      question,
      answer,
      4
    );
    const randomizedChoices = this.randomizeChoices(answerChoices);

    const triviaQuestion: TriviaQuestion = {
      question,
      correct_answer: answer,
      context: pageData,
      title: pageTitle,
      choices: randomizedChoices,
      rating: 100,
    };

    await storeTriviaQuestion(triviaQuestion);
    return triviaQuestion;
  }

  /**
   * Asks the user to repeat the most recently asked Trivia question.
   *
   * @public
   * @returns {Promise<string>} - A Promise that resolves to the user's response.
   */
  public async repeatQuestion(): Promise<string> {
    const response = await this.complete(
      "Repeat the question you asked most recently."
    );
    return response;
  }

  /**
   * Checks if the user's answer to the previous Trivia question is correct, updates the user's score, and returns the TriviaResult.
   *
   * @public
   * @param {TriviaAnswer} triviaAnswer - The TriviaAnswer object containing the previous question and user's answer.
   * @returns {Promise<TriviaResult>} - A Promise that resolves to the TriviaResult object containing the user's score, whether the answer is correct or not, and the correct answer.
   */
  public async checkAnswer(triviaAnswer: TriviaAnswer): Promise<TriviaResult> {
    const previousQuestion = triviaAnswer.question;
    const userAnswer = triviaAnswer.answer;

    const correct = previousQuestion.correct_answer === userAnswer;

    const oldScore = await this.getScore();
    const newScore = await this.updateScore(oldScore, correct);
    const result: TriviaResult = {
      score: newScore,
      correct,
      answer: previousQuestion.correct_answer,
    };

    return result;
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
    const scoreRef = db.doc(`trivia/${uid}`);
    const doc = await scoreRef.get();
    const score = doc.data() as TriviaScore;

    //initialize values if undefined
    if (!score) {
      const newScore: TriviaScore = {
        correct: 0,
        incorrect: 0,
        rating: 1500,
        total: 0,
        correctStreak: 0,
        incorrectStreak: 0,
        streakType: 0,
      };
      await scoreRef.set(newScore);
      return newScore;
    }
    return score;
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

    const credentials = this.credentials;
    const { uid } = credentials;
    const scoreRef = db.doc(`trivia/${uid}`);
    await scoreRef.set(score);

    return score;
  }
}

export { TriviaBot };
