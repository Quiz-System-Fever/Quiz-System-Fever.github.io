import { getQuestionsByQuizId } from "../services/questionsService.js";
import { getQuizById } from "../services/quizzesService.js";

let state = {};

export async function getQuiz(ctx, next) {
    const quizId = ctx.params.id;
    ctx.clearState = clearState.bind(null, quizId);
    if (state[quizId] == undefined) {
        ctx.loader();
        state[quizId] = await getQuizById(quizId);
        state[quizId].questions = await getQuestionsByQuizId(quizId);
        state[quizId].answers = state[quizId].questions.results.map(q => undefined);
    }
    
    ctx.quiz = state[quizId];
    next();
}

function clearState(quizId) {
    delete state[quizId]
}