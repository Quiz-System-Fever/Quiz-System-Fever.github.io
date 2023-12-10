const snackbar = document.getElementById("snackbar");

export function messageContext(ctx, next) {
    ctx.showMessage = showMessage;

    next();
}

function showMessage(message) {
    snackbar.className = "show";
    snackbar.textContent = message;

    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}