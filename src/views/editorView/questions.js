import { html, nothing, render } from "../../lib/lit-html.js";
import { createQuestion, updateQuestion } from "../../services/questionsService.js";
import { createAnswers, viewAnswerTemplate } from "./answers.js";

const editorTemplate = (question, questionIndex, onCancel, onSave, loading) => html`   
    <div class="layout">
    ${loading ? html`<div class="loading-overlay working"></div>` : nothing}
        <div class="question-control">
            <button @click=${onSave} class="input submit action"><i class="fas fa-check-double"></i> Save</button>
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
        <button @click=${() => onDelete(question.objectId, questionIndex)} class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
    </div>
    <h3>Question ${questionIndex + 1}</h3>
</div>
<form>
    <p class="editor-input">${question.text}</p>
    ${question.answers.map((a, answerIndex) =>
    viewAnswerTemplate(a, answerIndex, questionIndex, question.correctIndex == answerIndex))}
</form>`;

export function createQuestionView(question, questionIndex, ctx, onDelete) {
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

    async function onSave(event) {
        event.preventDefault();
        const formData = new FormData(element.querySelector('form'));

        const data = {
            text: formData.get('text').trim(),
            answers: [],
            correctIndex: Number(formData.get(`question-${questionIndex}`))
        }

        for (const pair of formData.entries()) {
            if (pair[0].includes('answer')) {
                data.answers.push(pair[1].trim());
            }
        }

        try {
            render(editorTemplate(question, questionIndex, onCancel, onSave, true), element);
            if (data.text == '' || data.answers.includes('')) {
                throw new Error('All fields are required!')
            }

            if (question.objectId) {
                await updateQuestion(question.objectId, data);
                Object.assign(question, data);
                ctx.showMessage('Question updated successfully.');
                render(viewTemplate(question, questionIndex, onEdit, onDelete), element);
            } else {
                const result = await createQuestion(data, quizId);
                question.objectId = result.objectId;
                Object.assign(question, data);
                ctx.showMessage('Question created successfully.');
                render(viewTemplate(question, questionIndex, onEdit, onDelete), element);
            }
        } catch (error) {
            ctx.showMessage(error);
            render(editorTemplate(question, questionIndex, onCancel, onSave), element);
        }
    }
}