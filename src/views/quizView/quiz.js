import { html, nothing } from "../../lib/lit-html.js";

const quizTemplate = (quiz, questions, currentIndex, goBack) => html`
<section id="quiz">
<header class="pad-large">
    <h1>Extensible Markup Language: Question ${currentIndex + 1} / ${quiz.questionCount}</h1>
    <nav class="layout q-control">
    <span class="block">Question ${currentIndex + 1}</span>
    ${questions.map((q, i) => html`<a class="q-index q-current q-answered" href="/quiz/${quiz.objectId}?question=${i + 1}"></a>`)}
    </nav>
    </header>
    <div class="pad-large alt-page">
    <article class="question">
        <p class="q-text">${questions[currentIndex].text}</p>
        <form>
            ${questions.map((q, i) => questionTemplate(q, i, currentIndex == i))}
        </form>
        <nav class="q-control">
            <span class="block">12 questions remaining</span>
            ${currentIndex > 0
        ? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex + 1}" @click=${goBack}><i class="fas fa-arrow-left"></i> Previous</a>`
        : nothing}
            <a class="action" href="javascript:void(0)" ><i class="fas fa-sync-alt"></i> Start over</a>
            <div class="right-col">
            ${currentIndex < questions.length - 1
        ? html`<a class="action" href="javascript:void(0)" >Next <i class="fas fa-arrow-right"></i></a>`
        : nothing}
                <a class="action" href=#>Submit answers</a>
            </div>
        </nav>
    </article>
</div>
</section>`;

const questionTemplate = (question, questionIndex, isCurrent) => html`
<div style=${isCurrent ? "display:block" : "display:none"}>
${question.answers.map((a, i) => answerTemplate(a, i, questionIndex))}
</div>`;

const answerTemplate = (answer, index, questionIndex) => html`
<label class="q-answer radio">
    <input class="input" type="radio" name="question-${questionIndex}" value=${index} />
    <i class="fas fa-check-circle"></i>
${answer}
</label>`

export async function quizView(ctx) {
    const currentIndex = Number(ctx.querystring.split('=')[1] || 1) - 1;
    const questions = ctx.quiz.questions.results;
    ctx.render(quizTemplate(ctx.quiz, questions, currentIndex, goBack));

    function goBack() {
        const currentIndex = Number(ctx.querystring.split('=')[1]) - 2;
        ctx.render(quizTemplate(ctx.quiz, currentIndex, goBack));
    }
}