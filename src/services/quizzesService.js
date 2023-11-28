import { get } from "./api.js";

const baseUrl = 'https://parseapi.back4app.com/classes/Quizzes';

export const getQuizzes = () => get(baseUrl);