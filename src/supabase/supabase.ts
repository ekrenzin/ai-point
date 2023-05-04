import { createClient } from "@supabase/supabase-js";
import { TriviaAnswer, TriviaPrompt, TriviaQuestion } from "../trivia/TriviaTypes";

const supabaseUrl = "https://jlkkzxybzwmsagtwacgh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "MISSING KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getTriviaAnswer(question_id: number): Promise<TriviaAnswer> {
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", question_id);
  if (error) {
    console.error(error);
    return { question_id: 0, choices: [], correct_answer: ""};
  }
  const answers = data as TriviaAnswer[];
  return answers[0];
}

async function storeTriviaQuestion(prompt: TriviaPrompt): Promise<TriviaQuestion> {
  const question: TriviaQuestion = {
    question: prompt.question,
    context: prompt.context,
    category: prompt.category,
    title: prompt.title,
    rating: prompt.rating
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

async function storeTriviaAnswer(answer: TriviaAnswer) {
  const { error } = await supabase.from("answers").insert([answer]);
  if (error) {
    console.error(error);
    return;
  }
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

export { supabase, storeTriviaQuestion, getTriviaQuestions, getTriviaAnswer };
