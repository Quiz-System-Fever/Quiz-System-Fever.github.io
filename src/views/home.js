import { html, nothing } from "../lib/lit-html.js";
import { getQuizzes } from "../services/quizzesService.js";

const homeTemplate = (user, quizzes) => html`
<section id="welcome">
<div class="hero layout">
    <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
    <div class="glass welcome">
        <h1>Welcome to Quiz Fever!</h1>
        <p>Home to ${quizzes.length} quizzes in ${quizzes.uniqueTopics} topics. <a href="/browse">Browse all quizzes</a>.</p>
        ${user
        ? nothing
        : html`<a class="action cta" href="/login">Sign in to create a quiz</a>`}
    </div>
</div>
<div class="pad-large alt-page">
    <h2>Our most recent quiz:</h2>
    ${quizTemplate(quizzes[quizzes.length - 1])}
    <div>
        <a class="action cta" href="/browse">Browse all quizzes</a>
    </div>
</div>
</section>`;

const quizTemplate = (quiz) => html`
<article class="preview layout">
<div class="right-col">
    <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
</div>
<div class="left-col">
    <h3>${quiz.title}</h3>
    <span class="quiz-topic">Topic: ${quiz.topic}</span>
    <div class="quiz-meta">
        <span>${quiz.questionCount} questions</span>
        <span>|</span>
        <span>Taken 54 times</span>
    </div>
</div>
</article>`

export async function homeView(ctx) {
    ctx.loader();
    const user = ctx.user();
    const quizzes = await getQuizzes();
    const uniqueTopics = quizzes.results.reduce((a, q) => {
        if (!a.includes(q.topic)) {
            a.push(q.topic);
        }
        return a
    }, []);
    
    quizzes.results.uniqueTopics = uniqueTopics.length;
    ctx.render(homeTemplate(user, quizzes.results));
}