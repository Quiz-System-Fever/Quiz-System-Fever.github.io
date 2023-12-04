import { html, render } from "../../lib/lit-html.js";

const editAnswerTemplate = (answer, answerIndex, questionIndex, checked, deleteAnswer) => html`
<label class="radio">
    <input class="input" type="radio" name="question-${questionIndex + 1}" value="${answerIndex + 1}" ?checked=${checked}/>
    <i class="fas fa-check-circle"></i>
</label>
<input class="input" type="text" name="answer-${answerIndex + 1}" .value=${answer}/>
<button @click=${(event) => deleteAnswer(answerIndex, event)} class="input submit action">
<i class="fas fa-trash-alt"></i>
</button>`;

export const viewAnswerTemplate = (answer, answerIndex, questionIndex, checked) => html`
<div class="editor-input">
<label class="radio">
    <input class="input" type="radio" name="question-${questionIndex}" value="${answerIndex + 1}" ?checked=${checked} />
    <i class="fas fa-check-circle"></i>
</label>
<span>${answer}</span>
</div>`;

export function createAnswers(answers, questionIndex, correctIndex) {
    const answersCopy = answers.slice();
    const element = document.createElement('div');
    element.className = 'editor-input';

    updateAnswerList();

    return element;

    function updateAnswerList() {
        render(html`
        ${answersCopy.map((answer, answerIndex) =>
            editAnswerTemplate(answer, answerIndex, questionIndex, correctIndex == answerIndex, deleteAnswer))}
        <div class="editor-input">
            <button @click=${addAnswer} class="input submit action"><i class="fas fa-plus-circle"></i>Add answer</button>
        </div>`,
            element);
    }

    function addAnswer(event) {
        event.preventDefault();
        answersCopy.push('');
        updateAnswerList();
    }

    function deleteAnswer(index, event) {
        event.preventDefault();
        answersCopy.splice(index, 1);
        updateAnswerList();
    }
}