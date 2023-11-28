import page from "./lib/page.mjs";
import { renderContext } from "./middleware/render.js";
import { logout } from "./services/userService.js";
import { userContext } from "./services/utils.js";
import { homeView } from "./views/home.js";
import { loginView } from "./views/login.js";
import { registerView } from "./views/register.js";

page(userContext);
page(renderContext);
page('/', homeView);
page('/login', loginView);
page('/register', registerView);
page('/logout', logout);

page.start();