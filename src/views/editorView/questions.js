import { html, nothing, render } from "../../lib/lit-html.js";

const editorTemplate = (question, questionIndex) => html`   
    <div class="layout">
        <div class="question-control">
            <button class="input submit action"><i class="fas fa-check-double"></i> Save</button>
            <button class="input submit action"><i class="fas fa-times"></i> Cancel</button>
        </div>
        <h3>Question ${questionIndex + 1}</h3>
    </div>
    <form>
        <textarea class="input editor-input editor-text" name="text" placeholder="Enter question">${question ? question.text : nothing}</textarea>
        ${question.answers
        ? question.answers.map((a, answerIndex) =>
            (editAnswerTemplate(a, answerIndex, questionIndex, question.correctIndex == answerIndex)))
        : nothing}
        <div class="editor-input">
            <button class="input submit action"><i class="fas fa-plus-circle"></i>Add answer</button>
        </div>
    </form>`;

const viewTemplate = (question, questionIndex) => html`
<div class="layout">
    <div class="question-control">
        <button class="input submit action"><i class="fas fa-edit"></i> Edit</button>
        <button class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
    </div>
    <h3>Question ${questionIndex + 1}</h3>
</div>
<form>
    <p class="editor-input">${question}</p>
    ${question.answers.map((a, answerIndex) =>
    viewAnswerTemplate(a, answerIndex, questionIndex, question.correctIndex == answerIndex))}
</form>`;

const viewAnswerTemplate = (answer, answerIndex, questionIndex, checked) => html`
<div class="editor-input">
<label class="radio">
    <input class="input" type="radio" name="question-${questionIndex}" value="${answerIndex + 1}" ?checked=${checked} />
    <i class="fas fa-check-circle"></i>
</label>
<span>${answer}</span>
</div>`

const editAnswerTemplate = (answer, answerIndex, questionIndex, checked) => html`
<div class="editor-input">
<label class="radio">
    <input class="input" type="radio" name="question-${questionIndex + 1}" value="${answerIndex + 1}" ?checked=${checked}/>
    <i class="fas fa-check-circle"></i>
</label>
<input class="input" type="text" name="answer-${answerIndex + 1}" .value=${answer}/>
<button class="input submit action"><i class="fas fa-trash-alt"></i></button>
</div>`

// <div class="pad-large alt-page"></div>

export function createQuestionView(question, questionIndex) {
    const element = document.createElement('article');
    element.className = 'editor-question';

    render(editorTemplate(question, questionIndex), element);
    return element;

    function addAnswer() {

    }
}