import { deleteReq, get, post } from "./api.js";
import { getUser } from "./utils.js";

const baseUrl = 'https://parseapi.back4app.com/classes/Question';

export const createQuestion = async (questionData, quizId) => {
    const userId = getUser().objectId;
    const body = Object.assign({}, questionData, {
        owner: {
            __type: 'Pointer',
            'className': '_User',
            objectId: userId,
        }
    })
    body.quiz = {
        __type: 'Pointer',
        'className': 'Quizzes',
        objectId: quizId,
    }

    return await post(baseUrl, body);
};

export const getQuestionsByQuizId = async (quizId) => {
    const pointer = {
        quiz: {
            __type: 'Pointer',
            'className': 'Quizzes',
            objectId: quizId,
        }
    }

    const stringifyPointer = JSON.stringify(pointer);
    const query = encodeURIComponent(stringifyPointer);

    return await get(baseUrl + '?where=' + query);
}

export const deleteQuestion = (quizId) => deleteReq(`${baseUrl}/${quizId}`, {});