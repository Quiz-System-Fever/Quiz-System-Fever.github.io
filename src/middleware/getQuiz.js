import { getQuestionsByQuizId } from "../services/questionsService.js";
import { getQuizById } from "../services/quizzesService.js";

let state = {};

export async function getQuiz(ctx, next) {
    const quizId = ctx.params.id;
    if (state[quizId] == undefined) {
        state[quizId] = await getQuizById(quizId);
        state[quizId].questions = await getQuestionsByQuizId(quizId);
    }

    ctx.quiz = state[quizId];
    next();
}