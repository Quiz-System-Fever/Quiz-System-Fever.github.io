import { deleteReq, get, post, put } from "./api.js";

const baseUrl = 'https://parseapi.back4app.com/classes/Quizzes';

export const getQuizzes = async () => await get(baseUrl);
export const getQuizById = async (quizId) => await get(`${baseUrl}/${quizId}?include=owner`);

export const createQuiz = async (quizData, userId) => {
    const body = Object.assign({}, quizData, {
        owner: {
            __type: 'Pointer',
            'className': '_User',
            objectId: userId,
        }
    })
    return await post(baseUrl, body);
};

export const getQuizByQuery = (query) => get(`${baseUrl}?where=${query}`);

export const getQuizByUserId = async (userId) => {
    const pointer = {
        owner: {
            __type: 'Pointer',
            'className': '_User',
            objectId: userId,
        }
    }

    const stringifyPointer = JSON.stringify(pointer);
    const query = encodeURIComponent(stringifyPointer);

    return await get(baseUrl + '?where=' + query)
}

export const updateQuiz = async (quizId, quizData) => await put(`${baseUrl}/${quizId}`, quizData);
export const deleteQuiz = async (quizId) => await deleteReq(`${baseUrl}/${quizId}`, {});