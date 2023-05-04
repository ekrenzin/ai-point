import { createClient } from "@supabase/supabase-js";
import { TriviaQuestion } from "../trivia/types";

const supabaseUrl = "https://jlkkzxybzwmsagtwacgh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "MISSING KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

async function storeTriviaQuestion(question: TriviaQuestion) {
  const { data, error } = await supabase.from("questions").insert([
    {
      question: question.question,
      correct_answer: question.correct_answer,
      context: question.context,
      title: question.title,
      choices: question.choices,
    },
  ]);
  if (error) {
    console.error(error);
  }
}

async function getTriviaQuestions(): Promise<TriviaQuestion[] | null> {
  const { data, error } = await supabase.from("questions").select("*");
  if (error) {
    console.error(error);
    return null;
  }

  return data.map((question) => ({
    id: question.id,
    question: question.question,
    correct_answer: question.correct_answer,
    context: question.context,
    title: question.title,
    choices: question.choices,
    rating: question.rating,
  }));
}

export { supabase, storeTriviaQuestion, getTriviaQuestions };
