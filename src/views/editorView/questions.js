import { html, nothing, render } from "../../lib/lit-html.js";
import { createQuestion, deleteQuestion } from "../../services/questionsService.js";
import { createAnswers, viewAnswerTemplate } from "./answers.js";

const editorTemplate = (question, questionIndex, onCancel, onSave) => html`   
    <div class="layout">
        <div class="question-control">
            <button @click=${(event) => onSave(questionIndex, event)} class="input submit action"><i class="fas fa-check-double"></i> Save</button>
            <button @click=${onCancel} class="input submit action"><i class="fas fa-times"></i> Cancel</button>
        </div>
        <h3>Question ${questionIndex + 1}</h3>
    </div>
    <form>
        <textarea class="input editor-input editor-text" name="text" placeholder="Enter question">${question ? question.text : nothing}</textarea>
        ${createAnswers(question.answers, questionIndex, question.correctIndex)}
    </form>`;

const viewTemplate = (question, questionIndex, onEdit, onDelete) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
        <button @click=${onDelete} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
    </div>
    <h3>Question ${questionIndex + 1}</h3>
</div>
<form>
    <p class="editor-input">${question.text}</p>
    ${question.answers.map((a, answerIndex) =>
    viewAnswerTemplate(a, answerIndex, questionIndex, question.correctIndex == answerIndex))}
</form>`;

// <div class="pad-large alt-page"></div>

export function createQuestionView(question, questionIndex, ctx) {
    const quizId = ctx.params.id
    const element = document.createElement('article');
    element.className = 'editor-question';

    render(viewTemplate(question, questionIndex, onEdit, onDelete), element);
    return element;

    function onCancel() {
        render(viewTemplate(question, questionIndex, onEdit, onDelete), element);
    }

    function onEdit() {
        render(editorTemplate(question, questionIndex, onCancel, onSave), element);
    }

    async function onDelete() {
        if (confirm('Are you sure you want to delete this question?')) {
            await deleteQuestion(question.objectId);
            ctx.page.redirect(`/edit/${quizId}`);
        }
    }

    async function onSave(questionIndex, event){
        event.preventDefault();
        const formData = new FormData(element.querySelector('form'));

        const data = {
            text: formData.get('text'),
            answers: [],
            correctIndex: Number(formData.get(`question-${questionIndex}`))
        } 

        for (const pair of formData.entries()) {
            if (pair[0].includes('answer')) {
                data.answers.push(pair[1]);
            }
        }

        await createQuestion(data, quizId);
        ctx.page.redirect(`/edit/${quizId}`);
    }
}