let login_label = document.getElementById("login");

// Adds function to the log in button do this for all of the buttons (link format looks ugly)
login_label.addEventListener("click", () => {
    document.location.replace('/login');
})