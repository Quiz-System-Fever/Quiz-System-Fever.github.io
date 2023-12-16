import { get, post } from "./api.js";

const baseUrl = 'https://parseapi.back4app.com/classes/Solution';

export const getSolutionById = async (solutionId) => await get(`${baseUrl}/${solutionId}`);

export const getSolutionsByOwnerId = async (ownerId) => {
    const pointer = {
        owner: {
            __type: 'Pointer',
            'className': '_User',
            objectId: ownerId,
        }
    }

    const stringifyPointer = JSON.stringify(pointer);
    const query = encodeURIComponent(stringifyPointer);
    return await get(baseUrl + '?where=' + query);
};

export const sendSolution = async (quizId, ownerId, solution) => {
    const body = Object.assign({}, solution);
    body.owner = {
        __type: 'Pointer',
        'className': '_User',
        objectId: ownerId,
    };

    body.quiz = {
        __type: 'Pointer',
        'className': 'Quizzes',
        objectId: quizId,
    };

    return await post(baseUrl, body);
};