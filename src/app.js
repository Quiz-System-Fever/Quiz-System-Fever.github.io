import page from "./lib/page.mjs";
import { renderContext } from "./middleware/render.js";
import { logout } from "./services/userService.js";
import { userContext } from "./services/utils.js";
import { browseView } from "./views/browse.js";
import { editorView } from "./views/editorView/editor.js";
import { detailsView } from "./views/details.js";
import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { messageContext } from "./views/message.js";
import { registerView } from "./views/register.js";

page(userContext);
page(renderContext);
page(messageContext);
page('/', homeView);
page('/login', loginView);
page('/register', registerView);
page('/logout', logout);
page('/create', editorView);
page('/browse', browseView);
page('/details/:id', detailsView);
page('/edit/:id', editorView)

page.start();