import { html } from "../lib/lit-html.js";
import { getQuizzes } from "../services/quizzesService.js";

const homeTemplate = (quizzes) => html`
<section id="welcome">
<div class="hero layout">
    <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
    <div class="glass welcome">
        <h1>Welcome to Quiz Fever!</h1>
        <p>Home to 157 quizzes in 12 topics. <a href="/browse">Browse all quizzes</a>.</p>
        <a class="action cta" href="/login">Sign in to create a quiz</a>
    </div>
</div>
<div class="pad-large alt-page">
    <h2>Our most recent quiz:</h2>
    <!--TODO Display most recent quizzes-->
    <div>
        <a class="action cta" href="/browse">Browse all quizzes</a>
    </div>
</div>
</section>`;

const quizTemplate = (quiz) => html`
<article class="preview layout">
<div class="right-col">
    <a class="action cta" href="/quiz/:id">View Quiz</a>
</div>
<div class="left-col">
    <h3>Extensible Markup Language</h3>
    <span class="quiz-topic">Topic: Languages</span>
    <div class="quiz-meta">
        <span>15 questions</span>
        <span>|</span>
        <span>Taken 54 times</span>
    </div>
</div>
</article>`

export function homeView(ctx){
    const allQuizzes = getQuizzes();
    ctx.render(homeTemplate(allQuizzes));
}