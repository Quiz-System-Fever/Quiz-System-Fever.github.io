import { html } from "../../lib/lit-html.js";
import { getSolutionById } from "../../services/solutionsService.js";

const summaryTemplate = (quiz, questions, answers) => html`
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
    <article class="preview">
        <span class="s-correct">
            Question 1
            <i class="fas fa-check"></i>
        </span>
        <div class="right-col">
            <button class="action">See question</button>
        </div>
    </article>

    <article class="preview">
        <span class="s-correct">
            Question 2
            <i class="fas fa-check"></i>
        </span>
        <div class="right-col">
            <button class="action">See question</button>
        </div>
    </article>

    <article class="preview">
        <span class="s-incorrect">
            Question 3
            <i class="fas fa-times"></i>
        </span>
        <div class="right-col">
            <button class="action">Reveal answer</button>
        </div>
    </article>

    <article class="preview">
        <span class="s-incorrect">
            Question 4
            <i class="fas fa-times"></i>
        </span>
        <div class="right-col">
            <button class="action">Close</button>
        </div>

        <div>
            <p>
                This is the first question. Veniam unde beatae est ab quisquam quos officia, eius
                harum accusamus adipisci?
            </p>
            <div class="s-answer">
                <span class="s-incorrect">
                    This is answer 1
                    <i class="fas fa-times"></i>
                    <strong>Your choice</strong>
                </span>
            </div>
            <div class="s-answer">
                <span class="s-correct">
                    This is answer 2
                    <i class="fas fa-check"></i>
                    <strong>Correct answer</strong>
                </span>
            </div>
            <div class="s-answer">
                <span>
                    This is answer 3
                </span>
            </div>
    </article>
</div>
</section>`;

export async function summaryView(ctx) {
    const solution = await getSolutionById(ctx.params.id)
    const quiz = solution.quizCopy
    const questions = quiz.questions.results;
    const answers = quiz.answers;
    quiz.summary = answers.reduce((a, cr, i) => a + Number(cr == questions[i].correctIndex), 0);
    quiz.percent = ((quiz.summary / questions.length) * 100).toFixed(0);
    ctx.render(summaryTemplate(quiz, questions, answers));
}