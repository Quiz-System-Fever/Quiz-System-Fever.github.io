import { html } from "../lib/lit-html.js";
import { createQuiz } from "../services/quizzesService.js";
import { createSubmitHandler } from "../services/utils.js";

const createTemplate = (onSubmit) => html`
<section id="editor">
<header class="pad-large">
    <h1>New quiz</h1>
</header>
<div class="pad-large alt-page">
    <form @submit=${onSubmit}>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title"></label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic">
                <option value="all">All Categories</option>
                <option value="languages">Languages</option>
                <option value="hardware">Hardware</option>
                <option value="software">Tools and Software</option>
            </select>
        </label>
        <input class="input submit action" type="submit" value="Save">
    </form>
</div>
</section>`;

export function createView(ctx){
    ctx.render(createTemplate(createSubmitHandler(ctx, onSubmit)));
}

async function onSubmit(ctx, data, event){
    try {
        if (data.title.trim() == '' || data.topic.trim() == '') {
            throw new Error('All fields are required!');
        }
        const user = ctx.user();
        const userId = user.objectId;

        const quizData = {
            title: data.title,
            topic: data.topic
        }
        
        if (data.questionsCount) {
            quizData.questionsCount = Number(questionsCount)
        }

        await createQuiz(quizData, userId);
        event.target.reset();
        ctx.page.redirect('/browse');
    } catch (error) {
        return ctx.showMessage(error);
    }
}