import { post } from "./api.js";
import { removeUser, saveUser } from "./utils.js";

const baseUrl = 'https://parseapi.back4app.com';

export const login = async (email, password) => {
    const user = await post(baseUrl + '/login', { email, password });
    saveUser(user);

    return user;
}
export const register = async (email, username, password) => {
    const user = await post(baseUrl + '/users', { email, username, password });
    saveUser(user);

    return user;
}
export const logout = async (ctx) => {
    await post(baseUrl + '/logout');
    removeUser();
    ctx.page.redirect('/');
}