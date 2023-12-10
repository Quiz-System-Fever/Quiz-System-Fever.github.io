import { html, nothing } from "../../lib/lit-html.js";
import { sendSolution } from "../../services/solutionsService.js";

const quizTemplate = (quiz, questions, answers, currentIndex, goBack, onNext, startOver, onSelect, onSubmit) => html`
<section id="quiz">
<header class="pad-large">
    <h1>Extensible Markup Language: Question ${currentIndex + 1} / ${quiz.questionCount}</h1>
    <nav class="layout q-control">
    <span class="block">Question ${currentIndex + 1}</span>
    ${questions.map((q, i) => questionBoxTemplate(quiz.objectId, i, answers[i] != undefined, currentIndex == i))}
    </nav>
    </header>
    <div class="pad-large alt-page">
    <article class="question">
        <p class="q-text">${questions[currentIndex].text}</p>
        <form @change=${onSelect}>
            ${questions.map((q, i) => questionTemplate(q, i, currentIndex == i))}
        </form>
        <nav class="q-control">
            <span class="block">${answers.filter(a => a == undefined).length} questions remaining</span>
            ${currentIndex > 0
        ? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex}" @click=${goBack}><i class="fas fa-arrow-left"></i> Previous</a>`
        : nothing}
            <a class="action" href="javascript:void(0)" @click=${startOver} ><i class="fas fa-sync-alt"></i> Start over</a>
            <div class="right-col">
            ${currentIndex < questions.length - 1
        ? html`<a class="action" href="/quiz/${quiz.objectId}?question=${currentIndex + 2}" @click=${onNext} >Next <i class="fas fa-arrow-right"></i></a>`
        : nothing}
        ${(answers.filter(a => a == undefined).length == 0) ||
        (currentIndex == questions.length - 1)
        ? html`<a class="action" href="javascript:void(0)" @click=${onSubmit} >Submit answers</a>`
        : nothing}
            </div>
        </nav>
    </article>
</div>
</section>`;

const questionBoxTemplate = (quizId, index, isAnswered, isCurrent) => html`
<a class="q-index ${isAnswered ? 'q-answered' : ''} ${isCurrent ? 'q-current' : ''}" href="/quiz/${quizId}?question=${index + 1}"></a>`

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
    const user = ctx.user();
    const currentIndex = Number(ctx.querystring.split('=')[1] || 1) - 1;
    const questions = ctx.quiz.questions.results;
    const answers = ctx.quiz.answers;
    ctx.render(quizTemplate(ctx.quiz, questions, answers, currentIndex, goBack, onNext, startOver, onSelect, onSubmit));

    function goBack() {
        const currentIndex = Number(ctx.querystring.split('=')[1] || 1) - 1;
        ctx.render(quizTemplate(ctx.quiz, questions, answers, currentIndex, goBack, onNext, startOver, onSelect, onSubmit));
    }

    function onNext() {
        const currentIndex = Number(ctx.querystring.split('=')[1] || 1) - 1;
        ctx.render(quizTemplate(ctx.quiz, questions, answers, currentIndex, goBack, onNext, startOver, onSelect, onSubmit));
    }

    function startOver() {
        if (confirm('Are you sure you want to restart this quiz?')) {
            ctx.clearState();
            ctx.page.redirect(`/quiz/${ctx.params.id}`)
        }
    }

    function onSelect(event) {
        const questionIndex = Number(event.target.name.split('-')[1]);
        answers[questionIndex] = Number(event.target.value);
        ctx.render(quizTemplate(ctx.quiz, questions, answers, currentIndex, goBack, onNext, startOver, onSelect, onSubmit));
    }

    async function onSubmit() {
        const unansweredQuestions = answers.filter(a => a == undefined).length;
        let result = 0;
        if (unansweredQuestions) {
            if (!confirm(`Are you sure you want to submit? You have ${unansweredQuestions} unanswered questions left.`)) {
                return;
            }
        }

        for (let i = 0; i < questions.length; i++) {
            result += Number(answers[i] == questions[i].correctIndex);

        }

        const quizCopy = Object.assign({}, ctx.quiz);
        const solution = await sendSolution(ctx.quiz.objectId, user.objectId, { result, total: questions.length, quizCopy });
        ctx.page.redirect(`/summary/${solution.objectId}`);
    }
}