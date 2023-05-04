interface TriviaScore {
    correct: number;
    incorrect: number;
    total: number;
    rating: number;
    correctStreak: number;
    incorrectStreak: number;
    streakType: number;
  }
  
  interface TriviaResult {
    score: TriviaScore;
    correct: boolean;
    answer: string;
  }
  
  interface TriviaQuestion {
    question: string;
    correct_answer: string;
    context: string;
    title: string;
    choices: string[];
    rating: number;
  }
  
  interface TriviaAnswer {
    question: TriviaQuestion;
    answer: string;
  }

  export { TriviaScore, TriviaResult, TriviaQuestion, TriviaAnswer }