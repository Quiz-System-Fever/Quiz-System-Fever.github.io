import { html, nothing } from "../../lib/lit-html.js";
import { getSolutionById } from "../../services/solutionsService.js";

const summaryTemplate = (quiz, questions, answers, toggleAnswer) => html`
<section id="summary">
<div class="hero layout">
    <article class="details glass">
        <h1>Quiz Results</h1>
        <h2>${quiz.title}</h2>

        <div class="summary summary-top">${quiz.percent}</div>

        <div class="summary">
        ${quiz.summary}/${questions.length} correct answers
        </div>

        <a class="action cta" href="/quiz/${quiz.objectId}"><i class="fas fa-sync-alt"></i> Retake Quiz</a>
        <a class="action cta" href="#"><i class="fas fa-clipboard-list"></i> See Details</a>

    </article>
</div>

<div class="pad-large alt-page">
${questions.map((q, i) => questionPreviewTemplate(q, i, answers[i], toggleAnswer))}
</div>
</section>`;

const questionPreviewTemplate = (question, questionIndex, chosenIndex, toggleAnswer) => html`
<article class="preview">
<span class="${question.correctIndex == chosenIndex ? 's-correct' : 's-incorrect'}">
    Question ${questionIndex + 1}
    <i class=${question.correctIndex == chosenIndex ? 'fas fa-check' : 'fas fa-times'}></i>
</span>
<div class="right-col">
    <button @click=${(event) => toggleAnswer(event, questionIndex)} class="action">Reveal answer</button>
</div>
<div id="Q${questionIndex + 1}" style="display:none">
    <p>${question.text}</p>
    ${question.answers.map((a, i) =>
    answerTemplate(a, question.correctIndex == chosenIndex, i == question.correctIndex, i == chosenIndex))}
</div>
</article>`;

const answerTemplate = (answer, isCorrect, correctIndex, chosenAnswer) => html`
<div class="s-answer">
<span class="${correctIndex ? 's-correct' : (chosenAnswer && !isCorrect ? 's-incorrect' : '')}">   
${answer}
    ${correctIndex ? html`<i class="fas fa-check"></i><strong>Correct answer</strong>` : nothing}
    ${(chosenAnswer && !isCorrect) ? html`<i class="fas fa-times"></i>` : nothing}
    ${chosenAnswer ? html`<strong> Your choice</strong>` : nothing}
</span>
</div>`;

export async function summaryView(ctx) {
    ctx.loader();
    const solution = await getSolutionById(ctx.params.id);
    const quiz = solution.quizCopy;
    const questions = quiz.questions.results;
    const answers = quiz.answers;
    quiz.summary = answers.reduce((a, cr, i) => a + Number(cr == questions[i].correctIndex), 0);
    quiz.percent = ((quiz.summary / questions.length) * 100).toFixed(0);
    ctx.render(summaryTemplate(quiz, questions, answers, toggleAnswer));

    function toggleAnswer(event, questionIndex) {
        const element = document.getElementById(`Q${questionIndex + 1}`);
        if (element.style.display == 'none') {
            element.style.display = 'block';
            event.target.textContent = 'Close';
        } else {
            element.style.display = 'none';
            event.target.textContent = 'Reveal answer';
        }
    }
}