import { html } from "../lib/lit-html.js";
import { deleteQuiz, getQuizByUserId } from "../services/quizzesService.js";
import { getAllSolution, getSolutionsByOwnerId } from "../services/solutionsService.js";

const profileTemplate = (user, quizzes, ownSolutions, allSolutions, onDelete) => html`<section id="profile">
<header class="pad-large">
    <h1>Profile Page</h1>
</header>
<div class="hero pad-large">
    <article class="glass pad-large profile">
        <h2>Profile Details</h2>
        <p><span class="profile-info">Username:</span>${user.username}</p>
        <p><span class="profile-info">Email:</span>${user.email}</p>
        <h2>Your Quiz Results</h2>
        <table class="quiz-results">
            <tbody>
            ${ownSolutions.map(s => resultTemplate(s, s.quizCopy.summary > s.quizCopy.questions.results.length / 2))}
            </tbody>
        </table>
    </article>
</div>
<header class="pad-large">
    <h2>Quizzes created by you</h2>
</header>
<div class="pad-large alt-page">
   ${quizzes.length ? quizzes.map(q => quizTemplate(q, onDelete, allSolutions)) : html`<h3>You don't have quizzes created by you</h3>`}
</div>
</section>`;

const resultTemplate = ({ objectId, createdAt, quizCopy }, isCorrect) => html`
<tr class="results-row">
<td class="cell-1">${createdAt.split('T')[0]}</td>
<td class="cell-2"><a href="/summary/${objectId}">${quizCopy.title}</a></td>
<td class="cell-3 ${isCorrect ? 's-correct' : 's-incorrect'}">
        ${((quizCopy.summary / quizCopy.questions.results.length) * 100).toFixed(0)}%</td >
    <td class="cell-4 ${isCorrect ? 's-correct' : 's-incorrect'}">
    ${quizCopy.summary}/${quizCopy.questions.results.length} correct answers</td>
</tr > `;

const quizTemplate = (quiz, onDelete, solutions) => html`
    <article class="preview layout">
        <div class="right-col">
            <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
            <a class="action cta" href="/edit/${quiz.objectId}"><i class="fas fa-edit"></i></a>
            <a class="action cta" href="javascript:void(0)" @click=${() => onDelete(quiz)}><i class="fas fa-trash-alt"></i></a>
</div>
    <div class="left-col">
        <h3><a class="quiz-title-link" href="/details/${quiz.objectId}">${quiz.title}</a></h3>
        <span class="quiz-topic">Topic: ${quiz.topic}</span>
        <div class="quiz-meta">
            <span>${quiz.questionCount} questions</span>
            <span>|</span>
            <span>Taken ${solutions.filter(s => s.quizCopy.objectId == quiz.objectId).length} times</span>
        </div>
    </div>
</article>`;

export async function profileView(ctx) {
    ctx.loader();
    const user = ctx.user();
    const [allSolutions, ownSolutions, quizzes] = await Promise.all([
        getAllSolution(),
        getSolutionsByOwnerId(user.objectId),
        getQuizByUserId(user.objectId)]);

    ownSolutions.results.map(s =>
        s.quizCopy.summary = s.quizCopy.answers.reduce((a, cr, i) =>
            a + Number(cr == s.quizCopy.questions.results[i].correctIndex), 0));

    ctx.render(profileTemplate(user, quizzes.results, ownSolutions.results, allSolutions.results, onDelete));

    async function onDelete(quiz) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            await deleteQuiz(quiz.objectId);
            const quizIndex = quizzes.results.indexOf(quiz);
            quizzes.results.splice(quizIndex, 1);
            ctx.render(profileTemplate(user, quizzes.results, ownSolutions.results, allSolutions.results, onDelete));
        }
    }
}