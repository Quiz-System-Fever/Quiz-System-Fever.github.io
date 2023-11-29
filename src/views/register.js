import { html } from "../lib/lit-html.js";
import { register } from "../services/userService.js";
import { createSubmitHandler, saveUser } from "../services/utils.js";

const registerTemplate = (onSubmit) => html`
<section id="register">
    <div class="pad-large">
        <div class="glass narrow">
            <header class="tab layout">
                <a class="tab-item" href="/login">Login</a>
                <h1 class="tab-item active">Register</h1>
            </header>
            <form class="pad-med centered" @submit=${onSubmit}>
                <label class="block centered">Username: <input class="auth-input input" type="text" name="username" /></label>
                <label class="block centered">Email: <input class="auth-input input" type="text" name="email" /></label>
                <label class="block centered">Password: <input class="auth-input input" type="password" name="password" /></label>
                <label class="block centered">Repeat: <input class="auth-input input" type="password"name="repass" /></label>
                <input class="block action cta" type="submit" value="Create Account" />
            </form>
            <footer class="tab-footer">
                Already have an account? <a class="invert" href="/login">Sign in here</a>.
            </footer>
        </div>
    </div>
</section>`;

export function registerView(ctx) {
    ctx.render(registerTemplate(createSubmitHandler(ctx, onSubmit)));
}

async function onSubmit(ctx, data, event) {
    try {
        if (data.email.trim() == '' || data.password.trim() == '' || data.username.trim() == '') {
            throw new Error('All fields are required!');
        }

        if (data.password.trim() != data.repass.trim()) {
            throw new Error('Passwords must match!');
        }

        const { objectId, sessionToken } = await register(data.email, data.username, data.password);
        const user = {
            objectId,
            sessionToken,
            email: data.email,
            username: data.username
        }
        saveUser(user);
        event.target.reset();
        ctx.page.redirect('/');
    } catch (error) {
        return ctx.showMessage(error);
    }
}