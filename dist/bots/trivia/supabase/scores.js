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
exports.updateTriviaScore = exports.storeTriviaScore = exports.getTriviaScore = void 0;
const supabase_1 = require("../../../supabase/supabase");
function getTriviaScore(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase
                .from("scores")
                .select("*")
                .eq("uid", uid)
                .single();
            if (!data)
                throw new Error("No data returned from Supabase");
            return data;
        }
        catch (error) {
            console.error(`Error retrieving TriviaScore: ${error.message}`);
            const newScore = {
                uid,
                correct: 0,
                incorrect: 0,
                total: 0,
                rating: 0,
                correctStreak: 0,
                incorrectStreak: 0,
                streakType: 1,
            };
            yield storeTriviaScore(newScore);
            return newScore;
        }
    });
}
exports.getTriviaScore = getTriviaScore;
function storeTriviaScore(score) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase.from("scores").insert([score]);
        if (error) {
            console.error(error);
            return;
        }
        if (data) {
            return data;
        }
    });
}
exports.storeTriviaScore = storeTriviaScore;
function updateTriviaScore(score) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
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
    });
}
exports.updateTriviaScore = updateTriviaScore;
//# sourceMappingURL=scores.js.map