import { html } from "../lib/lit-html.js";

const loaderTemplate = () => html`
<div class="pad-large alt-page async">
<div class="sk-cube-grid">
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
</div>
</div>`;

export function viewLoader(ctx, next){
    ctx.render(loaderTemplate());

    next();
}