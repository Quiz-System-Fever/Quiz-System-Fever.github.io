import { html, render } from "../lib/lit-html.js";
import { navBarTemplate } from "../views/navBar.js";

const layout = (user, templateResult) => html`
<header id="titlebar">
    ${navBarTemplate(user)}   
</header>
<main id="content">
    ${templateResult}
</main>`;

const root = document.getElementById('container');
const generate = (user, templateResult) => render(layout(user, templateResult), root);

export function renderContext(ctx, next){
    const user = ctx.user();
    ctx.render = generate.bind(null, user);

    next();
}