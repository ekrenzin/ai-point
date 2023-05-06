import { TriviaAnswer, TriviaPrompt, TriviaQuestion } from "../TriviaTypes";
import { supabase } from "../../../supabase/supabase";

export {
    storeTriviaAnswer,
    getTriviaAnswer,
}

async function getTriviaAnswer(question_id: number): Promise<TriviaAnswer> {
    const { data, error } = await supabase
      .from("answers")
      .select("*")
      .eq("question_id", question_id);
    if (error) {
      console.error(error);
      return { question_id: 0, choices: [], correct_answer: "" };
    }
    const answers = data as TriviaAnswer[];
    return answers[0];
  }
  
  
  async function storeTriviaAnswer(answer: TriviaAnswer) {
    const { error } = await supabase.from("answers").insert([answer]);
    if (error) {
      console.error(error);
      return;
    }
  }