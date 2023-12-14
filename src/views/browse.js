import { html } from "../lib/lit-html.js";
import { getQuizByQuery, getQuizzes } from "../services/quizzesService.js";

const browseTemplate = (quizzes, onSearch) => html`
<section id="browse">
<header class="pad-large">
    <form class="browse-filter" @submit=${onSearch}>
        <input class="input" type="text" name="query">
        <select class="input" name="topic">
            <option value="all">All Categories</option>
            <option value="it">Languages</option>
            <option value="hardware">Hardware</option>
            <option value="software">Tools and Software</option>
        </select>
        <input class="input submit action" type="submit" value="Filter Quizzes">
    </form>
    <h1>All quizzes</h1>
</header>
<div class="pad-large alt-page">
${quizzes.length
        ? quizzes.map(q => quizTemplate(q))
        : html`<h2>No results. <a class="action cta" href="/create">Create your quiz</a></h2>`}
</div>
</section>`;

const quizTemplate = (quiz) => html`
<article class="preview layout">
<div class="right-col">
    <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
</div>
<div class="left-col">
    <h3><a class="quiz-title-link" href="/details/${quiz.objectId}">${quiz.title}</a></h3>
    <span class="quiz-topic">Topic: ${quiz.topic}</span>
    <div class="quiz-meta">
        <span>${quiz.questionCount} questions</span>
    </div>
</div>
</article>`;

export async function browseView(ctx) {
    ctx.loader();
    const quizzes = await getQuizzes()
    ctx.render(browseTemplate(quizzes.results, onSearch));

    async function onSearch(event) {
        event.preventDefault();
        ctx.loader();
        
        const formData = new FormData(event.target);
        const title = formData.get('query').trim();
        const topic = formData.get('topic').trim();

        const query = {
            title: title ? title : undefined,
            topic: topic
        };

        const queryString = JSON.stringify(query)
        const result = await getQuizByQuery(encodeURIComponent(queryString));
        ctx.render(browseTemplate(result.results, onSearch));
    }
}