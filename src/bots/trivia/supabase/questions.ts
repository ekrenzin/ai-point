import { TriviaAnswer, TriviaPrompt, TriviaQuestion } from "../TriviaTypes";
import { supabase } from "../../../supabase/supabase";
import { storeTriviaAnswer } from "./answers";

export { storeTriviaQuestion, getTriviaQuestions };

async function storeTriviaQuestion(
    prompt: TriviaPrompt
  ): Promise<TriviaQuestion> {
    const question: TriviaQuestion = {
      question: prompt.question,
      context: prompt.context,
      category: prompt.category,
      title: prompt.title,
      rating: prompt.rating,
    };
    const { error, data } = await supabase
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
  
    const questionResult: any = data[0];
    const id = questionResult.id;
    const answer: TriviaAnswer = {
      question_id: id,
      choices: prompt.choices,
      correct_answer: prompt.correct_answer,
    };
  
    await storeTriviaAnswer(answer);
  
    question.id = id;
    return question;
  }

async function getTriviaQuestions(): Promise<TriviaPrompt[] | null> {
    const { data, error } = await supabase.from("questions").select("*");
    if (error) {
      console.error(error);
      return null;
    }
    const questions = data as TriviaPrompt[];
    return questions;
  }
  