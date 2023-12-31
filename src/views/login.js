import { html } from "../lib/lit-html.js";
import { login } from "../services/userService.js";
import { createSubmitHandler, saveUser } from "../services/utils.js";

const loginTemplate = (onSubmit) => html`
<section id="login">
<div class="pad-large">
    <div class="glass narrow">
        <header class="tab layout">
            <h1 class="tab-item active">Login</h1>
            <a class="tab-item" href="/register">Register</a>
        </header>
        <form class="pad-med centered" @submit=${onSubmit}>
            <label class="block centered">Email: <input class="auth-input input" type="text"
                    name="email" /></label>
            <label class="block centered">Password: <input class="auth-input input" type="password"
                    name="password" /></label>
            <input class="block action cta" type="submit" value="Sign In" />
        </form>
        <footer class="tab-footer">
            Don't have an account? <a class="invert" href="/register">Create one here</a>.
        </footer>
    </div>
</div>
</section>`;

export function loginView(ctx) {
    ctx.render(loginTemplate(createSubmitHandler(ctx, onSubmit)));
}

async function onSubmit(ctx, data, event) {
    try {
        if (data.email.trim() == '' || data.password.trim() == '') {
            throw new Error('All fields are required!');
        }

        const { objectId, sessionToken, username } = await login(data.email, data.password);
        const user = {
            objectId,
            sessionToken,
            email: data.email,
            username
        }
        saveUser(user);
        event.target.reset();
        ctx.page.redirect('/');
    } catch (error) {
        return ctx.showMessage(error);
    }
}