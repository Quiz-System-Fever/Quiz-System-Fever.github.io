# Quiz-System-Fever
This is a system for creating, completing and managing quizzes with free access. 

## Functionality 
* Registering users.
* Creating observing quizzes for registered users.
* Different quizzes topics.
* Possibility for filtering quizzes by title or topic.
* Statistics for different users.
* Interactive editor for quizzes.
* Interactive UI.

## Technologies 
* HTML, CSS, JavaScript.
* lit-html, page.js.
* GitHub Pages, Back4app.

## Pages
* Welcome page.
* Sing up page.
* Quiz Browser - list of created quizzes with the option to search by topic and title.
* Quiz Details - More information for the quiz, author of the quiz and the option to start the quiz.
* Quiz Contest - answering the quiz questions, each question is in separate view, possibility to restart the contest.
* Quiz Result - summary of the solution, possibility to check the wrong and correct answers, possibility to retake the quiz.
* Profile Page - Information for created quizzes and all quiz solutions.
* Quiz Editor - Editor for quizzes, questions and answers. 

## Data Structure
### Collections 
* Sessions (service)
* Users (service)
```javascript
{
    emails: String,
    username: String,
    password: String
}
```
* Quizzes
```javascript
{
    title: String,
    topic: String,
    questionCount: Number
}
```
* Question
```javascript
{
    owner: Pointer, 
    quiz: Pointer,
    text: String, 
    answers: Array,
    correctIndex: Number
}
```
* Solution
```javascript
{
    owner: Pointer, 
    quiz: Pointer,
    result: Number, 
    total: Number,
    quizCopy: Object
}
```

## Accessibility Control
* Guest users can register, browse quizzes and inspec quiz details.
* Registered users can create, edit, contest quizzes, inspec their solution results.
* Only the creator of a test can edit and delete the quiz.