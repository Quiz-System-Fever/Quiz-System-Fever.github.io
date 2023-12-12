import { html, render } from "../../lib/lit-html.js";
import { createQuestionView } from "./questions.js";
import { deleteQuestion } from "../../services/questionsService.js";
import { updateQuiz } from "../../services/quizzesService.js";

const questionsList = (quiz, addQuestion, onDelete) => html`
<header class="pad-large">
<h2>Questions</h2>
</header>
<div class="pad-large alt-page">
${quiz.questions.map((q, i) => createQuestionView(q, i, quiz.ctx, onDelete))}
<article class="editor-question">
<div class="editor-input">
    <button @click=${addQuestion} class="input submit action"><i class="fas fa-plus-circle"></i>Add question</button>
</div>
</article>
</div>`;

export function createList(quiz) {
    const ctx = quiz.ctx;
    const quizId = quiz.objectId;
    const element = document.createElement('div');

    render(questionsList(quiz, addQuestion, onDelete), element);

    return element;

    async function addQuestion() {
        quiz.questions.push({
            text: '',
            answers: [],
            correctIndex: 0
        })
        let questionCount = quiz.questions.length;
        await updateQuiz(quizId, { questionCount });
        render(questionsList(quiz, addQuestion, onDelete), element);
    }

    async function onDelete(questionId, questionIndex) {
        if (confirm('Are you sure you want to delete this question?')) {
            if (questionId) {
                await deleteQuestion(questionId);
            }

            quiz.questions.splice(questionIndex, 1);
            let questionCount = quiz.questions.length;
            await updateQuiz(quizId, { questionCount });
            ctx.showMessage('Question deleted successfully.');
            render(questionsList(quiz, addQuestion, onDelete), element);
        }
    }
}