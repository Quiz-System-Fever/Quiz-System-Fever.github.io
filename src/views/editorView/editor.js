import { html, nothing } from "../../lib/lit-html.js";
import { getQuestionsByQuizId } from "../../services/questionsService.js";
import { createQuiz, getQuizById, updateQuiz } from "../../services/quizzesService.js";
import { createSubmitHandler } from "../../services/utils.js";
import { createQuestionView } from "./questions.js";

const editorTemplate = (onSubmit, quiz, addQuestion) => html`
<section id="editor">
<header class="pad-large">
    <h1>${quiz ? 'Edit quiz' : 'New quiz'}</h1>
</header>
<div class="pad-large alt-page">
    <form @submit=${onSubmit}>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : nothing}>
        </label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic" .value=${quiz ? quiz.topic : nothing}>
                <option value="all">All Categories</option>
                <option value="languages">Languages</option>
                <option value="hardware">Hardware</option>
                <option value="software">Tools and Software</option>
            </select>
        </label>
        <label class="editor-label layout">
            <span class="label-col">Description:</span>
            <textarea class="input" name="description">${quiz ? quiz.description : nothing}</textarea>
        </label>
        <input class="input submit action" type="submit" value="Save">
    </form>
</div>
${quiz ? questionsList(quiz.questions, addQuestion) : nothing}
</section>`;

const questionsList = (questions, addQuestion) => html`
<header class="pad-large">
<h2>Questions</h2>
</header>
<div class="pad-large alt-page">
${questions.map((q, i) => createQuestionView(q, i))}
<article class="editor-question">
<div class="editor-input">
    <button @click=${addQuestion} class="input submit action"><i class="fas fa-plus-circle"></i>Add question</button>
</div>
</article>
</div>`


export async function editorView(ctx) {
    const quizId = ctx.params.id
    let quiz = null
    let questions = [];
    if (quizId) {
        [quiz, questions] = await Promise.all([
            await getQuizById(quizId),
            await getQuestionsByQuizId(quizId)
        ])
        quiz.questions = questions.results;
    }

    ctx.render(editorTemplate(createSubmitHandler(ctx, onSubmit), quiz, addQuestion));

    function addQuestion() {
        questions.results.push({
            text: '',
            answer: [],
            correctIndex: 0
        })
        ctx.render(editorTemplate(createSubmitHandler(ctx, onSubmit), quiz, addQuestion));
    }

    async function onSubmit(ctx, data, event) {
        const quizId = ctx.params.id
        try {
            if (data.title.trim() == '' || data.topic.trim() == '' || data.description.trim() == '') {
                throw new Error('All fields are required!');
            }
            const user = ctx.user();
            const userId = user.objectId;

            const quizData = {
                title: data.title,
                topic: data.topic,
                description: data.description,
                questionCount: questions.length
            }

            if (quizId) {
                await updateQuiz(quizId, quizData);
            } else {
                const result = await createQuiz(quizData, userId);
                ctx.page.redirect(`/edit/${result.objectId}`)
                ctx.showMessage('Quiz created successfully. Please proceed adding with adding questions.');
            }
        } catch (error) {
            return ctx.showMessage(error);
        }
    }
}