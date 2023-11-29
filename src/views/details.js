import { html, nothing } from "../lib/lit-html.js";
import { getQuizById } from "../services/quizzesService.js";


const detailsTemplate = (quiz) => html`
<section id="details">
<div class="pad-large alt-page">
    <article class="details">
        <h1>${quiz.title}</h1>
        <span class="quiz-topic">A quiz by <a href="/profile/${quiz.owner.objectId}">${quiz.owner.username}</a> on the topic of Languages</span>
        <div class="quiz-meta">
            <span>${quiz.questionCount} Questions</span>
        </div>
        ${quiz.description ? html`<p class="quiz-desc">${quiz.description}</p>` : nothing}
        <div>
            <a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>
        </div>
    </article>
</div>
</section>`;

export async function detailsView(ctx) {
    const quizId = ctx.params.id;
    const quiz = await getQuizById(quizId);

    ctx.render(detailsTemplate(quiz));
}