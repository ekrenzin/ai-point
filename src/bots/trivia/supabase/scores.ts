import { TriviaScore } from "../TriviaTypes";
import { supabase } from "../../../supabase/supabase";

export { getTriviaScore, storeTriviaScore, updateTriviaScore };

async function getTriviaScore(uid: string): Promise<TriviaScore> {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("uid", uid)
      .single();
      if (!data) throw new Error("No data returned from Supabase");
    return data as TriviaScore;
  } catch (error: any) {
    console.error(`Error retrieving TriviaScore: ${error.message}`);
    const newScore: TriviaScore = {
      uid,
      correct: 0,
      incorrect: 0,
      total: 0,
      rating: 0,
      correctStreak: 0,
      incorrectStreak: 0,
      streakType: 1,
    };
    await storeTriviaScore(newScore);
    return newScore;
  }
}

async function storeTriviaScore(score: TriviaScore) {
  const { data, error } = await supabase.from("scores").insert([score]);
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    return data;
  }
}

async function updateTriviaScore(score: TriviaScore) {
  const { data, error } = await supabase
    .from("scores")
    .update(score)
    .eq("uid", score.uid);
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    return data;
  }
}
