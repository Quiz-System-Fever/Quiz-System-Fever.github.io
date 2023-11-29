import { get, post } from "./api.js";

const baseUrl = 'https://parseapi.back4app.com/classes/Quizzes';

export const getQuizzes = () => get(baseUrl);
export const getQuizById = (quizId) => get(`${baseUrl}/${quizId}?include=owner`);

export const createQuiz = async (quizData, userId) => {
    const body = Object.assign({}, quizData, {
        owner: {
            __type: 'Pointer',
            'className': '_User',
            objectId: userId,
        }
    })
    await post(baseUrl, body);
};
