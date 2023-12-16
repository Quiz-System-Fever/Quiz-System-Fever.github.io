import { html, nothing } from "../lib/lit-html.js";
import { getQuizById } from "../services/quizzesService.js";


const detailsTemplate = (quiz, user) => html`
<section id="details">
<div class="pad-large alt-page">
    <article class="details">
        <h1>${quiz.title}</h1>
        <span class="quiz-topic">A quiz by ${quiz.owner.username} on the topic of Languages</span>   
        <div class="quiz-meta">
            <span>${quiz.questionCount} Questions</span>
        </div>
        ${quiz.description ? html`<p class="quiz-desc">${quiz.description}</p>` : nothing}
        <div>
        ${user
        ? html`<a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>`
        : nothing}
        </div>
    </article>
</div>
</section>`;

export async function detailsView(ctx) {
    ctx.loader();
    const quizId = ctx.params.id;
    const user = ctx.user();
    const quiz = await getQuizById(quizId);

    ctx.render(detailsTemplate(quiz, user));
}